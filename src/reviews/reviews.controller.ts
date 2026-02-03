import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewsDto, CreateReviewsParamDto, CreateReviewsReplyDto, GetReviewsQueryDto, ReviewsResponseByBookIdDto, ReviewsResponseDto, UpdateReviewsParamDto } from './dto/review.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/api.paginated-decorator';

@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService
  ) {}

  @Post(':bookId')
  @ApiProperty({
    description: "Create a new review",
    type: CreateReviewsDto
  })
  @ApiResponse({
    type: ReviewsResponseDto
  })

  createReview(@Body() CreateReviewsDto: CreateReviewsDto, @Param() param: CreateReviewsParamDto, @CurrentUser() user: { sub: string }) {
    return this.reviewsService.createReview(CreateReviewsDto, param.bookId, user.sub)
  }

  @Get(':bookId')
  @ApiPaginatedResponse(ReviewsResponseByBookIdDto)
  getReviewsByBookId(@Param() param: CreateReviewsParamDto, @Query() query: GetReviewsQueryDto) {
    return this.reviewsService.getReviewsByBookId(query, param.bookId)
  }

  @ApiResponse({
    type: ReviewsResponseDto
  })
  @Patch(':id')
  updateReviews(@CurrentUser() user: { sub: string}, @Param() param: UpdateReviewsParamDto, @Body() updateReviewsDto: CreateReviewsDto) {
    return this.reviewsService.updateReview(param.id, user.sub, updateReviewsDto)
  }


  @Delete(':id')
  deleteReviews(@Param() param: UpdateReviewsParamDto){
    return this.reviewsService.deleteReview(param.id)
  }

  @ApiResponse({
    type: ReviewsResponseDto
  })
  @Post(':reviewId/reply')
  createReplytoReview(@CurrentUser() user: {sub: string}, @Param() param: CreateReviewsReplyDto, @Body() createReviewsDto: CreateReviewsDto){
    return  this.reviewsService.createReviewsReply(user.sub, param.reviewId, createReviewsDto)
  }

  @Get(":reviewId/reply")
  getReplytoReview(@Param() param : CreateReviewsReplyDto) {
    return this.reviewsService.getReplytoReview(param.reviewId)
  }
}
