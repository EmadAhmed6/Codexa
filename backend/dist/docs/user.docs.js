// GET    /users
// GET    /users/{id}
// PUT    /users/{id}
// DELETE /users/{id}
// POST   /users/{id}/upload
export {};
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */
// GET    /users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 */
// GET    /users/{id}
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
// PUT    /users/{id}
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 10
 *                 example: Ahmed
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
// Delete    /users/{id}
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User was not found
 */
/**
 * @swagger
 * /users/{id}/upload:
 *   post:
 *     summary: Upload user profile picture
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePicture
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: No file provided
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User was not found
 */
// POST   /users/{id}/upload
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *         username:
 *           type: string
 *           example: Ahmed
 *         email:
 *           type: string
 *           format: email
 *           example: ahmed@example.com
 *         isAdmin:
 *           type: boolean
 *           example: false
 *         isVerified:
 *           type: boolean
 *           example: false
 *         postsCount:
 *           type: number
 *           example: 3
 *         profilePicture:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: https://res.cloudinary.com/example/image/upload/profile.jpg
 *             publicId:
 *               type: string
 *               nullable: true
 *               example: profile_picture_123
 */
//# sourceMappingURL=user.docs.js.map