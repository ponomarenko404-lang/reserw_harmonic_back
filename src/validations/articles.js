import { Joi, Segments } from "celebrate";
import { CATEGORIES } from "../constants/index.js";

export const createArticleSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(3).max(48).required(),

    desc: Joi.string().trim().allow("").optional(),

    article: Joi.string().trim().min(100).max(4000).required(),

    category: Joi.string()
      .valid("popular", "general")
      .optional(),
  }),
};

export const getArticlesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),

    perPage: Joi.number().integer().min(1).default(12),

    category: Joi.string()
      .valid(...CATEGORIES)
      .optional(),

    sortBy: Joi.string()
  .valid("date", "rate", "title")
  .default("date"),

    sortOrder: Joi.string()
      .valid("asc", "desc")
      .default("desc"),
  }),
};

export const getIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const updateArticleSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(3).max(48),

    description: Joi.string().trim().min(100).max(4000),

    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),

    author: Joi.string().trim().min(4).max(50),

  }).min(1),

  ...getIdSchema,
};