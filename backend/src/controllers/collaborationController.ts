import { Request, Response, NextFunction } from 'express';
import collaborationService from '../services/collaborationService';
import { addCollaboratorSchema, addNoteSchema, transferOwnershipSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class CollaborationController {
  async addCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user!.userId;
      const { user_id, role_label } = addCollaboratorSchema.parse(req.body);

      const result = await collaborationService.addCollaborator(
        id,
        userId,
        user_id,
        role_label
      );

      res.status(201).json({ collaborator: result });
    } catch (error) {
      next(error);
    }
  }

  async removeCollaborator(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, userId: collaboratorUserId } = req.params;
      const userId = (req as AuthRequest).user!.userId;

      await collaborationService.removeCollaborator(id, userId, collaboratorUserId);

      res.status(200).json({ message: 'Collaborator removed successfully' });
    } catch (error) {
      next(error);
    }
  }

  async transferOwnership(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user!.userId;
      const { new_owner_id } = transferOwnershipSchema.parse(req.body);

      const result = await collaborationService.transferOwnership(id, userId, new_owner_id);

      res.status(200).json({ case: result });
    } catch (error) {
      next(error);
    }
  }

  async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user!.userId;
      const { description, is_public } = addNoteSchema.parse(req.body);

      const result = await collaborationService.addNote(id, userId, description, is_public);

      res.status(201).json({ activity: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new CollaborationController();

