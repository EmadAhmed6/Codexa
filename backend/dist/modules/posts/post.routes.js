import express from "express";
import comments from "../comment/comment.routes.js";
import { getAllPosts, getPostById, updatePost, deletePost, createPost, likePost, uploadPostImage, sharePost, } from "./posts.controller.js";
import { verifyToken, verifyAdminToken, verifyAuthorizedToken, verifyPostOwner, } from "../../middlewares/verifyToken.js";
import upload from "../../middlewares/multer.js";
const router = express.Router();
// Crud
router.route("/").get(verifyToken, getAllPosts).post(verifyToken, createPost);
router.post("/:postId/share", verifyToken, sharePost);
router
    .route("/:postId")
    .get(verifyToken, getPostById)
    .put(verifyPostOwner, updatePost)
    .delete(verifyPostOwner, deletePost);
router.put("/:postId/like", verifyToken, likePost);
// Upload Image
router.post("/upload", verifyToken, upload.single("image"), uploadPostImage);
router.use("/:postId/comments", verifyToken, comments);
export default router;
//# sourceMappingURL=post.routes.js.map