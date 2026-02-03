import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GetBorrowsParamDto {
  @ApiProperty({
    minimum: 1,
    description: "Page number",
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    minimum: 1,
    description: "Page size",
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: "Search query",
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "Borrow status",
    required: false,
    enum: ["ACTIVE", "RETURNED", "OVERDUE", "LOST"]
  })
  @IsOptional()
  @IsEnum(["ACTIVE", "RETURNED", "OVERDUE", "LOST"])
  status?: "ACTIVE" | "RETURNED" | "OVERDUE" | "LOST";

  @ApiProperty({
    description: "Borrow date",
    required: false,
    type: String,
    format: "date-time"
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  borrowDate?: Date;

  @ApiProperty({
    description: "Return date",
    required: false,
    type: String,
    format: "date-time"
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;

  @ApiProperty({
    description: "Whether the book was returned",
    required: false
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  returned?: boolean;
}

export class BorrowUserDto {
  @Expose()
  @ApiProperty({ example: "cmjyfbfuy0000fieo..." })
  id: string;

  @Expose()
  @ApiProperty({ example: "john" })
  firstName: string;

  @Expose()
  @ApiProperty({ example: "doe" })
  lastName: string;

  @Expose()
  @ApiProperty({ example: "john@example.com" })
  email: string;

  @Expose()
  @ApiProperty({ example: "123456789" })
  studentId: string;

  @Expose()
  @ApiProperty({ example: "0912345678" })
  phone: string;
}

export class BorrowBookDto {
  @Expose()
  @ApiProperty({ example: "cmjyfbfuy0000fieo..." })
  id: string;

  @Expose()
  @ApiProperty({ example: "Clean Code" })
  title: string;

  @Expose()
  @ApiProperty({ example: "A Handbook of Agile Software Craftsmanship", required: false })
  subtitle?: string;

  @Expose()
  @ApiProperty({ example: "https://example.com/cover.jpg", required: false })
  coverImage?: string;
}

export class BorrowResponseDto {
  @Expose()
  @ApiProperty({ example: "cmjyfbfuy0000fieo..." })
  id: string;

  @Expose()
  @ApiProperty({ example: "2023-01-01T00:00:00.000Z" })
  borrowDate: Date;

  @Expose()
  @ApiProperty({ example: "2023-01-15T00:00:00.000Z" })
  dueDate: Date;

  @Expose()
  @ApiProperty({ example: "2023-01-10T00:00:00.000Z", required: false })
  returnDate?: Date;

  @Expose()
  @ApiProperty({
    enum: ["ACTIVE", "RETURNED", "OVERDUE", "LOST"],
    example: "ACTIVE"
  })
  status: "ACTIVE" | "RETURNED" | "OVERDUE" | "LOST";

  @Expose()
  @ApiProperty({ example: 0 })
  renewalCount: number;

  @Expose()
  @ApiProperty({ example: "Returned in good condition", required: false })
  notes?: string;

  @Expose()
  @ApiProperty({ type: () => BorrowUserDto })
  @Type(() => BorrowUserDto)
  user: BorrowUserDto;

  @Expose()
  @ApiProperty({ type: () => BorrowBookDto })
  @Type(() => BorrowBookDto)
  book: BorrowBookDto;
}

export class CreateBorrowDto {
  @ApiProperty({
    description: "User ID",
    example: "cmjyfbfuy0000fieo...",
    required: true
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Book ID",
    example: "cmjyfbfuy0000fieo...",
    required: true
  })
  @IsString()
  bookId: string;

  @ApiProperty({
    description: "Duration of borrow",
    example: "3",
    required: true
  })
  @Type(() => Number)
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: "Notes",
    required: false,
    example: "Returned in good condition"
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBorrowDto extends PartialType(CreateBorrowDto) {
  @ApiProperty({
    description: "return of borrow",
    example: "3",
    required: false
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;
}

export class BorrowParam {
  @ApiProperty({
    description: "Borrow ID",
    required: true,
  })
  @IsString()
  id: string
}



