/*
  model Author {
  id        String   @id @default(cuid())
  name      String
  biography String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  books BookAuthor[]

  @@index([name])
} */

import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BorrowBookDto } from "src/borrows/dto/borrow.dto";


export class CreateAuthorDto {
    @ApiProperty({
        description: "Author name",
        type: String,
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Author biography",
        type: String,
        required: false
    })
    @IsString()
    biography?: string
}

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) { }

export class AuthorDto {
    @ApiProperty({
        description: "Author ID",
        type: String,
        required: true
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: "Author name",
        type: String,
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Author biography",
        type: String,
        required: false,
        nullable: true,
    })
    @IsString()
    biography?: string | null;

    @ApiProperty({
        description: "Author creation date",
        type: Date,
    })
    createdAt: Date;

    @ApiProperty({
        description: "Author update date",
        type: Date,
    })
    updatedAt: Date;
}

export class AuthorQueryDto {
    @ApiProperty({
        description: "page no.",
        type: Number,
        required: false
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @ApiProperty({
        description: "limit no.",
        type: Number,
        required: false
    })
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiProperty({
        description: "search",
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiProperty({
        description: "order",
        required: false,
        enum: ['asc', 'desc'],
        default: 'desc'
    })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    order: 'asc' | 'desc';
}

export class AuthorParamIdDto {
    @ApiProperty({
        description: "author id",
        type: String,
        required: true
    })
    @IsString()
    id: string
}

export class AuthorResponseByIdDto extends AuthorDto {
    @ApiProperty({
        description: "Author books",
        type: [BorrowBookDto],
    })
    books: BorrowBookDto[]
}
