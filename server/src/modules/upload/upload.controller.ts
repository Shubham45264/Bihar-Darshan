import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

/**
 * Handle single file or base64 upload to Cloudinary
 */
export const uploadMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let fileData: Buffer | string | null = null;
  let resourceType: 'auto' | 'image' | 'video' = 'auto';

  if (req.file) {
    fileData = req.file.buffer;
    if (req.file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    } else if (req.file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    }
  } else if (req.body.file || req.body.dataUrl) {
    fileData = req.body.file || req.body.dataUrl;
    if (typeof fileData === 'string' && fileData.startsWith('data:video/')) {
      resourceType = 'video';
    }
  }

  if (!fileData) {
    return res.status(400).json({
      success: false,
      message: 'No file or base64 dataUrl provided',
    });
  }

  const folder = req.body.folder || 'bihar_darshan';
  const result = await uploadToCloudinary(fileData, {
    folder,
    resourceType,
  });

  return res.status(201).json({
    success: true,
    message: 'Media uploaded successfully to Cloudinary',
    data: {
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
    },
  });
});

/**
 * Delete media item from Cloudinary by public_id
 */
export const deleteMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const publicId = req.body.public_id || (req.query.public_id as string);
  const resourceType = (req.body.resource_type || req.query.resource_type || 'image') as 'image' | 'video';

  if (!publicId) {
    return res.status(400).json({
      success: false,
      message: 'public_id is required for deletion',
    });
  }

  const result = await deleteFromCloudinary(publicId, resourceType);

  return res.status(200).json({
    success: true,
    message: 'Media deleted successfully from Cloudinary',
    data: { result },
  });
});
