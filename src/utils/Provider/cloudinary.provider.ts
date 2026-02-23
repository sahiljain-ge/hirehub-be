import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary';
import type { StorageProvider, ProviderResult, UploadOptions } from './provider.types.js';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../../config/server-config.js';
import AppError from '../AppError.js';
import { StatusCodes } from 'http-status-codes';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadFile = async (
  file: Express.Multer.File,
  options: UploadOptions = {},
): Promise<ProviderResult> => {
  if (!file || !file.buffer) {
    throw new AppError(
      'A valid file with a buffer is required for upload.',
      StatusCodes.BAD_REQUEST || 400,
    );
  }

  const { folder, resourceType = 'auto', publicId } = options;

  const params: UploadApiOptions = {
    folder,
    resource_type: resourceType as UploadApiOptions['resource_type'],
  };

  if (publicId) {
    params.public_id = publicId as string;
    params.overwrite = true;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(params, (error, result) => {
      try {
        if (error || !result) {
          return reject(
            error ?? new AppError('Cloudinary upload failed — no result returned.', 500),
          );
        }

        resolve({
          id: result.public_id,
          url: result.secure_url,
        });
      } catch (err) {
        reject(
          err instanceof AppError
            ? err
            : new AppError(
                'Unexpected error during Cloudinary upload callback.',
                500,
                true,
                err instanceof Error ? err : undefined,
              ),
        );
      }
    });

    stream.on('error', (err) => {
      reject(
        err instanceof AppError
          ? err
          : new AppError(
              'Cloudinary upload stream error.',
              500,
              true,
              err instanceof Error ? err : undefined,
            ),
      );
    });

    try {
      stream.end(file.buffer);
    } catch (err) {
      reject(
        err instanceof AppError
          ? err
          : new AppError(
              'Failed to write file buffer to upload stream.',
              500,
              true,
              err instanceof Error ? err : undefined,
            ),
      );
    }
  });
};

const deleteFile = async (fileId: string): Promise<void> => {
  if (!fileId) {
    throw new AppError('File ID is required for deletion.', StatusCodes.BAD_REQUEST || 400);
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileId, (error, result) => {
      try {
        if (error) {
          return reject(
            error instanceof AppError
              ? error
              : new AppError(
                  'Cloudinary deletion failed.',
                  500,
                  true,
                  error instanceof Error ? error : undefined,
                ),
          );
        }
        if (!result || (result.result !== 'ok' && result.result !== 'not found')) {
          return reject(
            new AppError(`Cloudinary deletion failed: ${result?.result ?? 'unknown'}`, 500),
          );
        }
        resolve();
      } catch (err) {
        reject(
          err instanceof AppError
            ? err
            : new AppError(
                'Unexpected error during Cloudinary deletion callback.',
                500,
                true,
                err instanceof Error ? err : undefined,
              ),
        );
      }
    });
  });
};

const cloudinaryProvider: StorageProvider = {
  uploadFile,
  deleteFile,
};

export default cloudinaryProvider;
