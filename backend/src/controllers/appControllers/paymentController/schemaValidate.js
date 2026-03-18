const Joi = require('joi');

const schema = Joi.object({
  invoice: Joi.string().required(),
  client: Joi.string().required(),
  amount: Joi.number().greater(0).required(),
  date: Joi.date().required(),
  currency: Joi.string().required(),
  paymentMode: Joi.string().required(),
  ref: Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
  tenantId: Joi.string().optional(),
});

module.exports = schema;
