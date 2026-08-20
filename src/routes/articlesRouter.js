import { Router } from "express";
import { celebrate } from "celebrate";

import {
  updateArticleSchema,
  getIdSchema,
  createArticleSchema,
  getArticlesSchema,
} from "../validations/articles.js";

import { articles as ctrl } from "../controllers/index.js";
import { createArticleController } from "../controllers/articles/index.js";

import { upload } from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const articlesRouter = Router();

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
 *           default: 12
 *         example: 12
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
 *               $ref: "#/components/schemas/ArticlesResponse"
 *
 *       400:
 *         description: Invalid query parameters
 */
articlesRouter.get(
  "/",
  celebrate(getArticlesSchema),
  ctrl.getArticles,
);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get an article by ID
 *     description: Returns a single article with its author information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *         example: 64f1a2b3c4d5e6f789012345
 *
 *     responses:
 *       200:
 *         description: Article successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ArticleDetails"
 *
 *       400:
 *         description: Invalid article ID
 *
 *       404:
 *         description: Article not found
 */
articlesRouter.get(
  "/:id",
  celebrate(getIdSchema),
  ctrl.getArticleById,
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
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - img
 *               - title
 *               - article
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: Article image
 *
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 48
 *                 example: The Future of Technology
 *
 *               desc:
 *                 type: string
 *                 description: Short article description
 *                 example: Technology continues to transform the way we live and work...
 *
 *               article:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 4000
 *                 example: Full article content goes here...
 *
 *               category:
 *                 type: string
 *                 enum:
 *                   - popular
 *                   - general
 *                 default: general
 *                 example: general
 *
 *     responses:
 *       201:
 *         description: Article successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateArticleResponse"
 *
 *       400:
 *         description: Validation error or article image is missing
 *
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
 *     description: Updates an existing article owned by the authenticated user.
 *     security:
 *       - cookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *         example: 64f1a2b3c4d5e6f789012345
 *
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
 *
 *               description:
 *                 type: string
 *                 minLength: 100
 *                 maxLength: 4000
 *                 example: Updated article description...
 *
 *               date:
 *                 type: string
 *                 pattern: "^\\d{4}-\\d{2}-\\d{2}$"
 *                 example: 2026-08-20
 *
 *               author:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 50
 *                 example: John Doe
 *
 *     responses:
 *       200:
 *         description: Article successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateArticleResponse"
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Article not found or does not belong to the authenticated user
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
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *         example: 64f1a2b3c4d5e6f789012345
 *
 *     responses:
 *       200:
 *         description: Article successfully deleted
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Article not found
 */
articlesRouter.delete(
  "/:id",
  authMiddleware,
  celebrate(getIdSchema),
  ctrl.deleteArticle,
);
