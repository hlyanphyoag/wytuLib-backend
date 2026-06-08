import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        description: "User email",
        example: "hlyanphyo@gmail.com",
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "User first name",
        example: "John",
        required: true,
        minLength: 3
    })
    @IsString()
    @MinLength(3)
    firstName: string;

    @ApiProperty({
        description: "User last name",
        example: "Doe",
        required: true,
        minLength: 3
    })
    @IsString()
    @MinLength(3)
    lastName: string;

    @ApiProperty({
        description: "User password",
        example: "password",
        required: true,
        minLength: 4
    })
    @IsString()
    @MinLength(4)
    password: string;

    @ApiProperty({
        description: "User student ID",
        example: "12345678",
        required: true
    })
    @IsString()
    studentId: string

    @ApiProperty({
        description: "User phone number",
        example: "12345678",
        required: true
    })
    @IsString()
    phone: string
}

export class CreateAdminDto extends OmitType(RegisterDto, ['studentId', 'phone'] as const) { 
    @ApiProperty({
        description: "User role",
        example: "ADMIN",
        required: true
    })
    @IsString()
    role: "ADMIN"
}


export class SignInDto {
    @ApiProperty({
        description: "User email",
        example: "hlyanphyo@gmail.com",
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "User password",
        example: "password",
        required: true,
        minLength: 4
    })
    @IsString()
    @MinLength(4)
    password: string;
}

export class RefreshDto {
    @ApiProperty({
        description: "Refresh token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        required: true
    })
    @IsString()
    refreshToken: string
}

export class AuthResponseDto {
    @ApiProperty({
        description: "Access token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    accessToken: string;

    @ApiProperty({
        description: "User object",
        example: {
            id: "12345678",
            email: "hlyanphyo@gmail.com",
            username: "hlyanphyo",
            role: "STUDENT"
        },
    })
    user: {
        id: string;
        email: string;
        username: string;
        role: "STUDENT" | "ADMIN";
    };
}
