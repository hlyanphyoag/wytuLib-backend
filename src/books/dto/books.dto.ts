import { ApiProperty } from "@nestjs/swagger";
import { BookStatus } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateBookDto {
    @ApiProperty({
        example: '978-3-16-148410-0',
        required: true
    })
    @IsString()
    isbn: string;

    @ApiProperty({
        example: 'The Great Gatsby',
        required: true
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: 'The Great Gatsby',
        required: false
    })
    @IsOptional()
    @IsString()
    subtitle?: string;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 'Edititon-3',
        required: false
    })
    @IsOptional()
    @IsString()
    edition?: string;

    @ApiProperty({
        example: 443,
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    pages?: number;

    @ApiProperty({
        example: 'https://example.com/cover.jpg',
        required: false
    })
    @IsOptional()
    @IsString()
    coverImage?: string;

    @ApiProperty({
        example: '#6b4f3a',
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsString()
    coverColor?: string;

    @ApiProperty({
        example: 'https://example.com/book.pdf',
        required: false
    })
    @IsOptional()
    @IsUrl()
    downloadLink?: string;

    @ApiProperty({
        example: 10,
        required: true
    })
    @Type(() => Number)
    totalCopies: number;

    @ApiProperty({
        example: 10,
        required: true
    })
    @Type(() => Number)
    availableCopies: number;

    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        description: 'Category ID',
        required: true
    })
    @IsString()
    categoryId: string;

    @ApiProperty({
        example: ['cmjyfbfuy0000fieo...', 'cmjyfbfuy0001fieo...'],
        description: 'Array of author IDs',
        required: true,
        type: [String]
    })
    @IsString({ each: true })
    authorIds: string[];
}

export class GetBookQueryDto {
    @ApiProperty({
        example: 1,
        default: 1,
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    page: number

    @ApiProperty({
        example: 10,
        default: 10,
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    limit: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: 'Status',
        default: BookStatus.AVAILABLE,
        enum: BookStatus,
        required: false
    })
    @IsEnum(BookStatus)
    status?: BookStatus = BookStatus.AVAILABLE

    @ApiProperty({
        description: 'SortBy',
        default: 'createdAt',
        required: false
    })
    sortBy?: string = 'createdAt'

    @ApiProperty({
        description: 'Sort Order',
        default: 'desc',
        enum: ['desc', 'asc'],
        required: false
    })
    @IsEnum(['desc', 'asc'])
    sortOrder?: string = 'desc'

    @ApiProperty({
        example: 'Fiction',
        required: false
    })
    @IsOptional()
    category?: string;
}

export class GetBooksResponseDto {
    @ApiProperty({ example: 'cmjyfbfuy0000fieo...' })
    id: string;

    @ApiProperty({ example: '978-3-16-148410-0' })
    isbn: string;

    @ApiProperty({ example: 'The Great Gatsby' })
    title: string;

    @ApiProperty({ example: 'The Great Gatsby' })
    subtitle: string;

    @ApiProperty({ example: 'The Great Gatsby' })
    description: string;

    @ApiProperty({ example: 'The Great Gatsby' })
    edition: string;

    @ApiProperty({ example: 443 })
    pages: number;

    @ApiProperty({ example: 'https://example.com/cover.jpg' })
    coverImage: string;

    @ApiProperty({ example: '#6b4f3a', required: false, nullable: true })
    coverColor?: string | null;

    @ApiProperty({ example: 'https://example.com/book.pdf', required: false, nullable: true })
    downloadLink?: string | null;

    @ApiProperty({ example: 10 })
    totalCopie: number;

    @ApiProperty({ example: BookStatus.AVAILABLE })
    status: BookStatus;

    @ApiProperty({ example: 10 })
    viewCount: number;

    @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
    updatedAt: Date;

    @Exclude()
    categoryId: string;

    @ApiProperty({
        example: {
            id: 'cmjyfbfuy0000fieo...',
            name: 'Fiction'
        }
    })
    category: {
        id: string;
        name: string
    }

    @ApiProperty({
        example: [
            {
                id: 'cmjyfbfuy0000fieo...',
                name: 'John Doe'
            }
        ]
    })
    authors: {
        author: {
            id: string;
            name: string;
        }
    }[]
}

export class UpdateBookDto {
    @ApiProperty({
        example: '978-3-16-148410-0',
        required: false
    })
    @IsString()
    @IsOptional()
    isbn?: string

    @ApiProperty({
        example: 'The Great Gatsby',
        required: false
    })
    @IsString()
    @IsOptional()
    title?: string

    @ApiProperty({
        example: 'The Great Gatsby',
        required: false
    })
    @IsString()
    @IsOptional()
    subtitle?: string

    @ApiProperty({
        example: 'The Great Gatsby',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({
        example: 'The Great Gatsby',
        required: false
    })
    @IsString()
    @IsOptional()
    edition?: string

    @ApiProperty({
        example: 443,
        required: false
    })
    @Type(() => Number)
    @IsOptional()
    pages?: number

    @ApiProperty({
        example: 'https://example.com/cover.jpg',
        required: false
    })
    @IsString()
    @IsOptional()
    coverImage?: string

    @ApiProperty({
        example: '#6b4f3a',
        required: false,
        nullable: true
    })
    @IsString()
    @IsOptional()
    coverColor?: string | null

    @ApiProperty({
        example: 'https://example.com/book.pdf',
        required: false,
        nullable: true
    })
    @IsOptional()
    @IsUrl()
    downloadLink?: string | null

    @ApiProperty({
        example: 10,
        required: false
    })
    @Type(() => Number)
    @IsOptional()
    totalCopies?: number

    @ApiProperty({
        example: BookStatus.AVAILABLE,
        required: false
    })
    @IsEnum(BookStatus)
    @IsOptional()
    status?: BookStatus

    @ApiProperty({
        example: 10,
        required: false
    })
    @Type(() => Number)
    @IsOptional()
    viewCount?: number

    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        required: false
    })
    @IsString()
    @IsOptional()
    categoryId?: string
}

export class DeleteBookAuthorDto {
    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        required: true,
    })
    @IsString()
    bookId: string

    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        required: true,
    })
    @IsString()
    currentAuthorId: string
}

export class UpdateBookAuthorParamDto {
    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        required: true,
    })
    @IsString()
    bookId: string

    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        required: true,
    })
    @IsString()
    currentAuthorId: string
}

export class UpdateBookAuthorBodyDto {
    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        required: true,
    })
    @IsString()
    newAuthorId: string
}




export class AddBookAuthorDto {
    @ApiProperty({
        example: 'cmjyfbfuy0000fieo...',
        required: true,
    })
    @IsString()
    authorId: string
}
