import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import ImageKit from "imagekit";
import { toDto } from "src/libs/utils/toDto";
import { ImageKitUploadResponseDto, ImageResponseDto } from "./dto/imageKit.dto";



@Injectable()
export class ImageKitService {
    constructor(
        @Inject('wytuLib-imagekit-token') private readonly imageKit: ImageKit
    ) { }

    async uploadImage(file: Buffer, fileName: string, folder: string): Promise<ImageKitUploadResponseDto> {
        return this.uploadAsset(file, fileName, folder)
    }

    async uploadFile(file: Buffer, fileName: string, folder: string): Promise<ImageKitUploadResponseDto> {
        return this.uploadAsset(file, fileName, folder)
    }

    private async uploadAsset(file: Buffer, fileName: string, folder: string): Promise<ImageKitUploadResponseDto> {
        try {
            const response = await this.imageKit.upload({
                file,
                fileName,
                folder
            })

            const result = toDto(ImageResponseDto, response)

            return {
                status: HttpStatus.OK,
                result
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteImage(fileId: string) {
        await this.imageKit.deleteFile(fileId)
        return {
            status: HttpStatus.OK,
            message: 'Image deleted successfully'
        }
    }
}
