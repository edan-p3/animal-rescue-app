import { Request, Response, NextFunction } from 'express';
import photoService from '../services/photoService';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode } from '../types';

export class PhotoController {
  async uploadPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user!.userId;
      const files = req.files as Express.Multer.File[];
      const isPrimary = req.body.is_primary === 'true' || req.body.is_primary === true;

      if (!files || files.length === 0) {
        throw new AppError(
          400,
          ErrorCode.VALIDATION_ERROR,
          'No files provided'
        );
      }

      const result = await photoService.uploadPhotos(id, userId, files, isPrimary);

      res.status(201).json({ photos: result });
    } catch (error) {
      next(error);
    }
  }

  async deletePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { photoId } = req.params;
      const userId = (req as AuthRequest).user!.userId;

      await photoService.deletePhoto(photoId, userId);

      res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new PhotoController();

