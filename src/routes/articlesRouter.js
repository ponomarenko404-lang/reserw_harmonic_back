
import { Router } from "express";
import { celebrate, Segments } from "celebrate";
import {
  updateArticleSchema,
  getIdSchema,
  createArticleSchema,
  getArticlesSchema,
} from "../validations/articles.js";

import { articles as ctrl } from "../controllers/index.js";
import { createArticleController } from "../controllers/articles/index.js";
import { upload } from "../middleware/upload.js";
import { uploadErrorHandler } from "../middleware/uploadErrorHandler.js";
import authMiddleware from "../middleware/authMiddleware.js";


export const articlesRouter = Router();

/**
 * @swagger
 * /api/articles/{articleId}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get an article by ID
 *     description: Returns a single article with its author information.
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 64f1a2b3c4d5e6f789012345
 *     responses:
 *       200:
 *         description: Article successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid article ID
 *       404:
 *         description: Article not found
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get articles
 *     description: Returns a paginated list of articles with optional category filtering and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *
 *       - in: query
 *         name: perPage
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - popular
 *             - general
 *         example: popular
 *
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - date
 *             - rate
 *             - title
 *           default: date
 *         example: date
 *
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *         example: desc
 *
 *     responses:
 *       200:
 *         description: Articles successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticlesResponse'
 *       400:
 *         description: Invalid query parameters
 */
articlesRouter.get(
  "/:id",
  celebrate(getIdSchema),
  ctrl.getArticleById,
);

articlesRouter.get(
  "/",
  celebrate(getArticlesSchema),
  ctrl.getArticles,
);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Create an article
 *     description: Creates a new article. Authentication is required.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photo
 *               - title
 *               - description
 *               - date
 *               - author
 *               - category
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Article image
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 48
 *                 example: The Future of Technology
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 4000
 *                 example: Technology continues to transform the way we live and work...
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-11
 *               author:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 50
 *                 example: John Doe
 *               category:
 *                 type: string
 *                 enum:
 *                   - popular
 *                   - general
 *                 example: general
 *     responses:
 *       201:
 *         description: Article successfully created
 *       400:
 *         description: Validation error or photo is missing
 *       401:
 *         description: Unauthorized
 */
articlesRouter.post(
  "/",
  authMiddleware,
  upload.single("img"),
  celebrate(createArticleSchema),
  createArticleController,
);

/**
 * @swagger
 * /api/articles/{id}:
 *   patch:
 *     tags:
 *       - Articles
 *     summary: Update an article
 *     description: Updates one or more fields of an existing article. Authentication is required.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 64f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 48
 *                 example: Updated Article Title
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 4000
 *                 example: Updated article description...
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-11
 *               author:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 50
 *                 example: John Doe
 *               category:
 *                 type: string
 *                 enum:
 *                   - popular
 *                   - general
 *                 example: popular
 *     responses:
 *       200:
 *         description: Article successfully updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
articlesRouter.patch(
  "/:id",
  authMiddleware,
  celebrate(updateArticleSchema),
  ctrl.updateArticle,
);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     tags:
 *       - Articles
 *     summary: Delete an article
 *     description: Deletes an article by ID. Authentication is required.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 64f1a2b3c4d5e6f789012345
 *     responses:
 *       200:
 *         description: Article successfully deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
articlesRouter.delete(
  "/:id",
  authMiddleware,
  celebrate(getIdSchema),
  ctrl.deleteArticle,
);