import { Router } from 'express';
import collaborationController from '../controllers/collaborationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All collaboration routes require authentication
router.post('/:id/collaborators', authenticate, collaborationController.addCollaborator);
router.delete('/:id/collaborators/:userId', authenticate, collaborationController.removeCollaborator);
router.post('/:id/transfer', authenticate, collaborationController.transferOwnership);
router.post('/:id/notes', authenticate, collaborationController.addNote);

export default router;

