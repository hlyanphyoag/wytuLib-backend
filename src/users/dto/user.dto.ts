import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Min, MinLength } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BorrowStatus } from "@prisma/client";

export enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT"
}

export enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}

export class GetUsersQueryDto {
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
        description: "Page number",
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
        description: "User role",
        required: false,
        enum: UserRole,
        default: UserRole.STUDENT
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({
        description: "Sort order",
        required: false,
        enum: SortOrder,
        default: SortOrder.DESC
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;

    @ApiProperty({
        description: "Sort by",
        default: "registeredAt",
        required: false
    })
    @IsOptional()
    @IsString()
    sortBy?: string = "registeredAt";
}


export class UserResponseDto {
    @Expose()
    @ApiProperty({ example: 'cmjyfbfuy0000fieo...' })
    id: string;

    @Expose()
    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @Expose()
    @ApiProperty({ example: 'john' })
    firstName: string;

    @Expose()
    @ApiProperty({ example: 'doe' })
    lastName: string;

    @Expose()
    @ApiProperty({ enum: ['STUDENT', 'ADMIN'], example: 'STUDENT' })
    role: 'STUDENT' | 'ADMIN';

    @Expose()
    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    registeredAt: Date;

    @Expose()
    @ApiProperty({ example: 'true' })
    isActive: boolean;

    @Expose()
    @ApiProperty({ example: 'STU-2024-001', required: false, nullable: true })
    studentId?: string | null;

    @Expose()
    @ApiProperty({ example: '+1234567890', required: false, nullable: true })
    phone?: string | null;

    @Expose()
    @ApiProperty({ example: '123 Main St, New York, NY 10001', required: false, nullable: true })
    address?: string | null;

    @Expose()
    @ApiProperty({ example: '1990-01-15', required: false, nullable: true })
    dateOfBirth?: Date | null;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}

export class GetUserDetailsResponse extends UserResponseDto {
    @Expose()
    @ApiProperty({ example: 'cmjyfbfuy0000fieo...' })
    borrows: {
        id: string;
        book: {
            id: string;
            title: string;
            subtitle: string | null;
            isbn: string;
            coverImage: string | null;
            coverColor: string | null;
        };
        borrowDate: Date;
        returnDate: Date | null;
        dueDate: Date;
        status: BorrowStatus;
    }[];
}

export class UpdateUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
        required: false,
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        required: false,
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({
        description: 'User password (will be hashed)',
        example: 'StrongP@ssw0rd',
        required: false,
        minLength: 8,
    })
    @IsString()
    @MinLength(4)
    @IsOptional()
    password?: string;

    @ApiProperty({
        description: 'User role',
        enum: UserRole,
        example: UserRole.STUDENT,
        required: false,
    })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @ApiProperty({
        description: 'Whether the user account is active',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({
        description: 'Student ID number',
        example: 'STU-2024-001',
        required: false,
    })
    @IsString()
    @IsOptional()
    studentId?: string;

    @ApiProperty({
        description: 'User phone number',
        example: '+1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: 'User physical address',
        example: '123 Main St, New York, NY 10001',
        required: false,
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: 'User date of birth (ISO 8601 format)',
        example: '1990-01-15',
        required: false,
        format: 'date',
    })
    @IsString()
    @IsOptional()
    dateOfBirth?: string;
}

export class ChangePasswordDto {
    @ApiProperty({
        description: 'User current password',
        example: 'StrongP@ssw0rd',
        required: true,
    })
    @IsString()
    @MinLength(4)
    currentPassword: string;

    @ApiProperty({
        description: 'User new password',
        example: 'StrongP@ssw0rd',
        required: true,
    })
    @IsString()
    @MinLength(4)
    newPassword: string;

    @ApiProperty({
        description: 'User new password',
        example: 'StrongP@ssw0rd',
        required: true,
    })
    @IsString()
    @MinLength(4)
    confirmPassword: string;
}
