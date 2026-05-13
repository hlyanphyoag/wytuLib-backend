import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private prisma: PrismaClient;

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });
        this.prisma = new PrismaClient({ adapter });
    }

    async onModuleInit() {
        await this.prisma.$connect();
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
    }

    get user() { return this.prisma.user; }
    get book() { return this.prisma.book; }
    get borrow() { return this.prisma.borrow; }
    get fine() { return this.prisma.fine; }
    get review() { return this.prisma.review; }
    get bookAuthor() { return this.prisma.bookAuthor; }
    get author() { return this.prisma.author; }
    get category() { return this.prisma.category; }
    get bookView() { return this.prisma.bookView; }
}