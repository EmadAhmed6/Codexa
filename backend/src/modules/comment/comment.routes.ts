import express from "express";
const router = express.Router({ mergeParams: true });
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  uploadCommentImage,
  replyComment,
  uploadReplyCommentImage,
  updateReplyComment,
  likeReply,
  deleteReplyComment,
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
router.post("/:commentId/reply", verifyToken, replyComment);

router
  .route("/:commentId/reply/:replyCommentId")
  .post(verifyCommentOwner, upload.single("image"), uploadReplyCommentImage)
  .put(verifyCommentOwner, updateReplyComment)
  .delete(verifyCommentOwner, deleteReplyComment);

router.put("/:commentId/reply/:replyCommentId/like", verifyToken, likeReply);

export default router;
