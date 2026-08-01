import { Router } from 'express';
import { uploadMiddleware } from '../../middlewares/upload.middleware';
import * as uploadController from './upload.controller';

const router = Router();

// POST /api/v1/upload - Handles form-data (file field 'file') or JSON ({ file: 'base64...' })
router.post('/', uploadMiddleware.single('file'), uploadController.uploadMedia);

// DELETE /api/v1/upload - Deletes Cloudinary resource by public_id
router.delete('/', uploadController.deleteMedia);

export default router;
