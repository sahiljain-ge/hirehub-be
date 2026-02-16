import type { Express } from 'express';
import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/AppError.js';
import CLOUDINARY_CONFIG from '../../../config/cloudinary.config.js';
import { FILE_UPLOAD_MESSAGES } from '../../../constants/response.messages.js';

cloudinary.config(CLOUDINARY_CONFIG);

type ResourceType = 'auto' | 'image' |'video';

export interface UploadOptions {
  folder: string;
  resourceType?: ResourceType;
  publicId?: string;
}

export type StorageUploadResult = {
  url: string;
  publicId: string;
  provider: 'cloudinary';
};

export class CloudinaryProvider {
  async upload(file: Express.Multer.File, options: UploadOptions): Promise<StorageUploadResult> {
    const { folder, resourceType = 'auto', publicId } = options;

    const params: UploadApiOptions = {
      folder,
      resource_type: resourceType,
    };

    if (publicId) {
      params.public_id = publicId;
      params.overwrite = true;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(params, (error, result) => {
        if (error || !result) {
          return reject(
            error ?? new AppError(FILE_UPLOAD_MESSAGES.UPLOAD_FAILED, StatusCodes.BAD_GATEWAY),
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          provider: 'cloudinary',
        });
      });

      uploadStream.end(file.buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

export default CloudinaryProvider;
