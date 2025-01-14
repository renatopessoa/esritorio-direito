import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'lawyer', 'staff', 'client').required()
});

export const caseSchema = Joi.object({
  number: Joi.string().required(),
  court: Joi.string().required(),
  type: Joi.string().required(),
  status: Joi.string().valid('pending', 'active', 'closed', 'archived'),
  description: Joi.string(),
  dueDate: Joi.date()
});