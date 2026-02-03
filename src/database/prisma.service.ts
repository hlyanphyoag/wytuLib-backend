import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private prisma;

    constructor() {
        this.prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL }).$extends(withAccelerate());
    }

    async onModuleInit() {
        await this.prisma.$connect();
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
    }

    get user() {
        return this.prisma.user;
    }

    get book() {
        return this.prisma.book;
    }

    get borrow() {
        return this.prisma.borrow;
    }

    get fine() {
        return this.prisma.fine;
    }

    get review() {
        return this.prisma.review;
    }

    get bookAuthor() {
        return this.prisma.bookAuthor;
    }

    get author() {
        return this.prisma.author
    }

    get category() {
        return this.prisma.category;
    }

    get bookView() {
        return this.prisma.bookView;
    }

    // Add other models as needed
}