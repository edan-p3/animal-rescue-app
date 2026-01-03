import { v2 as cloudinary } from 'cloudinary';
import prisma from '../utils/db';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode } from '../types';
import caseService from './caseService';
import logger from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class PhotoService {
  async uploadPhotos(
    caseId: string,
    userId: string,
    files: Express.Multer.File[],
    isPrimary: boolean = false
  ) {
    // Check if user has permission
    const canEdit = await caseService.canEditCase(userId, caseId);
    if (!canEdit) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'You do not have permission to upload photos to this case'
      );
    }

    // Check if case exists
    const caseExists = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseExists) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'Case not found'
      );
    }

    // Validate files
    if (!files || files.length === 0) {
      throw new AppError(
        400,
        ErrorCode.VALIDATION_ERROR,
        'No files provided'
      );
    }

    if (files.length > 10) {
      throw new AppError(
        400,
        ErrorCode.VALIDATION_ERROR,
        'Maximum 10 files allowed per upload'
      );
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        throw new AppError(
          400,
          ErrorCode.FILE_TYPE_INVALID,
          `File ${file.originalname} is not an image`
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new AppError(
          400,
          ErrorCode.FILE_TOO_LARGE,
          `File ${file.originalname} exceeds 5MB limit`
        );
      }
    }

    // Get current max order index
    const maxOrder = await prisma.photo.findFirst({
      where: { caseId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    let nextOrderIndex = (maxOrder?.orderIndex || 0) + 1;

    // Check if this is the first photo
    const existingPhotos = await prisma.photo.count({
      where: { caseId },
    });

    const isFirstPhoto = existingPhotos === 0;

    // Upload photos to Cloudinary
    const uploadedPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'animal-rescue',
              resource_type: 'image',
              transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(file.buffer);
        });

        // Generate thumbnail URL using Cloudinary transformations
        const thumbnailUrl = result.url.replace(
          '/upload/',
          '/upload/w_300,h_300,c_fill/'
        );

        // Save to database
        const photo = await prisma.photo.create({
          data: {
            caseId,
            url: result.secure_url,
            thumbnailUrl,
            uploadedBy: userId,
            orderIndex: nextOrderIndex++,
            isPrimary: (isFirstPhoto && i === 0) || (isPrimary && i === 0),
          },
        });

        uploadedPhotos.push(photo);
      } catch (error: any) {
        logger.error({ message: 'Photo upload failed', error: error.message });
        throw new AppError(
          500,
          ErrorCode.INTERNAL_ERROR,
          `Failed to upload photo: ${file.originalname}`
        );
      }
    }

    // If setting as primary, unset other primary photos
    if ((isFirstPhoto || isPrimary) && uploadedPhotos.length > 0) {
      await prisma.photo.updateMany({
        where: {
          caseId,
          id: { not: uploadedPhotos[0].id },
        },
        data: { isPrimary: false },
      });
    }

    // Create activity log
    await prisma.activityLog.create({
      data: {
        caseId,
        userId,
        actionType: 'photo_added',
        description: `Added ${uploadedPhotos.length} photo(s)`,
        isPublic: true,
      },
    });

    logger.info({
      message: 'Photos uploaded',
      caseId,
      userId,
      count: uploadedPhotos.length,
    });

    return uploadedPhotos.map((p) => ({
      id: p.id,
      case_id: p.caseId,
      url: p.url,
      thumbnail_url: p.thumbnailUrl,
      uploaded_by: p.uploadedBy,
      is_primary: p.isPrimary,
      uploaded_at: p.uploadedAt,
    }));
  }

  async deletePhoto(photoId: string, userId: string) {
    // Get photo
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        case: {
          select: {
            id: true,
            primaryOwnerId: true,
          },
        },
      },
    });

    if (!photo) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'Photo not found'
      );
    }

    // Check permission
    const canEdit = await caseService.canEditCase(userId, photo.caseId);
    if (!canEdit) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'You do not have permission to delete this photo'
      );
    }

    const wasPrimary = photo.isPrimary;

    // Delete from Cloudinary
    try {
      const publicId = this.extractPublicId(photo.url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error: any) {
      logger.error({ message: 'Failed to delete from Cloudinary', error: error.message });
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.photo.delete({
      where: { id: photoId },
    });

    // If this was the primary photo, set another photo as primary
    if (wasPrimary) {
      const nextPhoto = await prisma.photo.findFirst({
        where: { caseId: photo.caseId },
        orderBy: { orderIndex: 'asc' },
      });

      if (nextPhoto) {
        await prisma.photo.update({
          where: { id: nextPhoto.id },
          data: { isPrimary: true },
        });
      }
    }

    // Create activity log
    await prisma.activityLog.create({
      data: {
        caseId: photo.caseId,
        userId,
        actionType: 'photo_deleted',
        description: 'Deleted a photo',
        isPublic: true,
      },
    });

    logger.info({ message: 'Photo deleted', photoId, userId });
  }

  private extractPublicId(url: string): string | null {
    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/animal-rescue/photo.jpg
    // Public ID: animal-rescue/photo
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return matches ? matches[1] : null;
  }
}

export default new PhotoService();

