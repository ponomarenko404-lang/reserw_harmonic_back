import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateUserAvatar } from '../controllers/users/userAvatar.js';
import { upload } from '../middleware/upload.js';

const router = Router();

/**
 * @swagger
 * /api/users/me/avatar:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user avatar
 *     description: Uploads and updates the authenticated user's avatar.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: User avatar image
 *     responses:
 *       200:
 *         description: User avatar successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f1a2b3c4d5e6f789012345
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     avatarUrl:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/example/image/upload/avatar.jpg
 *       400:
 *         description: Avatar file is missing
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch(
  '/me/avatar',
  authMiddleware,
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;