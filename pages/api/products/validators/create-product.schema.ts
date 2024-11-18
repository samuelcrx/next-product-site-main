import { EProductType } from '@/src/type/products';
import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .required(), // Regex to ensure it’s a valid price format
  description: Joi.string().min(1).required(),
  category: Joi.string().min(1).required(),
  rating: Joi.number().min(0).max(5).required(), // Assuming rating is between 0 and 5
  numReviews: Joi.number().integer().min(0).required(),
  countInStock: Joi.number().integer().min(0).required(),
  productType: Joi.string().valid(EProductType.large, EProductType.small).required(),
});
