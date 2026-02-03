import Joi from "joi";

export const prdt = Joi.object({
  productName: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).max(500).allow(null, ""),
  price: Joi.number().min(1).required(),
  discountedPrice: Joi.number().min(1).optional(),
  quantity: Joi.number().min(1).required(),
  isActive: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});
