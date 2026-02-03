import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorDto, AuthorParamIdDto, AuthorQueryDto, AuthorResponseByIdDto, CreateAuthorDto, UpdateAuthorDto } from './dto/authors.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorators/api.paginated-decorator';

@ApiBearerAuth()
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }
  @Post()
  @ApiResponse({
    type: AuthorDto
  })
  createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.createAuthor(createAuthorDto)
  }

  @Get()
  @ApiPaginatedResponse(AuthorDto)
  findAllAuthor(@Query() query: AuthorQueryDto) {
    return this.authorsService.findAllAuthor(query)
  }

  @Get(":id")
  @ApiResponse({
    type: AuthorResponseByIdDto
  })
  getAuthorById(@Param() param: AuthorParamIdDto) {
    return this.authorsService.getAuthorById(param.id)
  }

  @Patch(":id")
  @ApiResponse({
    type: AuthorDto
  })
  updateAuthor(@Param() param: AuthorParamIdDto, @Body() updateAuthor: UpdateAuthorDto) {
    return this.authorsService.updateAuthor(param.id, updateAuthor)
  }

  @Delete(":id")
  @ApiResponse({
    example: {
      status: 200,
      message: "Author deleted successfully"
    }
  })
  deleteAuthor(@Param() param: AuthorParamIdDto) {
    return this.authorsService.deleteAuthor(param.id)
  }
}
