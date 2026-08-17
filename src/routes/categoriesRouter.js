import { Router } from "express";
import { articles as ctrl } from "../controllers/index.js";

export const categoriesRouter = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get article categories
 *     description: Returns all available article categories.
 *     responses:
 *       200:
 *         description: Categories successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum:
 *                       - popular
 *                       - general
 *                   example:
 *                     - popular
 *                     - general
 */
categoriesRouter.get("/", ctrl.getArticleCategories);
