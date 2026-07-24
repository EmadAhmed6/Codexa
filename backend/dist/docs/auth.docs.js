// ├── POST /auth/register
// ├── POST /auth/login
// ├── POST /auth/verify-otp
// ├── POST /auth/forgot-password
// └── POST /auth/reset-password
export {};
// Register
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: ahmed
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Registered Successfully, Check your email for verification code
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     _id:
 *                       type: string
 *                       example: 65f1a2b3c4d5e6f789012345
 *                     username:
 *                       type: string
 *                       example: ahmed
 *                     email:
 *                       type: string
 *                       example: ahmed@example.com
 *                     isAdmin:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid input
 */
// Login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user and return a JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65f1a2b3c4d5e6f789012345
 *                     username:
 *                       type: string
 *                       example: ahmed
 *                     email:
 *                       type: string
 *                       example: ahmed@example.com
 *                     isAdmin:
 *                       type: boolean
 *                       example: false
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid email or password
 */
// Forgot Password
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset link
 *     description: Send a password reset link to the user's email address
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Password reset link sent successfully to your email
 *       404:
 *         description: User was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User was not found
 *       500:
 *         description: Something went wrong
 */
// Reset Password
/**
 * @swagger
 * /auth/reset-password/{userId}/{token}:
 *   post:
 *     summary: Reset user password
 *     description: Reset the user's password using the user ID and reset token
 *     tags:
 *       - Auth
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Password updated successfully
 *
 *       400:
 *         description: Invalid password or invalid/expired reset token
 *
 *       404:
 *         description: User was not found
 */
// Verify Email OTP
/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify email using OTP
 *     description: Verify the user's account using the OTP code sent to their email
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               otp:
 *                 type: number
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Account verified successfully
 *                     _id:
 *                       type: string
 *                       example: 65f1a2b3c4d5e6f789012345
 *                     username:
 *                       type: string
 *                       example: ahmed
 *                     email:
 *                       type: string
 *                       example: ahmed@example.com
 *                     isAdmin:
 *                       type: boolean
 *                       example: false
 *                     profilePicture:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: https://res.cloudinary.com/example/image/upload/profile.jpg
 *                         publicId:
 *                           type: string
 *                           example: profile_picture_123
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: Email was not found
 */
//# sourceMappingURL=auth.docs.js.map