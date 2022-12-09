import express from "express";
import { accessToken, refreshToken } from "./controllers.js";
import isAuth from "./middleware.js";

const router = express.Router();
/**
 * @swagger
 * /v1/auth/access-token:
 *   post:
 *     tags:
 *     - Auth
 *     summary: Get access token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's name.
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: admin#P4ssw0rd
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  access_token:
 *                      type: string
 *                  expires_time:
 *                      type: string
 *                      format: date
 *                  refresh_token:
 *                      type: string
 *                  user:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          phone_number:
 *                              type: string
 *       401:
 *         description: Unauthorized
 */
router.post("/access-token", accessToken);
/**
 * @swagger
 * /v1/auth/refresh-token:
 *   post:
 *     tags:
 *     - Auth
 *     summary: Use refresh token to generate new access token.
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: The old refresh token.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  access_token:
 *                      type: string
 *                  expires_time:
 *                      type: string
 *                      format: date
 *                  refresh_token:
 *                      type: string
 *                  user:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          phone_number:
 *                              type: string
 *       401:
 *         description: Unauthorized
 */
router.post("/refresh-token", isAuth, refreshToken);

export default router;
