import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AddBookAuthorDto, CreateBookDto, DeleteBookAuthorDto, GetBookQueryDto, GetBooksResponseDto, UpdateBookAuthorBodyDto, UpdateBookAuthorParamDto, UpdateBookDto } from './dto/books.dto';
import { ApiPaginatedResponse } from 'src/decorators/api.paginated-decorator';
import { Role, Roles } from 'src/decorators/role.decorators';



@ApiBearerAuth()
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  @ApiPaginatedResponse(GetBooksResponseDto)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@Query() query: GetBookQueryDto) {
    return this.booksService.findAll(query)
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetBooksResponseDto
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.booksService.fineOne(id)
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetBooksResponseDto
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto)
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetBooksResponseDto
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.updateBook(id, updateBookDto)
  }

  @Post(':bookId/author')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetBooksResponseDto
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async addBookAuthor(@Param('bookId') bookId: string, @Body() addBookAuthorDto: AddBookAuthorDto) {
    return this.booksService.addNewBookAuthor(bookId, addBookAuthorDto)
  }

  @Patch(':bookId/authors/:currentAuthorId')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetBooksResponseDto
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateBookAuthor(@Param() updateBookAuthorParamDto: UpdateBookAuthorParamDto, @Body() updateBookAuthorBodyDto: UpdateBookAuthorBodyDto) {
    return this.booksService.updateBookAuthor(updateBookAuthorParamDto, updateBookAuthorBodyDto)
  }


  @Delete(':bookId/authors/:currentAuthorId')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      status: HttpStatus.OK,
      message: 'Author deleted successfully',
    }
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteBookAuthor(@Param() deleteBookAuthorDto: DeleteBookAuthorDto) {
    return this.booksService.deleteBookAuthor(deleteBookAuthorDto)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book deleted successfully'
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(id)
  }
}
