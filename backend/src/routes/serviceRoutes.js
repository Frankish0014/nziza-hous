import { Router } from 'express';
import * as serviceController from '../controllers/serviceController.js';
import * as serviceAvailabilityController from '../controllers/serviceAvailabilityController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createServiceSchema, updateServiceSchema } from '../validations/serviceValidation.js';

const router = Router();

router.get('/', serviceController.listServices);
router.get('/:id/availability', serviceAvailabilityController.getAvailability);
router.get('/:id', serviceController.getServiceById);
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  validate(createServiceSchema),
  serviceController.createService,
);
router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  validate(updateServiceSchema),
  serviceController.updateService,
);
router.delete('/:id', authMiddleware, requireRole(['admin']), serviceController.deleteService);

export default router;

