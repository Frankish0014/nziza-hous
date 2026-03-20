import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from '../validations/bookingValidation.js';

const router = Router();
router.get('/', bookingController.getBookings);
router.post('/', validate(createBookingSchema), bookingController.createBooking);
router.post('/upload-proof', upload.single('proof'), bookingController.uploadPaymentProof);
router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus,
);

export default router;

