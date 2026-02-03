import { FileValidator } from '@nestjs/common';

export class ImageTypeValidator extends FileValidator {
    isValid(file: Express.Multer.File): boolean {
        if (!file) return false;
        return file.mimetype.startsWith('image/');
    }

    buildErrorMessage(): string {
        return 'File must be an image';
    }
}