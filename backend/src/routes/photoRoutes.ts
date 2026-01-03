import { Router } from 'express';
import multer from 'multer';
import photoController from '../controllers/photoController';
import { authenticate } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Photo routes require authentication
router.post('/:id/photos', authenticate, uploadLimiter, upload.array('photos', 10), photoController.uploadPhotos);
router.delete('/:id/photos/:photoId', authenticate, photoController.deletePhoto);

export default router;

