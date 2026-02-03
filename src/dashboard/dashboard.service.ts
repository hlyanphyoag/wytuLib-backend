import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getDashboard() {
        const totalUsers = await this.prisma.user.count()
        const totalBorrows = await this.prisma.borrow.count()
        const totalBooks = await this.prisma.book.count()

        return {
            totalUsers,
            totalBorrows,
            totalBooks
        }
    }
}
