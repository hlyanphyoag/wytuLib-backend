import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(
        private readonly prima: PrismaService
    ) {}

    async createCategory(createCategoryDto : CreateCategoryDto) {
        const existing = await this.prima.category.findFirst({
            where: {
                name: createCategoryDto.name
            }
        })

        if(existing) throw new ConflictException("Category already exists")

        const category = await this.prima.category.create({
            data: {
                ...createCategoryDto
            }
        })

        return category
    }

    async getAllCategory() {
        const categories = await this.prima.category.findMany()
        return categories
    }

    async getCategoryById(id: string) {
        const category = await this.prima.category.findUnique({
            where: {
                id
            }
        })

        if(!category) throw new NotFoundException("Category not found")

        return category
    }

    async updateCategory(id: string, updateCategoryDto : UpdateCategoryDto){
        const existing = await this.prima.category.findFirst({
            where: { id }
        })

        if(!existing) throw new NotFoundException("Category not found")

        const category = await this.prima.category.update({
            where: {id},
            data: {
                ...updateCategoryDto
            }
        })

        return category
    }

    async deleteCategory(id: string) {
        const existing = await this.prima.category.findFirst({
            where: { id }
        })


        if(!existing) throw new NotFoundException("Category not found")

        await this.prima.category.delete({
            where: {id}
        })

        return {
            status: 200,
            message: "Category deleted successfully"
        }
    }
}
