import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PresignedUrlRequestDto {
    @ApiProperty({
        description: 'Original name of the file including extension',
        example: 'book.pdf',
    })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({
        description: 'MIME type of the file',
        example: 'application/pdf',
    })
    @IsString()
    @IsNotEmpty()
    contentType: string;

    @ApiProperty({
        description: 'Folder path in bucket',
        example: 'wytuLib-files',
        required: false,
    })
    @IsString()
    @IsOptional()
    folder?: string;
}

export class PresignedUrlResponseDto {
    @ApiProperty({ example: 'https://...' })
    uploadUrl: string;

    @ApiProperty({ example: 'wytuLib-files/1700000000-abc123-book.pdf' })
    key: string;

    @ApiProperty({ example: 'https://pub-xxx.r2.dev/wytuLib-files/1700000000-abc123-book.pdf' })
    publicUrl: string;

    @ApiProperty({ example: 600 })
    expiresIn: number;
}
