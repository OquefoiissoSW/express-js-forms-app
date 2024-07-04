import { NextFunction, Request, Response, Router } from "express";
import { createUser, login, getUser } from "./auth.service";
import { authenticateJWT } from "./auth";

const router = Router();

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user by Id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         example: '6685584afb6aec631d074c1b'
 *     responses:     
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *             example:
 *               user: {
 *                 "id": "6685584afb6aec631d074c1b",
 *                   "username": "user",
 *                   "formsId": [
 *                      "66855f35e666b9f28c0df369",
 *                       "6685631fe666b9f28c0df36a",
 *                   ]
 *               }
 */
router.get('/users/:userId', getUser)

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password 
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The unique username of user
 *         password:
 *           type: string
 *           description: User password
 *         formsId:
 *           type: list
 *           description: List of forms id available to the user
 *       example:
 *         username: user
 *         password: '123'
 * tags:
 *   name: Users
 *   description: 
 * /api/users:
 *   post:
 *     summary: Creating new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: New user registred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         description: Username is already taken
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: message
 *                  existingUser:
 *                    type: object
 *                    description: contains id of existing user
 *                example:
 *                  message: Username is already taken
 *                  existingUser: {
 *                    id: 6685584afb6aec631d074c1b
 *                  }
 *       500: 
 *         description: Internal server error
 *             
 */
router.post('/users', createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authorization
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 username: 
 *                   type: string
 *                   description: username of user
 *                 token:
 *                   type: string
 *                   description: JWT token
 *             example:
 *               username: user
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY4NTU4NGFmYjZhZWM2MzFkMDc0YzFiIn0sImlhdCI6MTcyMDA5MTMxMCwiZXhwIjoxNzI1Mjc1MzEwfQ.Vbp4c2jCLN7rrCyZQ8TFD4uvllQMo3i0FXikRk-Jdas
 *       400:
 *         description: Username and password is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 message:
 *                   type: string
 *             example: 
 *               message: password is required
 *       403:
 *         description: username or password is invalid    
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 message:
 *                   type: string
 *             example: 
 *               message: username or password is invalid
 *       500: 
 *         description: Internal server error
 */
router.post('/users/login', login);

/** 
 * @openapi
 * /api/protected:
 *  get:
 *     summary: Check if user is authorized
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: You are authorized
 *       401:
 *         description: Authorization is required
 *       403:
 *         description: Invalid auth token
*/
router.get('/protected', authenticateJWT, (req: Request, res: Response) => {
    res.status(200).json({ message: 'You are authorized' });
});

export default router;