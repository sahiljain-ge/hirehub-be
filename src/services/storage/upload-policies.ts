export type ResourceType = 'auto' | 'image' | 'raw' | 'video';

export interface CategoryPolicy {
  folder: string;
  resourceType: ResourceType;
  allowedFormats: string[];
  allowedMimeTypes: string[];
  maxBytes: number;
}

export const DEFAULT_POLICIES = {
  resume: {
    folder: 'resumes',
    resourceType: 'raw',
    allowedFormats: ['pdf'],
    allowedMimeTypes: ['application/pdf'],
    maxBytes: 5 * 1024 * 1024,
  },
  logo: {
    folder: 'logos',
    resourceType: 'image',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 2 * 1024 * 1024,
  },
  coverLetter: {
    folder: 'cover_letters',
    resourceType: 'raw',
    allowedFormats: ['pdf'],
    allowedMimeTypes: ['application/pdf'],
    maxBytes: 5 * 1024 * 1024,
  },
} as const satisfies Record<string, CategoryPolicy>;

export type UploadCategory = keyof typeof DEFAULT_POLICIES;
