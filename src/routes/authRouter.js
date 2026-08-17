import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { celebrate } from "celebrate";
import { auth as ctrl } from "../controllers/index.js";
import { loginUser } from "../controllers/auth/authController.js";
import { loginUserSchema } from "../validations/userValidation.js";
import { registerUserModel } from "../validations/authValidation.js";

export const authRouter = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user and creates a new session.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", celebrate(loginUserSchema), loginUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error
 *       409:
 *         description: User with this email already exists
 */
authRouter.post("/register", celebrate(registerUserModel), ctrl.registerUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Logs out the authenticated user and removes the current session.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: User successfully logged out
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/logout", authMiddleware, ctrl.logoutUser);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh user session
 *     description: Refreshes the user's session using the refresh token and session ID stored in cookies.
 *     responses:
 *       200:
 *         description: Session successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session refreshed
 *       401:
 *         description: Session not found or refresh token expired
 */
authRouter.post("/refresh", ctrl.refreshUserSession);
authRouter.get("/current", authMiddleware, ctrl.currentUser);
