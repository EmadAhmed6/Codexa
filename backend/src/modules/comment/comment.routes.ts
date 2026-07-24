import express from "express";
const router = express.Router({ mergeParams: true });
import {
  getAllComments,
  updateComment,
  createComment,
  deleteComment,
  likeComment,
  uploadCommentImage,
} from "./comment.controller.js";
import {
  verifyToken,
  verifyAdminToken,
  verifyAuthorizedToken,
  verifyCommentOwner,
} from "../../middlewares/verifyToken.js";
import upload from "../../middlewares/multer.js";

router
  .route("/")
  .get(verifyToken, getAllComments)
  .post(verifyToken, createComment);

router
  .route("/:commentId")
  .put(verifyCommentOwner, updateComment)
  .delete(verifyCommentOwner, deleteComment);

router.post(
  "/:commentId/upload",
  verifyCommentOwner,
  upload.single("image"),
  uploadCommentImage,
);

router.put("/:commentId/like", verifyToken, likeComment);

export default router;
