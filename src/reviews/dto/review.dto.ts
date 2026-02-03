/* 
    model Review {
  id        String   @id @default(cuid())
  rating    Int // 1-5 stars
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Foreign Keys
  userId String
  bookId String

  // Relations
  user User @relation(fields: [userId], references: [id])
  book Book @relation(fields: [bookId], references: [id])

  @@unique([userId, bookId]) // One review per user per book
  @@index([bookId])
  @@index([rating])
}
*/

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"
import { BorrowBookDto, BorrowUserDto } from "src/borrows/dto/borrow.dto"


export class CreateReviewsDto {
    @ApiProperty({
        description: "Rating from 1 to 5 stars",
        minimum: 1,
        maximum: 5,
        type: Number,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number

    @ApiProperty({
        description: "Comment",
        type: String,
        required: false
    })
    @IsString()
    @Min(2)
    @Max(500)
    comment?: string
}

export class CreateReviewsParamDto {
    @ApiProperty({
        description: "Book ID",
        type: String,
        required: true
    })
    @IsString()
    bookId: string
}

export class CreateReviewsReplyDto {
    @ApiProperty({
        description: "ReviewID",
        type: String,
        required: true
    })
    @IsString()
    reviewId: string
}

export class ReviewsResponseDto {
    @Expose()
    @ApiProperty({
        description: "Review ID",
        type: String,
        example: "cmjyfbfuy0000fieo..."
    })
    id: string

    @Expose()
    @ApiProperty({
        description: "Rating from 1 to 5 stars",
        example: 4
    })
    rating: number

    @Expose()
    @ApiProperty({
        description: "Comment",
        example: "Great book!"
    })
    comment?: string

    @Expose()
    @ApiProperty({
        description: "Review creation date",
        example: "2023-01-01T00:00:00.000Z"
    })
    createdAt: Date

    @Expose()
    @ApiProperty({
        description: "Review update date",
        example: "2023-01-01T00:00:00.000Z"
    })
    updatedAt: Date

    @Expose()
    @ApiProperty({
        type: BorrowUserDto
    })
    user: BorrowUserDto
}

export class GetReviewsQueryDto {
    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        default: 1,
        minimum: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Search term for filtering reviews'
    })
    @IsOptional()
    @IsString()
    search?: string;

    
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc';
}

export class UpdateReviewsParamDto {
    @ApiProperty({
        description: "Borrow Id"
    })
    @IsString()
    id: string
}

export interface ReviewsDataFromDb{
  id: string;
  rating: number | null;
  comment: string;
  createdAt: Date;          // or string if your API returns ISO text
  updatedAt: Date;          // same note as above
  userId: string;
  bookId: string;
  parentReviewId: string | null;
  user: BorrowUserDto;
  subReviews: ReviewsDataFromDb[];     // recursive
  _count: { subReviews: number };
}


export class ReviewsResponseByBookIdDto extends ReviewsResponseDto {
    @Expose()
    @ApiProperty({
        type: [ReviewsResponseByBookIdDto],
        required: false
    })
    @Type(() => ReviewsResponseByBookIdDto)
    subReviews?: ReviewsResponseByBookIdDto[]

    @Expose()
    @ApiProperty({
        description: "Number of replies to this review",
        example: 0
    })
    replyCount: number
}
