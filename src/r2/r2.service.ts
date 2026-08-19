import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignedUrlResponseDto } from './dto/r2.dto';

@Injectable()
export class R2Service {
    private readonly logger = new Logger(R2Service.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly publicUrlBase: string;

    constructor() {
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        this.bucketName = process.env.R2_BUCKET_NAME || '';
        this.publicUrlBase = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

        if (!accountId || !accessKeyId || !secretAccessKey || !this.bucketName) {
            this.logger.warn(
                'Missing Cloudflare R2 environment variables. Expected R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.',
            );
        }

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || '',
            },
        });
    }

    /**
     * Generates a presigned PUT URL for browser direct upload to R2.
     * The file never passes through the NestJS server.
     */
    async generatePresignedUploadUrl(
        fileName: string,
        contentType: string,
        folder: string = 'wytuLib-files',
        expiresIn: number = 600,
    ): Promise<PresignedUrlResponseDto> {
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const key = folder
            ? `${folder}/${timestamp}-${randomSuffix}-${sanitizedFileName}`
            : `${timestamp}-${randomSuffix}-${sanitizedFileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
        const publicUrl = this.publicUrlBase ? `${this.publicUrlBase}/${key}` : '';

        return {
            uploadUrl,
            key,
            publicUrl,
            expiresIn,
        };
    }

    /**
     * Deletes an object from R2 by its storage key.
     */
    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(command);
    }
}
