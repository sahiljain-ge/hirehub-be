import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () =>
    ({
      folder: "pdfs",
      resource_type: "raw",
      allowed_formats: ["pdf"],
    } as unknown as Record<string, unknown>),
});

export const upload = multer({ storage: storage });

