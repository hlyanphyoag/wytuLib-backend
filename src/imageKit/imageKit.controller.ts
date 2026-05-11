import { Body, Controller, Delete, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ImageKitService } from "./imageKit.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse } from "@nestjs/swagger";
import { FileUploadDto } from "src/common/dto/file-upload.dto";
import { ImageTypeValidator } from "src/common/validator/image-type.validator";
import { ImageKitUploadResponseDto } from "./dto/imageKit.dto";


@ApiBearerAuth()
@Controller('image-kit')
export class ImageKitController {
    constructor(
        private readonly imageKitService: ImageKitService
    ) { }

    @Post('upload-image')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image Upload',
        type: FileUploadDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Image uploaded successfully',
        type: ImageKitUploadResponseDto
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }),
                    new ImageTypeValidator({})
                ]
            })
        ) file: Express.Multer.File) {

        return this.imageKitService.uploadImage(file.buffer, file.originalname, 'wytuLib-images')
    }

    @Post('upload-file')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File Upload',
        type: FileUploadDto
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'File uploaded successfully',
        type: ImageKitUploadResponseDto
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadDownloadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10000000 }),
                ]
            })
        ) file: Express.Multer.File) {

        return this.imageKitService.uploadFile(file.buffer, file.originalname, 'wytuLib-files')
    }

    @Delete(':fileId')
    @ApiParam({ name: 'fileId', description: 'File ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Image deleted successfully',
        example: {
            status: HttpStatus.OK,
            message: 'Image deleted successfully'
        }
    })
    async deleteImage(@Param('fileId') fileId: string) {
        return this.imageKitService.deleteImage(fileId)
    }
}
