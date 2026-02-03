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
                return new ImageKit({
                    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
                    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
                    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
                })
            }
        },
        ImageKitService
    ],
    exports: [IMAGEKIT_TOKEN],
    controllers: [ImageKitController]
})

export class ImageKitModule { }