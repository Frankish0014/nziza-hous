import Joi from 'joi';

export const createMessageSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(160).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(3000).required(),
  }).required(),
});

