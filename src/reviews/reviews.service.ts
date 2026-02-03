import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReviewsDto, CreateReviewsParamDto, GetReviewsQueryDto, ReviewsDataFromDb, ReviewsResponseDto } from './dto/review.dto';
import { toDto } from 'src/libs/utils/toDto';


@Injectable()
export class ReviewsService {
    constructor(
        private prisma: PrismaService
    ) { }

    async createReview(createReviewsDto: CreateReviewsDto, bookId: string, userId: string) {
        const { rating, comment } = createReviewsDto

        const createdReview = await this.prisma.review.create({
            data: {
                rating,
                comment,
                bookId,
                userId
            },
            include: {
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
        return toDto(ReviewsResponseDto, createdReview)
    }

    async getReviewsByBookId(getReviewsParamDto: GetReviewsQueryDto, bookId: string) {
        const {
            page = 1,
            limit = 10,
            search,
            order = 'desc'
        } = getReviewsParamDto

        const skip = (page - 1) * limit
        const take = Number(limit)

        const where = {
            bookId,
            parentReviewId: null,
            ...(search && { comment: { contains: search, mode: 'insensitive' } })
        }

        const total = await this.prisma.review.count({ where })
        const totalPages = Math.ceil(total / limit)
        const hasNextPage = page < totalPages
        const hasPreviousPage = page > 1

        const data : ReviewsDataFromDb[] = await this.prisma.review.findMany({
            where,
            skip,
            take,
            orderBy: {
                ['createdAt']: order
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
                subReviews: {
                    take: 2,
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        _count: {
                            select: {
                                subReviews: true
                            }
                        }
                    },
                },
                _count: {
                    select: {
                        subReviews: true
                    }
                }
            }
        })

        const metaData = {
            page,
            limit,
            total,
            totalPages,
            hasNextPage,
            hasPreviousPage,
        }

        const result = data.map(review => {
            return {
                ...review,
                subReviews: review.subReviews.length ?
                    review.subReviews.map(subReview => {
                        return {
                            ...subReview,
                            replyCount: subReview._count.subReviews,
                            _count: undefined
                        }
                    })
                    :
                    undefined,
                replyCount: review._count.subReviews,
                _count: undefined
            }
        })
        return {
            ...metaData,
            result
        }
    }

    async updateReview(id: string, userId: string, updateReviewsDto: CreateReviewsDto) {

        const existingReview = await this.prisma.review.findUnique({
            where: { id }
        })

        if (!existingReview) throw new BadRequestException("Review not found")

        if (existingReview.userId !== userId) throw new BadRequestException("You are not allowed to update this review")

        const data = await this.prisma.review.update({
            where: { id },
            data: {
                ...updateReviewsDto
            },
            include: {
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

        return toDto(ReviewsResponseDto, data)
    }

    async deleteReview(id: string) {
        await this.prisma.review.delete({
            where: { id }
        })

        return {
            status: HttpStatus.OK,
            message: 'Review deleted successfully'
        }
    }

    async createReviewsReply(userId: string, reviewId: string, createReviewsDto: CreateReviewsDto) {

        const parent = await this.prisma.review.findUnique({
            where: { id: reviewId },
            select: {
                id: true,
                bookId: true
            }
        })

        if (!parent) throw new BadRequestException("Review not found");

        const createReply = await this.prisma.review.create({
            data: {
                ...createReviewsDto,
                userId,
                bookId: parent.bookId,
                parentReviewId: reviewId
            },
            include: {
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
        return toDto(ReviewsResponseDto, createReply)
    }

    async getReplytoReview(reviewId: string) {

        const existingReview = await this.prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        if (!existingReview) throw new BadRequestException("Review not found");

        const recursiveQuering = async (reviewId: string) => {
            const replies = await this.prisma.review.findMany({
                where: {
                    parentReviewId: reviewId
                },
                include: {
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

            return Promise.all(
                replies.map(async (reply) => {
                    const children = await recursiveQuering(reply.id)
                    return children.length ?
                        {
                            ...reply, subReviews: children
                        } : {
                            ...reply
                        }
                })
            )
        }
        return await recursiveQuering(reviewId)
    }
}
