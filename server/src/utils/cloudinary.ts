import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  resource_type?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

/**
 * Upload buffer or base64 data string to Cloudinary with automatic optimization.
 */
export const uploadToCloudinary = (
  fileData: Buffer | string,
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'video' | 'raw';
    publicId?: string;
  } = {}
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const { folder = 'bihar_darshan', resourceType = 'auto', publicId } = options;

    const uploadOptions: any = {
      folder,
      resource_type: resourceType,
      public_id: publicId,
    };

    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { quality: 'auto', fetch_format: 'auto' }
      ];
    }

    if (Buffer.isBuffer(fileData)) {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Failed to upload file to Cloudinary'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      });
      uploadStream.end(fileData);
    } else if (typeof fileData === 'string') {
      cloudinary.uploader.upload(fileData, uploadOptions, (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Failed to upload base64 string to Cloudinary'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      });
    } else {
      reject(new Error('Invalid file format provided for Cloudinary upload'));
    }
  });
};

/**
 * Safely delete a resource from Cloudinary by its public_id.
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<any> => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error(`Error deleting resource ${publicId} from Cloudinary:`, error);
    throw error;
  }
};

export default cloudinary;
