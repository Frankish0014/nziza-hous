import * as bookingService from '../services/bookingService.js';
import { successResponse } from '../utils/apiResponse.js';

export const createBooking = async (req, res, next) => {
  try {
    const data = await bookingService.createBooking(req.body);
    return successResponse(res, data, 'Booking created', 201);
  } catch (err) {
    return next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const data = req.query.email
      ? await bookingService.listBookingsByEmail(req.query.email)
      : await bookingService.listBookings();
    return successResponse(res, data);
  } catch (err) {
    return next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const data = await bookingService.updateBookingStatus(Number(req.params.id), req.body.status);
    if (!data) return res.status(404).json({ success: false, message: 'Booking not found' });
    await bookingService.sendBookingStatusEmail(data);
    return successResponse(res, data, 'Booking updated');
  } catch (err) {
    return next(err);
  }
};

export const uploadPaymentProof = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No payment proof uploaded' });
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return successResponse(res, { url: fileUrl }, 'Payment proof uploaded', 201);
  } catch (err) {
    return next(err);
  }
};

