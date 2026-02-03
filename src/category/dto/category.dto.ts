import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: "Category name",
        type: String,
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Category description",
        type: String,
        required: false
    })
    @IsString()
    description?: string
}

export class UpdateCategoryDto extends CreateCategoryDto {}

export class CategoryIdDto {
    @ApiProperty({
        description: "Category ID",
        type: String,
        required: true
    })
    @IsString()
    id: string
}

export class CategoryResponseDto {
    @ApiProperty({
        description: "Category ID",
        type: String,
        required: true
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: "Category name",
        type: String,
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Category description",
        type: String,
        required: false
    })
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Category creation date",
        type: Date,
    })
    createdAt: Date;

    @ApiProperty({
        description: "Category update date",
        type: Date,
    })
    updatedAt: Date;
}