export interface ProviderResult {
  id: string;
  url: string;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: string;
  publicId?: string;
}

export interface StorageProvider {
  uploadFile(file: Express.Multer.File, options?: UploadOptions): Promise<ProviderResult>;
  deleteFile(fileId: string): Promise<void>;
}
