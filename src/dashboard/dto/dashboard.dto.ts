import { ApiProperty } from "@nestjs/swagger"

export class DashboardDto {
    @ApiProperty({
        description: "Total Users",
        example: 100
    })
    totalUsers: number
    @ApiProperty({
        description: "Total Borrows",
        example: 100
    })
    totalBorrows: number
    @ApiProperty({
        description: "Total Books",
        example: 100
    })
    totalBooks: number
}