import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryIdDto, CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({
    description: "Category created successfully",
    type: CategoryResponseDto
  })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto)
  }

  @Get()
  @ApiResponse({
    description: "Get all categories",
    type: [CategoryResponseDto]
  })
  getAllCategory() {
    return this.categoryService.getAllCategory()
  }

  @Get(":id")
  @ApiResponse({
    description: "Get category by id",
    type: CategoryResponseDto
  })
  getCategoryById(@Param() param: CategoryIdDto) {
    return this.categoryService.getCategoryById(param.id) 
  }

  @Patch(":id")
  @ApiResponse({
    description: "Update category by id",
    type: CategoryResponseDto
  })
  updateCategory(@Param() param: CategoryIdDto, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(param.id, updateCategoryDto)
  }

  @Delete(":id")
  @ApiResponse({
    description: "Delete category by id",
    example: {
      status: 200,
      message: "Category deleted successfully"
    }
    })
    deleteCategory(@Param() param: CategoryIdDto){
      return this.categoryService.deleteCategory(param.id)
    }
}
