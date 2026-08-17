import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message("Невірний формат ідентифікатора")
    : value;
};

export const userIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};