import { Body, Controller, Delete, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { R2Service } from './r2.service';
import { PresignedUrlRequestDto, PresignedUrlResponseDto } from './dto/r2.dto';

@ApiBearerAuth()
@Controller('r2')
export class R2Controller {
    constructor(private readonly r2Service: R2Service) {}

    @Post('presigned-url')
    @ApiOperation({ summary: 'Generate a presigned PUT URL for direct R2 file upload' })
    @ApiBody({
        description: 'File metadata for presigned URL generation',
        type: PresignedUrlRequestDto,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Presigned URL generated successfully',
        type: PresignedUrlResponseDto,
    })
    async getPresignedUploadUrl(
        @Body() dto: PresignedUrlRequestDto,
    ): Promise<PresignedUrlResponseDto> {
        return this.r2Service.generatePresignedUploadUrl(
            dto.fileName,
            dto.contentType,
            dto.folder,
        );
    }

    @Delete(':key')
    @ApiParam({ name: 'key', description: 'Storage key of the file to delete' })
    @ApiOperation({ summary: 'Delete a file from R2' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'File deleted successfully',
        example: {
            status: HttpStatus.OK,
            message: 'File deleted successfully',
        },
    })
    async deleteFile(@Param('key') key: string) {
        await this.r2Service.deleteFile(key);
        return {
            status: HttpStatus.OK,
            message: 'File deleted successfully',
        };
    }
}
