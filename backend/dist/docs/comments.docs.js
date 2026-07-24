// ├── GET    /posts/{postId}/comments
// ├── POST   /posts/{postId}/comments
// ├── PUT    /posts/{postId}/comments/{commentId}
// ├── DELETE /posts/{postId}/comments/{commentId}
// ├── PUT    /posts/{postId}/comments/{commentId}/like
// └── POST   /posts/{postId}/comments/{commentId}/upload
export {};
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management APIs
 */
/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *       - in: query
 *         name: pageNumber
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: commentsPerPage
 *         required: false
 *         description: Number of comments per page
 *         schema:
 *           type: integer
 *           default: 5
 *           example: 5
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
 *                     $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Post ID is required
 *       401:
 *         description: Not authorized
 */
/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Create a new comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: This is a great post!
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input or Post ID is required
 *       401:
 *         description: Not authorized
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012346
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Updated comment text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input or Comment ID is required
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Comment was not found
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012346
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: Comment has been deleted successfully
 *       400:
 *         description: Comment ID is required
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Comment was not found
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/like:
 *   put:
 *     summary: Like or unlike a comment
 *     description: Toggle the current user's like on a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012346
 *     responses:
 *       200:
 *         description: Comment like status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: You must be logged in to like this comment
 *       404:
 *         description: Comment was not found
 */
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}/upload:
 *   post:
 *     summary: Upload an image to a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012346
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Comment image uploaded successfully
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
 *                       example: Uploaded comment image successfully
 *                     image:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           format: uri
 *                           example: https://res.cloudinary.com/example/image/upload/comment_attachment.jpg
 *                         publicId:
 *                           type: string
 *                           nullable: true
 *                           example: comment_image_789
 *       400:
 *         description: No file provided or Comment ID is required
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Comment was not found
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012346
 *         postId:
 *           type: string
 *           example: 65f1a2b3c4d5e6f789012345
 *         text:
 *           type: string
 *           example: This is a great post!
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 65f1a2b3c4d5e6f789012347
 *             username:
 *               type: string
 *               example: Ahmed
 *         image:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               format: uri
 *               example: https://res.cloudinary.com/example/image/upload/comment.jpg
 *             publicId:
 *               type: string
 *               nullable: true
 *               example: comment_image_123
 *         likes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               username:
 *                 type: string
 *         commentLikesCount:
 *           type: number
 *           example: 3
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */ 
//# sourceMappingURL=comments.docs.js.map