import { Router } from "express";
import { check } from 'express-validator';
import UserController from "../controllers/UserController.js";
import { checkRoles } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API endpoints for managing users
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post(
    '/register',
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isStrongPassword()
        .withMessage(`minLength: 8, minLowercase: 1,
        minUppercase: 1, minSymbols: 1`),
        check('role').isIn(['USER', 'ADMIN']).withMessage('Invalid role')
    ],
    UserController.registerUser
);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: Endpoint para autenticar um usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail de usuário.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User login successfully. 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid password.
 *       '422':
 *         description: Credenciais inválidas. O usuário não está autorizado.
 *       '404':
 *         description: Usuário não encontrado.
 *       '500':
 *         description: Internal Server Error.
 */
router.post(
    '/login',
    [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isLength({ min: 6 })
            .withMessage('Password should be at least 6 chars long')
    ],
    UserController.loginUser
);
/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Endpoint protegido que requer autenticação.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       '200':
 *         description: OK
//  *     components:  
//  *       securitySchemes:
//  *         bearerAuth:
//  *           type: http
//  *           scheme: bearer
//  *           bearerFormat: JWT
//  *     responses:
//  *       200:
//  *         description: A list of users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *               $ref: '#/components/schemas/User'
//  *     security:
//  *       - bearerAuth: []
 */
router.get('/users',[  
    checkRoles(['ADMIN'])
    // .isIn(['ADMIN']).withMessage('Invalid role')
  ], UserController.getAllUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 */
router.put(
    '/users/:id',
    // [    check('role').isIn(['ADMIN']).withMessage('Invalid role')], 
    UserController.updateUser);
/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrive
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: The user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error
 */
router.delete('/users/:id',[
    check('role').isIn(['ADMIN']).withMessage('Invalid role')
], UserController.deleteUser);
// POST /auth/register - User registration.
// POST /auth/login - User login to obtain a JWT.
// GET /auth/users - (Admin only) Fetch a list of users.
// PUT /auth/users/:id - (Admin only) Update user details.
// DELETE /auth/user/:id - (Admin only) Delete a user
export default router;