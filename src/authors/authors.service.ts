import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AuthorDto, AuthorQueryDto, CreateAuthorDto, UpdateAuthorDto } from './dto/authors.dto';

@Injectable()
export class AuthorsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createAuthor(createAuthorDto: CreateAuthorDto) {
        const existingAuthor = await this.prisma.author.findFirst({
            where: {
                name: createAuthorDto.name
            }
        })

        if (existingAuthor) {
            throw new ConflictException('Author already exists')
        }

        const author: AuthorDto = await this.prisma.author.create({
            data: {
                ...createAuthorDto
            }
        })

        return author
    }

    async findAllAuthor(getAllAuthorParam: AuthorQueryDto) {
        const {
            page = 1,
            limit = 10,
            search,
            order = 'desc'
        } = getAllAuthorParam

        console.log("Query:", getAllAuthorParam, page, limit, search)

        const skip = (page - 1) * limit
        const take = Number(limit)

        const where = {
            ...(search && {
                OR: [
                    { id: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                    { biography: { contains: search, mode: 'insensitive' } }
                ]
            })
        }

        const total = await this.prisma.author.count({ where })

        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPreviousPage = page > 1

        const authors: AuthorDto[] = await this.prisma.author.findMany({
            where,
            skip,
            take,
            orderBy: {
                ['createdAt']: order
            }
        })

        const nextPage = page < totalPages ? Number(page) + 1 : undefined
        const prevPage = page > 1 ? Number(page) - 1 : undefined

        const metaData = {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages,
            nextPage: Number(nextPage),
            prevPage: Number(prevPage),
            hasNextPage,
            hasPreviousPage,
        }

        return {
            metaData,
            results: authors
        }
    }

    async getAuthorById(authorId: string) {
        const author = await this.prisma.author.findUnique({
            where: { id: authorId },
            include: {
                books: {
                    select: {
                        id: true,
                        book: {
                            select: {
                                id: true,
                                title: true,
                                subtitle: true,
                                coverImage: true
                            }
                        }
                    }
                }
            }
        })

        const books = author.books.map((book) => book.book)

        return {
            ...author,
            books
        }
    }

    async updateAuthor(authorId: string, updateAuthorDto: UpdateAuthorDto) {
        const author = await this.prisma.author.findUnique({
            where: { id: authorId }
        })

        if (!author) throw new NotFoundException('Author not found')

        const updateAuthor: AuthorDto = await this.prisma.author.update({
            where: { id: authorId },
            data: {
                ...updateAuthorDto
            }
        })
        return updateAuthor
    }

    async deleteAuthor(authorId: string) {
        await this.prisma.author.delete({
            where: { id: authorId }
        })

        return {
            status: HttpStatus.OK,
            message: 'Author deleted successfully'
        }
    }
}
