import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BorrowStatus } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { formatDate } from "src/libs/utils/formatDate";

@Injectable()
export class borrowSchedulerService {
    constructor(
        private prisma: PrismaService,
        private readonly resendService: NotificationsService
    ) { }

    @Cron('45 * * * * *') //'45 * * * * *'
    async syncOverdueStatus() {
        const overdueBorrows = await this.prisma.borrow.updateMany({
            where: {
                status: BorrowStatus.ACTIVE,
                dueDate: { lt: new Date() }
            },
            data: {
                status: BorrowStatus.OVERDUE
            }
        })

        if (overdueBorrows && overdueBorrows.count > 0) {
            await this.sendOverdueNotifications()
        }
    }

    async sendOverdueNotifications() {
        const overdueBorrows = await this.prisma.borrow.findMany({
            where: {
                status: BorrowStatus.OVERDUE,
                overdueNotified: false
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        coverImage: true,
                    }
                }
            }
        })

        console.log("OverDueBorrow:", overdueBorrows)
        /* 
            send email implementation
        */
        overdueBorrows.map(async (item) => {
            await this.resendService.sendOverdueEmail({
                studentName: item.user.firstName + " " + item.user.lastName,
                email: item.user.email,
                bookTitle: item.book.title,
                dueDate: formatDate(item.dueDate)
            })

            await this.prisma.borrow.update({
                where: { id: item.id },
                data: {
                    overdueNotified: true
                }
            })
        })
    }


    // @Cron('45 * * * * *')
    async sendAlertBeforeOverdue() {
        console.log("Hit Alert Before Overdue")
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const oneDayFromNow = new Date(now);
        oneDayFromNow.setDate(oneDayFromNow.getDate() + 1); // ✅ Correct

        const twoDayFromNow = new Date(now);
        twoDayFromNow.setDate(twoDayFromNow.getDate() + 2); // ✅ Correct

        console.log("OneDayFrom:", oneDayFromNow)
        console.log("TwoDayFrom:", twoDayFromNow)

        const dueTomorrow = await this.prisma.borrow.findMany({
            where: {
                status: BorrowStatus.ACTIVE,
                dueDate: {
                    gte: oneDayFromNow,
                    lt: twoDayFromNow
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        coverImage: true,
                    }
                }
            }
        })

        console.log("DueTomorrow:", dueTomorrow)

        for (const borrow of dueTomorrow) {
            console.log("BorrowFrom alert")
            await this.resendService.sendBeforeOverdueEmail({
                studentName: borrow.user.firstName + " " + borrow.user.lastName,
                email: borrow.user.email,
                bookTitle: borrow.book.title,
                borrowDate: formatDate(borrow.borrowDate),
                dueDate: formatDate(borrow.dueDate),
            })
        }
    }
}

