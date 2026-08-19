import { Router } from 'express';
import { celebrate } from 'celebrate';
import { users as ctrl } from '../controllers/index.js';
import { userIdParamSchema } from '../validations/userValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

export const usersRouter = Router();

/**
 * @swagger
 * /api/users/me/saved-articles:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get saved articles
 *     description: Returns the authenticated user's saved articles with pagination.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: perPage
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Saved articles successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedArticlesResponse'
 *       401:
 *         description: Unauthorized
 */
usersRouter.get('/me/saved-articles', authMiddleware, ctrl.getSavedArticles);

/**
 * @swagger
 * /api/users/me/saved-articles/{articleId}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add an article to saved articles
 *     description: Adds an article to the authenticated user's saved articles.
 *     security:
 *       - cookieAuth: []
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
 *         description: Article successfully added to saved articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Article added to saved articles
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       409:
 *         description: Article already saved
 *   delete:
 *     tags:
 *       - Users
 *     summary: Remove an article from saved articles
 *     description: Removes an article from the authenticated user's saved articles.
 *     security:
 *       - cookieAuth: []
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
 *         description: Article successfully removed from saved articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Article removed from saved articles
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article is not saved
 */
usersRouter.post(
  '/me/saved-articles/:articleId',
  authMiddleware,
  ctrl.addSavedArticle,
);

usersRouter.delete(
  '/me/saved-articles/:articleId',
  authMiddleware,
  ctrl.removeSavedArticle,
);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user
 *     description: Returns the authenticated user's profile.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user successfully retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
usersRouter.get("/me", authMiddleware, ctrl.getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user
 *     description: Updates the authenticated user's name or contact information.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 32
 *                 example: John Doe
 *               contactInfo:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: At least one field must be provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
usersRouter.patch("/me", authMiddleware, ctrl.updateCurrentUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Returns a user and their articles with pagination.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 64f1a2b3c4d5e6f789012345
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *       - in: query
 *         name: perPage
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *     responses:
 *       200:
 *         description: User successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithArticlesResponse'
 *       404:
 *         description: User not found
 */
usersRouter.get('/:userId', celebrate(userIdParamSchema), ctrl.getUserById);

/**
 * @swagger
 * /api/users/{userId}/articles:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user's articles
 *     description: Returns articles created by a specific user with pagination.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 64f1a2b3c4d5e6f789012345
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *       - in: query
 *         name: perPage
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 10
 *     responses:
 *       200:
 *         description: User articles successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserArticlesResponse'
 *       404:
 *         description: User not found
 */
usersRouter.get(
  '/:userId/articles',
  celebrate(userIdParamSchema),
  ctrl.getUserArticles,
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get authors
 *     description: Returns a paginated list of authors sorted alphabetically by name.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *         example: 20
 *     responses:
 *       200:
 *         description: Authors successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorsResponse'
 *       400:
 *         description: Invalid page or limit parameters
 */
usersRouter.get('/', ctrl.getAuthors);


