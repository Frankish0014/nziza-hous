import Joi from 'joi';

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(120).required(),
    role: Joi.string().valid('customer').default('customer'),
  }).required(),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
});

