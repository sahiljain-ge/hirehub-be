import type { UploadOptions, StorageProvider } from './Provider/provider.types.js';
import { STORAGE_PROVIDER } from '../config/server-config.js';
import AppError from './AppError.js';
import cloudinaryProvider from './Provider/cloudinary.provider.js';
import { StatusCodes } from 'http-status-codes';

const providers: Record<string, StorageProvider> = {
  cloudinary: cloudinaryProvider,
  // Future providers can be added here, e.g.: 's3': s3Provider, 'imagekit': imageKitProvider, etc.
};

const getProvider = (): { name: string; instance: StorageProvider } => {
  const name = (STORAGE_PROVIDER ?? '').toLowerCase().trim();

  if (!name) {
    throw new AppError(
      `STORAGE_PROVIDER is not set. Supported values: ${Object.keys(providers).join(', ')}.`,
      500,
    );
  }

  const instance = providers[name];

  if (!instance) {
    throw new AppError(
      `Unknown storage provider "${name}". Supported values: ${Object.keys(providers).join(', ')}.`,
      500,
    );
  }

  return { name, instance };
};

export interface FileOperationResponse {
  fileId: string;
  fileUrl: string;
  provider: string;
}

export const uploadFile = async (
  file: Express.Multer.File,
  options: UploadOptions = {},
): Promise<FileOperationResponse> => {
  if (!file) {
    throw new AppError('File is required for upload.', StatusCodes.BAD_REQUEST || 400);
  }

  const { name, instance } = getProvider();

  const result = await instance.uploadFile(file, options);

  return {
    fileId: result.id,
    fileUrl: result.url,
    provider: name,
  };
};

export const deleteFile = async (fileId: string): Promise<FileOperationResponse> => {
  if (!fileId) {
    throw new AppError('File ID is required for deletion.', StatusCodes.BAD_REQUEST || 400);
  }

  const { name, instance } = getProvider();

  await instance.deleteFile(fileId);

  return {
    fileId,
    fileUrl: '',
    provider: name,
  };
};
