import Joi from 'joi';
import { TIME_SLOTS } from '../utils/timeSlots.js';

export const createBookingSchema = Joi.object({
  body: Joi.object({
    serviceId: Joi.number().integer().required(),
    fullName: Joi.string().min(2).max(160).required(),
    email: Joi.string()
      .trim()
      .email({ tlds: { allow: false } })
      .required(),
    phone: Joi.string().min(7).max(50).required(),
    bookingDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({ 'string.pattern.base': 'bookingDate must be YYYY-MM-DD' }),
    timeSlot: Joi.string().valid(...TIME_SLOTS).required(),
    paymentMethod: Joi.string().max(60).required(),
    paymentProofUrl: Joi.string().uri().required(),
    notes: Joi.string().max(2000).allow('', null),
  }).required(),
});

export const updateBookingStatusSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().required(),
  }).required(),
  body: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'cancelled').required(),
  }).required(),
});

