import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNumber } from "class-validator"

export class PaginatedDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    page: number

    @ApiProperty({ example: 10 })
    @IsNumber()
    limit: number

    @ApiProperty({ example: 10 })
    @IsNumber()
    total: number

    @ApiProperty({ example: 1 })
    @IsNumber()
    totalPages: number

    @ApiProperty({ example: true })
    @IsBoolean()
    hasNextPage: boolean

    @ApiProperty({ example: true })
    @IsBoolean()
    hasPreviousPage: boolean
}