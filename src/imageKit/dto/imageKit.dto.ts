import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class ImageResponseDto {
    @Expose()
    @ApiProperty({ example: '1234567890' })
    @IsString()
    fileId: string;

    @Expose()
    @ApiProperty({ example: 836 })
    @IsNumber()
    size: number;

    @Expose()
    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsString()
    url: string;

    @Expose()
    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsString()
    thumbnailUrl: string;
}

export class ImageKitUploadResponseDto {
    @ApiProperty({ example: 200 })
    @IsNumber()
    status: number;

    @ApiProperty({
        description: 'ImageKit upload response',
        type: ImageResponseDto
    })
    @IsString()
    result: ImageResponseDto | ImageResponseDto[];
}