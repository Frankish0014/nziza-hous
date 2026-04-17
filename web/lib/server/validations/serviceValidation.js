import Joi from 'joi';

const serviceType = Joi.string()
  .valid('gym', 'apartments', 'coffee_shop', 'sauna', 'massage', 'lodge')
  .required();

export const createServiceSchema = Joi.object({
  body: Joi.object({
    type: serviceType,
    name: Joi.string().max(160).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).allow(null),
    currency: Joi.string().max(8).default('USD'),
    isActive: Joi.boolean().default(true),
  }).required(),
});

export const updateServiceSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().required(),
  }).required(),
  body: Joi.object({
    type: Joi.string().valid('gym', 'apartments', 'coffee_shop', 'sauna', 'massage', 'lodge'),
    name: Joi.string().max(160),
    description: Joi.string().min(10),
    price: Joi.number().min(0).allow(null),
    currency: Joi.string().max(8),
    isActive: Joi.boolean(),
  })
    .min(1)
    .required(),
});

