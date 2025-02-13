import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class UploadService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('cloudinary.cloudName'),
            api_key: this.configService.get('cloudinary.apiKey'),
            api_secret: this.configService.get('cloudinary.apiSecret'),
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder: 'movie-posters',
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error || !result) return reject(error || new Error('No result from Cloudinary'));
                    resolve(result.secure_url);
                },
            );

            upload.end(file.buffer);
        });
    }
} 