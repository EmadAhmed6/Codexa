// GET    /users
// GET    /users/{id}
// PUT    /users/{id}
// DELETE /users/{id}
// POST   /users/{id}/upload

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
 *     summary: Get all users (Rate Limited - 100 req/15min)
 *     description: Retrieve list of all users on the platform. Protected by API rate limiter.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *       429:
 *         description: Too many requests, please try again later
 */

// GET    /users/{id}
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile by ID (with populated posts, likes, and shares)
 *     description: Retrieve user profile by MongoDB ObjectId with deep populated posts, likes, and shares.
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
 *     summary: Update user profile
 *     description: Update username, job title, email, or password of a user account.
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
 *                 maxLength: 20
 *                 example: Ahmed
 *               jobTitle:
 *                 type: string
 *                 example: Full Stack Engineer
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
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

// DELETE /users/{id}

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user account from database.
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
 *                   example: User has been deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User was not found
 */

// DELETE /users/{id}

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
 *         jobTitle:
 *           type: string
 *           example: Full Stack Engineer
 *         email:
 *           type: string
 *           format: email
 *           example: ahmed@example.com
 *         isAdmin:
 *           type: boolean
 *           example: false
 *         isVerified:
 *           type: boolean
 *           example: true
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
