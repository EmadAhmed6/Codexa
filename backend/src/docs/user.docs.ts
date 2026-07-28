// GET    /users
// GET    /users/{id}
// PUT    /users/{id}
// PATCH  /users/{id}
// DELETE /users/{id}

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
 *     description: Update username, job title, bio, email, password, or profile picture. Access is allowed for account owner or Admins. Super Admin (Owner) profile cannot be updated by regular Admins.
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
 *               bio:
 *                 type: string
 *                 example: Software Developer & Tech Enthusiast
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *               isAdmin:
 *                 type: boolean
 *                 example: true
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
 *       403:
 *         description: Cannot modify Owner/Super Admin profile
 *       404:
 *         description: User not found
 */

// PATCH  /users/{id}/toggle-admin
/**
 * @swagger
 * /users/{id}/toggle-admin:
 *   patch:
 *     summary: Toggle user Admin status (Super Admin Only)
 *     description: Toggle the isAdmin boolean role of a target user account. Restricted strictly to Super Administrators. Super Admin status cannot be self-toggled.
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
 *         description: Admin status toggled successfully
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
 *                   example: Request processed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User status changed to Admin
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Only Super Admin allowed or forbidden operation
 *       404:
 *         description: User not found
 */

// DELETE /users/{id}

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user account from database. Restricted to profile owner or Admins. Super Admin (Owner) profile cannot be deleted by regular Admins.
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
 *       403:
 *         description: Cannot delete Owner/Super Admin profile or insufficient permissions
 *       404:
 *         description: User was not found
 */

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
 *         bio:
 *           type: string
 *           example: Software Developer & Tech Enthusiast
 *         email:
 *           type: string
 *           format: email
 *           example: ahmed@example.com
 *         isAdmin:
 *           type: boolean
 *           example: false
 *         isSuperAdmin:
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
