import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createMessageSchema } from '../validations/messageValidation.js';

const router = Router();

router.post('/', validate(createMessageSchema), messageController.createMessage);
router.get('/', authMiddleware, requireRole(['admin']), messageController.listMessages);

export default router;

