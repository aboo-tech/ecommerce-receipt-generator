import Joi from "joi";

export const cartItemValidate = Joi.object({
  productId: Joi.string().required(),
  productName: Joi.string().trim().min(2).max(100).required(),
  unitPrice: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const cartValid = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.string().min(1).required(),
});

// productid;
// qty;
