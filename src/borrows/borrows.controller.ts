import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { BorrowParam, BorrowResponseDto, CreateBorrowDto, GetBorrowsParamDto, UpdateBorrowDto } from './dto/borrow.dto';
import { ApiPaginatedResponse } from 'src/decorators/api.paginated-decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

@ApiBearerAuth()
@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}
  
  @Get()
  @ApiPaginatedResponse(BorrowResponseDto)
  async getAllBorrows(@Query() query: GetBorrowsParamDto ) {
    return await this.borrowsService.getAllBorrowsByQuery(query);
  }

  @Get('me')
  @ApiPaginatedResponse(BorrowResponseDto)
  async getMyBorrows(@CurrentUser() user: { sub: string }, @Query() query: GetBorrowsParamDto) {
    return await this.borrowsService.getAllBorrowsByQuery(query, user.sub)
  }

  @Get(':id')
  @ApiResponse({
    type: BorrowResponseDto
  })
  async getBorrowById(@Param() query: BorrowParam){
    return await this.borrowsService.getBorrowById(query.id)
  }

  @Post()
  @ApiProperty({
    description: "Create a new borrow",
    type: CreateBorrowDto
  })
  @ApiResponse({
    type: BorrowResponseDto
  })
  async createBorrow(@Body() createBorrowDto:CreateBorrowDto){
    return await this.borrowsService.createBorrow(createBorrowDto)
  }

  @Patch(':id')
  @ApiProperty({
    description: "Update a borrow",
    type: UpdateBorrowDto
  })
  @ApiResponse({
    type: BorrowResponseDto
  })
  async borrowUpdate(@Param() query: BorrowParam, @Body() updateBorrowDto:UpdateBorrowDto){
    return await this.borrowsService.updateBorrow(updateBorrowDto, query.id)
  }

  @Post(':id/return')
  @ApiResponse({
    type: BorrowResponseDto
  })
  @ApiProperty({
    description: "Return a borrow",
    type: BorrowParam
  })
  async borrowReturn(@Param() query: BorrowParam){
    return await this.borrowsService.borrowReturn(query.id)
  }


  @Delete(':id')
  @ApiResponse({
    example: {
      status: 200,
      message: "Borrow deleted successfully"
    }
  })
  async borrowDelete(@Param() query: BorrowParam){
    return await this.borrowsService.deleteBorrow(query.id)
  }
}
