import prisma from '../utils/db';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode } from '../types';
import logger from '../utils/logger';
import { getWebSocketService } from './websocketService';

export class CaseService {
  async canEditCase(userId: string, caseId: string): Promise<boolean> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        collaborators: {
          where: { userId },
        },
      },
    });

    if (!caseData) return false;

    return (
      caseData.primaryOwnerId === userId ||
      caseData.collaborators.length > 0
    );
  }

  async canDeleteCase(userId: string, caseId: string): Promise<boolean> {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: { primaryOwnerId: true },
    });

    if (!caseData) return false;
    return caseData.primaryOwnerId === userId;
  }

  async getAllCases(params: {
    status?: string;
    species?: string;
    urgency?: string;
    search?: string;
    page: number;
    limit: number;
    sort_by: string;
    sort_order: string;
  }) {
    const { status, species, urgency, search, page, limit, sort_by, sort_order } = params;

    // Build where clause
    const where: any = {
      isPublic: true,
    };

    if (status) where.status = status;
    if (species) where.species = species;
    if (urgency) where.urgency = urgency;
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { locationFoundGeneral: { contains: search, mode: 'insensitive' } },
        { locationCurrent: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Count total
    const total = await prisma.case.count({ where });

    // Fetch cases
    // Map API sort fields to Prisma field names
    const sortFieldMap: Record<string, string> = {
      'created_at': 'createdAt',
      'updated_at': 'updatedAt',
      'urgency': 'urgency',
    };
    const prismaSort = sortFieldMap[sort_by] || 'updatedAt';
    
    const cases = await prisma.case.findMany({
      where,
      include: {
        primaryOwner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        collaborators: {
          select: { id: true },
        },
      },
      orderBy: { [prismaSort]: sort_order },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format response
    const formattedCases = cases.map((c) => ({
      id: c.id,
      species: c.species,
      description: c.description,
      status: c.status,
      urgency: c.urgency,
      location_found: c.locationFoundGeneral || c.locationFound,
      location_current: c.locationCurrent,
      date_rescued: c.dateRescued,
      primary_owner: {
        id: c.primaryOwner.id,
        name: c.primaryOwner.name,
        role: c.primaryOwner.role,
      },
      primary_photo: c.photos[0] ? {
        url: c.photos[0].url,
        thumbnail_url: c.photos[0].thumbnailUrl,
      } : null,
      collaborator_count: c.collaborators.length,
      created_at: c.createdAt,
      updated_at: c.updatedAt,
    }));

    return {
      cases: formattedCases,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getCaseById(caseId: string, isAuthenticated: boolean = false) {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        primaryOwner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
        photos: {
          orderBy: { orderIndex: 'asc' },
        },
        activityLogs: {
          where: isAuthenticated ? {} : { isPublic: true },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
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

    if (!caseData.isPublic && !isAuthenticated) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'Case not found'
      );
    }

    // Format response
    return {
      id: caseData.id,
      species: caseData.species,
      description: caseData.description,
      status: caseData.status,
      urgency: caseData.urgency,
      location_found: isAuthenticated ? caseData.locationFound : (caseData.locationFoundGeneral || caseData.locationFound),
      location_current: caseData.locationCurrent,
      date_rescued: caseData.dateRescued,
      condition_description: caseData.conditionDescription,
      injuries: isAuthenticated ? caseData.injuries : null,
      treatments: isAuthenticated ? caseData.treatments : null,
      medications: isAuthenticated ? caseData.medications : null,
      special_needs: caseData.specialNeeds,
      dietary_requirements: caseData.dietaryRequirements,
      behavior_notes: caseData.behaviorNotes,
      public_notes: caseData.publicNotes,
      primary_owner: {
        id: caseData.primaryOwner.id,
        name: caseData.primaryOwner.name,
        role: caseData.primaryOwner.role,
      },
      collaborators: caseData.collaborators.map((c) => ({
        id: c.user.id,
        name: c.user.name,
        role: c.user.role,
        role_label: c.roleLabel,
      })),
      photos: caseData.photos.map((p) => ({
        id: p.id,
        url: p.url,
        thumbnail_url: p.thumbnailUrl,
        is_primary: p.isPrimary,
      })),
      activity_log: caseData.activityLogs.map((a) => ({
        id: a.id,
        user: a.user?.name || 'System',
        action_type: a.actionType,
        description: a.description,
        created_at: a.createdAt,
      })),
      created_at: caseData.createdAt,
      updated_at: caseData.updatedAt,
    };
  }

  async createCase(userId: string, data: any) {
    // Sanitize location for public view
    const locationFoundGeneral = this.sanitizeLocation(data.locationFound);

    const caseData = await prisma.case.create({
      data: {
        species: data.species,
        description: data.description,
        status: data.status,
        urgency: data.urgency,
        locationFound: data.locationFound,
        locationFoundGeneral,
        locationCurrent: data.locationCurrent,
        dateRescued: data.dateRescued ? new Date(data.dateRescued) : null,
        conditionDescription: data.conditionDescription,
        injuries: data.injuries,
        treatments: data.treatments,
        medications: data.medications,
        specialNeeds: data.specialNeeds,
        dietaryRequirements: data.dietaryRequirements,
        behaviorNotes: data.behaviorNotes,
        publicNotes: data.publicNotes,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        primaryOwnerId: userId,
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        caseId: caseData.id,
        userId,
        actionType: 'case_created',
        description: 'Case created',
        isPublic: true,
      },
    });

    logger.info({ message: 'Case created', caseId: caseData.id, userId });

    // Broadcast WebSocket event
    try {
      const wsService = getWebSocketService();
      wsService.broadcastCaseCreated(caseData);
    } catch (err) {
      logger.warn({ message: 'Failed to broadcast case_created', error: err });
    }

    return caseData;
  }

  async updateCase(caseId: string, userId: string, data: any) {
    // Check permissions
    const canEdit = await this.canEditCase(userId, caseId);
    if (!canEdit) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'You do not have permission to edit this case'
      );
    }

    // Get old case data for comparison
    const oldCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!oldCase) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'Case not found'
      );
    }

    // Update case
    const updateData: any = {};
    if (data.species !== undefined) updateData.species = data.species;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.urgency !== undefined) updateData.urgency = data.urgency;
    if (data.locationFound !== undefined) {
      updateData.locationFound = data.locationFound;
      updateData.locationFoundGeneral = this.sanitizeLocation(data.locationFound);
    }
    if (data.locationCurrent !== undefined) updateData.locationCurrent = data.locationCurrent;
    if (data.dateRescued !== undefined) updateData.dateRescued = new Date(data.dateRescued);
    if (data.conditionDescription !== undefined) updateData.conditionDescription = data.conditionDescription;
    if (data.injuries !== undefined) updateData.injuries = data.injuries;
    if (data.treatments !== undefined) updateData.treatments = data.treatments;
    if (data.medications !== undefined) updateData.medications = data.medications;
    if (data.specialNeeds !== undefined) updateData.specialNeeds = data.specialNeeds;
    if (data.dietaryRequirements !== undefined) updateData.dietaryRequirements = data.dietaryRequirements;
    if (data.behaviorNotes !== undefined) updateData.behaviorNotes = data.behaviorNotes;
    if (data.publicNotes !== undefined) updateData.publicNotes = data.publicNotes;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: updateData,
    });

    // Log status change if status changed
    if (data.status && data.status !== oldCase.status) {
      await prisma.activityLog.create({
        data: {
          caseId,
          userId,
          actionType: 'status_change',
          description: `Changed status from ${oldCase.status} to ${data.status}`,
          isPublic: true,
        },
      });
    }

    logger.info({ message: 'Case updated', caseId, userId });

    // Broadcast WebSocket event
    try {
      const wsService = getWebSocketService();
      const fullCase = await prisma.case.findUnique({
        where: { id: caseId },
        include: { collaborators: true },
      });
      wsService.broadcastCaseUpdated(caseId, updateData, fullCase);
    } catch (err) {
      logger.warn({ message: 'Failed to broadcast case_updated', error: err });
    }

    return updatedCase;
  }

  async deleteCase(caseId: string, userId: string) {
    // Check permissions
    const canDelete = await this.canDeleteCase(userId, caseId);
    if (!canDelete) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'Only the case owner can delete this case'
      );
    }

    await prisma.case.delete({
      where: { id: caseId },
    });

    logger.info({ message: 'Case deleted', caseId, userId });

    // Broadcast WebSocket event
    try {
      const wsService = getWebSocketService();
      wsService.broadcastCaseDeleted(caseId);
    } catch (err) {
      logger.warn({ message: 'Failed to broadcast case_deleted', error: err });
    }
  }

  async getUserCases(userId: string, params: {
    filter: string;
    status?: string;
    page: number;
    limit: number;
  }) {
    const { filter, status, page, limit } = params;

    let where: any = {};

    if (filter === 'my_cases') {
      where.primaryOwnerId = userId;
    } else if (filter === 'collaborating') {
      where.collaborators = {
        some: { userId },
      };
    } else {
      // 'all' - cases owned or collaborating on
      where.OR = [
        { primaryOwnerId: userId },
        { collaborators: { some: { userId } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const total = await prisma.case.count({ where });

    const cases = await prisma.case.findMany({
      where,
      include: {
        primaryOwner: {
          select: { name: true },
        },
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      cases: cases.map((c) => ({
        id: c.id,
        species: c.species,
        status: c.status,
        urgency: c.urgency,
        primary_owner: c.primaryOwnerId === userId ? null : { name: c.primaryOwner.name },
        primary_photo: c.photos[0] || null,
        updated_at: c.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get active cases (not adopted)
    const activeCases = await prisma.case.count({
      where: {
        status: { not: 'adopted' },
        isPublic: true,
      },
    });

    // Get rescued this month
    const rescuedThisMonth = await prisma.case.count({
      where: {
        dateRescued: { gte: startOfMonth },
        isPublic: true,
      },
    });

    // Get in foster care
    const inFosterCare = await prisma.case.count({
      where: {
        status: 'at_foster',
        isPublic: true,
      },
    });

    // Get adopted this month
    const adoptedThisMonth = await prisma.case.count({
      where: {
        status: 'adopted',
        updatedAt: { gte: startOfMonth },
        isPublic: true,
      },
    });

    // Get counts by urgency
    const byUrgency = await prisma.case.groupBy({
      by: ['urgency'],
      where: {
        isPublic: true,
        status: { not: 'adopted' },
      },
      _count: true,
    });

    // Get counts by status
    const byStatus = await prisma.case.groupBy({
      by: ['status'],
      where: { isPublic: true },
      _count: true,
    });

    // Get counts by species
    const bySpecies = await prisma.case.groupBy({
      by: ['species'],
      where: { isPublic: true },
      _count: true,
    });

    return {
      active_cases: activeCases,
      rescued_this_month: rescuedThisMonth,
      in_foster_care: inFosterCare,
      adopted_this_month: adoptedThisMonth,
      by_urgency: Object.fromEntries(byUrgency.map((u) => [u.urgency, u._count])),
      by_status: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
      by_species: Object.fromEntries(bySpecies.map((s) => [s.species, s._count])),
    };
  }

  private sanitizeLocation(location: string): string {
    // Simple sanitization - extract general area
    // E.g., "123 Main St, Downtown" -> "Downtown Area"
    const parts = location.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim() + ' Area';
    }
    return 'General Area';
  }
}

export default new CaseService();

