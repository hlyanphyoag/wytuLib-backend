import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { BorrowBookDto, BorrowResponseDto, CreateBorrowDto, GetBorrowsParamDto, UpdateBorrowDto } from './dto/borrow.dto';
import { toDto } from 'src/libs/utils/toDto';
import { Book, BookStatus, Borrow, BorrowStatus } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { formatDate } from 'src/libs/utils/formatDate';

@Injectable()
export class BorrowsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly resendService: NotificationsService
    ) { }

    /* 
        private async markOverdueBorrows() {
            await this.prisma.borrow.updateMany({
                where: {
                    status: BorrowStatus.ACTIVE,
                    dueDate: { lt: new Date()}
                },
                data: {
                    status: BorrowStatus.OVERDUE
                }
            })
        }
    */

    private getActualStatus(borrow: Borrow) {
        if (borrow.status === BorrowStatus.RETURNED) {
            return BorrowStatus.RETURNED
        } else if (borrow.status === BorrowStatus.ACTIVE && borrow.dueDate < new Date()) {
            return BorrowStatus.OVERDUE
        }
        return borrow.status
    }

    private enrichBorrowdData(borrow: Borrow) {
        const actualStatus = this.getActualStatus(borrow)
        return {
            ...borrow,
            status: actualStatus
        }
    }

    async getAllBorrowsByQuery(getAllBorrowDto: GetBorrowsParamDto, userId?: string) {
        const {
            page = 1,
            limit = 10,
            search,
            borrowDate,
            returnDate,
            status,
        } = getAllBorrowDto

        const skip = (page - 1) * limit;
        const take = Number(limit);

        const where = {
            ...(userId && { userId }),
            ...(status && { status }),
            ...(borrowDate && { borrowDate }),
            ...(returnDate && { returnDate }),
            ...(search && {
                OR: [
                    {
                        book: {
                            OR: [
                                { title: { contains: search, mode: 'insensitive' } },
                                { subtitle: { contains: search, mode: 'insensitive' } }
                            ]
                        }
                    },
                    {
                        user: {
                            OR: [
                                { firstName: { contains: search, mode: 'insensitive' } },
                                { lastName: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } },
                                { studentId: { contains: search, mode: 'insensitive' } }
                            ]
                        }
                    }
                ]
            })
        };

        const data = await this.prisma.borrow.findMany({
            where,
            skip,
            take,
            orderBy: {
                ['borrowDate']: 'desc'
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        coverImage: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            }
        })

        const total = await this.prisma.borrow.count({ where });
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        const metaData = {
            page,
            limit,
            total,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }

        const enrichBorrowedData = data.map(item => this.enrichBorrowdData(item))

        const result = toDto(BorrowResponseDto, enrichBorrowedData)

        return {
            metaData,
            result
        }
    }

    async getBorrowById(id: string) {
        const borrow = await this.prisma.borrow.findUnique({
            where: { id },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        coverImage: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        studentId: true,
                        phone: true
                    }
                }
            }
        })

        return toDto(BorrowResponseDto, borrow)
    }

    async createBorrow(createBorrowDto: CreateBorrowDto) {
        const { duration, ...borrowData } = createBorrowDto

        const existingBorrow = await this.prisma.borrow.findFirst({
            where: {
                userId: borrowData.userId,
                bookId: borrowData.bookId,
                status: {
                    in: [
                        BorrowStatus.ACTIVE,
                        BorrowStatus.OVERDUE
                    ]
                }
            }
        })

        if (existingBorrow) {
            throw new ConflictException("Borrow already exists")
        }

        const bookToBorrow: Book = await this.prisma.book.findUnique({
            where: { id: borrowData.bookId },
            select: {
                id: true,
                availableCopies: true
            }
        })

        if (bookToBorrow && bookToBorrow.availableCopies === 0) {
            throw new BadRequestException("Book not available for borrow")
        }

        const borrow = await this.prisma.borrow.create({
            data: {
                ...borrowData,
                borrowDate: new Date(),
                dueDate: new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000),
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        coverImage: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
        })
        await this.prisma.book.update({
            where: { id: borrowData.bookId },
            data: {
                borrowCount: {
                    increment: 1
                },
                availableCopies: {
                    decrement: 1
                },
                ...(bookToBorrow && bookToBorrow.availableCopies === 1 && {
                    status: BookStatus.BORROWED
                })
            }
        })


        await this.resendService.sendBorrowEmail({
            studentName: borrow.user.firstName + " " + borrow.user.lastName,
            email: borrow.user.email,
            bookTitle: borrow.book.title,
            borrowDate: formatDate(borrow.borrowDate),
            dueDate: formatDate(borrow.dueDate),
        })

        console.log("already sent email for borrow")

        return toDto(BorrowResponseDto, borrow)
    }

    async updateBorrow(updateBorrowDto: UpdateBorrowDto, borrowId: string) {
        const { duration, ...updateBorrowData } = updateBorrowDto
        const existing = await this.prisma.borrow.findUnique({
            where: {
                id: borrowId
            }
        })
        const borrow = await this.prisma.borrow.update({
            where: { id: borrowId },
            data: {
                ...updateBorrowData,
                ...(duration && {
                    dueDate: new Date(existing.borrowDate.getTime() + duration * 24 * 60 * 60 * 1000)
                })
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        coverImage: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        })

        return toDto(BorrowResponseDto, borrow)
    }

    async deleteBorrow(id: string) {
        await this.prisma.borrow.delete({
            where: { id }
        })

        return {
            status: 200,
            message: "Borrow deleted successfully"
        }
    }

    async borrowReturn(borrowId: string) {
        const existingBorrow = await this.prisma.borrow.findUnique({
            where: { id: borrowId }
        });

        // console.log("Existing:", existingBorrow.book.)
        const book = await this.prisma.book.findUnique({
            where: { id: existingBorrow.bookId }
        })

        const shouldUpdateStatus = book.status === BookStatus.BORROWED

        console.log("Should update status:", shouldUpdateStatus)

        if (!existingBorrow) {
            throw new Error('Borrow not found');
        }

        if (existingBorrow.status === BorrowStatus.RETURNED) {
            throw new Error('Book already returned');
        }

        const borrow = await this.prisma.borrow.update({
            where: { id: borrowId },
            data: {
                status: BorrowStatus.RETURNED,
                returnDate: new Date(),
                book: {
                    update: {
                        availableCopies: {
                            increment: 1
                        },
                        ...(shouldUpdateStatus && {
                            status: BookStatus.AVAILABLE
                        })
                    }
                }
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        coverImage: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        })

        console.log("Borrow:", borrow)
        await this.resendService.sendBookReturnEmail({
            studentName: borrow.user.firstName + " " + borrow.user.lastName,
            email: borrow.user.email,
            bookTitle: borrow.book.title,
            borrowDate: formatDate(borrow.borrowDate),
            returnDate: formatDate(borrow.returnDate),
        })

        return toDto(BorrowResponseDto, borrow)
    }

}
