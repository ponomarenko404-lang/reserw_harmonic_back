import { Joi, Segments } from "celebrate";

export const registerUserModel = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(2).max(32).required(),
    email: Joi.string().email().max(64).required(),
    password: Joi.string().min(8).max(64).required(),
    repeatPassword: Joi.any().valid(Joi.ref("password")).required(),
  }),
};
