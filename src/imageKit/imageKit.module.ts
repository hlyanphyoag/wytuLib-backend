import { Global, Module } from "@nestjs/common";
import ImageKit from "imagekit";
import { ImageKitController } from "./imageKit.controller";
import { ImageKitService } from "./imageKit.service";

export const IMAGEKIT_TOKEN = 'wytuLib-imagekit-token';

@Global()
@Module({
    providers: [
        {
            provide: IMAGEKIT_TOKEN,
            useFactory: () => {
                const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
                const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
                const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

                if (!publicKey || !privateKey || !urlEndpoint) {
                    throw new Error(
                        "Missing ImageKit environment variables. Expected IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.",
                    );
                }

                return new ImageKit({
                    publicKey,
                    privateKey,
                    urlEndpoint,
                })
            }
        },
        ImageKitService
    ],
    exports: [IMAGEKIT_TOKEN],
    controllers: [ImageKitController]
})

export class ImageKitModule { }
