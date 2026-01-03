import prisma from '../utils/db';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode } from '../types';
import caseService from './caseService';
import logger from '../utils/logger';

export class CollaborationService {
  async addCollaborator(
    caseId: string,
    userId: string,
    collaboratorUserId: string,
    roleLabel?: string
  ) {
    // Check if user has permission
    const canEdit = await caseService.canEditCase(userId, caseId);
    if (!canEdit) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'You do not have permission to add collaborators'
      );
    }

    // Check if collaborator user exists
    const collaboratorUser = await prisma.user.findUnique({
      where: { id: collaboratorUserId },
      select: { id: true, name: true, role: true },
    });

    if (!collaboratorUser) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'User not found'
      );
    }

    // Check if already a collaborator
    const existing = await prisma.caseCollaborator.findUnique({
      where: {
        caseId_userId: {
          caseId,
          userId: collaboratorUserId,
        },
      },
    });

    if (existing) {
      throw new AppError(
        409,
        ErrorCode.RESOURCE_CONFLICT,
        'User is already a collaborator'
      );
    }

    // Add collaborator
    const collaborator = await prisma.caseCollaborator.create({
      data: {
        caseId,
        userId: collaboratorUserId,
        addedBy: userId,
        roleLabel,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        caseId,
        userId,
        actionType: 'collaborator_added',
        description: `Added ${collaboratorUser.name} as collaborator`,
        isPublic: true,
      },
    });

    logger.info({
      message: 'Collaborator added',
      caseId,
      userId,
      collaboratorUserId,
    });

    return {
      id: collaborator.id,
      case_id: collaborator.caseId,
      user: {
        id: collaborator.user.id,
        name: collaborator.user.name,
        role: collaborator.user.role,
      },
      role_label: collaborator.roleLabel,
      added_by: collaborator.addedBy,
      added_at: collaborator.addedAt,
    };
  }

  async removeCollaborator(
    caseId: string,
    userId: string,
    collaboratorUserId: string
  ) {
    // Check if user is the primary owner
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { primaryOwnerId: true },
    });

    if (!caseData) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'Case not found'
      );
    }

    if (caseData.primaryOwnerId !== userId) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'Only the case owner can remove collaborators'
      );
    }

    // Get collaborator name before deleting
    const collaborator = await prisma.caseCollaborator.findUnique({
      where: {
        caseId_userId: {
          caseId,
          userId: collaboratorUserId,
        },
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    if (!collaborator) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'Collaborator not found'
      );
    }

    // Remove collaborator
    await prisma.caseCollaborator.delete({
      where: {
        caseId_userId: {
          caseId,
          userId: collaboratorUserId,
        },
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        caseId,
        userId,
        actionType: 'collaborator_removed',
        description: `Removed ${collaborator.user.name} as collaborator`,
        isPublic: true,
      },
    });

    logger.info({
      message: 'Collaborator removed',
      caseId,
      userId,
      collaboratorUserId,
    });
  }

  async transferOwnership(
    caseId: string,
    currentOwnerId: string,
    newOwnerId: string
  ) {
    // Check if user is the current owner
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        primaryOwner: {
          select: { name: true },
        },
      },
    });

    if (!caseData) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'Case not found'
      );
    }

    if (caseData.primaryOwnerId !== currentOwnerId) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'Only the case owner can transfer ownership'
      );
    }

    // Check if new owner exists
    const newOwner = await prisma.user.findUnique({
      where: { id: newOwnerId },
      select: { id: true, name: true },
    });

    if (!newOwner) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'New owner not found'
      );
    }

    // Transfer ownership
    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: { primaryOwnerId: newOwnerId },
    });

    // Optionally add old owner as collaborator
    try {
      await prisma.caseCollaborator.create({
        data: {
          caseId,
          userId: currentOwnerId,
          addedBy: newOwnerId,
          roleLabel: 'Previous Owner',
        },
      });
    } catch (err) {
      // Ignore if already a collaborator
    }

    // Create activity log
    await prisma.activityLog.create({
      data: {
        caseId,
        userId: currentOwnerId,
        actionType: 'ownership_transferred',
        description: `Ownership transferred from ${caseData.primaryOwner.name} to ${newOwner.name}`,
        isPublic: true,
      },
    });

    logger.info({
      message: 'Ownership transferred',
      caseId,
      fromUserId: currentOwnerId,
      toUserId: newOwnerId,
    });

    return {
      id: updatedCase.id,
      primary_owner_id: updatedCase.primaryOwnerId,
      updated_at: updatedCase.updatedAt,
    };
  }

  async addNote(
    caseId: string,
    userId: string,
    description: string,
    isPublic: boolean = true
  ) {
    // Check if user has permission
    const canEdit = await caseService.canEditCase(userId, caseId);
    if (!canEdit) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'You do not have permission to add notes to this case'
      );
    }

    // Create activity log entry
    const activity = await prisma.activityLog.create({
      data: {
        caseId,
        userId,
        actionType: 'note_added',
        description,
        isPublic,
      },
    });

    // Update case's updatedAt timestamp
    await prisma.case.update({
      where: { id: caseId },
      data: { updatedAt: new Date() },
    });

    logger.info({ message: 'Note added', caseId, userId });

    return {
      id: activity.id,
      case_id: activity.caseId,
      user_id: activity.userId,
      action_type: activity.actionType,
      description: activity.description,
      is_public: activity.isPublic,
      created_at: activity.createdAt,
    };
  }
}

export default new CollaborationService();

