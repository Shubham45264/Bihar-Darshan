import multer from 'multer';

// Use memory storage for direct buffer streaming to Cloudinary
const storage = multer.memoryStorage();

// File size limits: 10MB for images, 100MB for videos
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are supported!'));
    }
  },
});
