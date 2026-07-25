import express, { type Request, type Response } from "express";
import fs from "fs";
import asyncHandler from "express-async-handler";
import {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} from "./comment.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { Types } from "mongoose";
import { Post } from "../posts/post.model.js";
import { string } from "zod";

// GET ALL COMMENTS
const getAllComments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const postId = req.params.postId;
    if (
      !postId ||
      typeof postId !== "string" ||
      !Types.ObjectId.isValid(postId)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Valid Post ID is required" });
      return;
    }

    const commentsPerPost = Number(req.query.commentsPerPost) || 5;

    const comments = await Comment.find({ postId: new Types.ObjectId(postId) })
      .populate("user", ["_id", "username", "profilePicture"])
      .populate("likes", ["_id", "username", "profilePicture", "jobTitle"])
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: ["_id", "username", "profilePicture"],
        },
      })
      .skip((pageNumber - 1) * commentsPerPost)
      .limit(commentsPerPost)
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Request processed successfully",
      data: comments,
    });
    return;
  },
);

// CREATE COMMENT
const createComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.postId;
    if (
      !postId ||
      typeof postId !== "string" ||
      !Types.ObjectId.isValid(postId)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Valid Post ID is required" });
      return;
    }

    const { error, success } = validateCreateComment({
      postId: postId,
      text: req.body.text,
    } as any);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Input",
      });
      return;
    }

    const newComment = new Comment({
      postId: new Types.ObjectId(postId),
      text: req.body.text,
      user: (req as any).user.id,
    });

    await newComment.save();

    const finalComment = await Comment.findById(newComment._id).populate(
      "user",
      ["_id", "username"],
    );

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Request processed successfully",
      data: finalComment,
    });
    return;
  },
);

// UPDATE COMMENT
const updateComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateUpdateComment(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Input",
      });
      return;
    }
    const commentId = req.params.commentId as string;
    if (
      !commentId ||
      typeof commentId !== "string" ||
      !Types.ObjectId.isValid(commentId)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Valid Comment ID is required" });
      return;
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      new Types.ObjectId(commentId),
      {
        $set: {
          text: req.body.text,
        },
      },
      { new: true, runValidators: true },
    ).populate("user", ["_id", "username"]);

    res.status(200).json({
      success: true,
      message: "Request processed successfully",
      data: updatedComment,
    });
    return;
  },
);

// DELETE COMMENT
const deleteComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId as string;
    if (
      !commentId ||
      typeof commentId !== "string" ||
      !Types.ObjectId.isValid(commentId)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Valid Comment ID is required" });
      return;
    }

    const comment = await Comment.findById(new Types.ObjectId(commentId));
    if (comment) {
      await Comment.findByIdAndDelete(new Types.ObjectId(commentId));
      await Comment.findByIdAndUpdate(comment.postId, {
        $inc: { commentsCount: -1 },
      });
      res.status(200).json({
        success: true,
        message: "Comment has been deleted successfully",
      });
      return;
    } else {
      res
        .status(404)
        .json({ success: false, message: "Comment was not found" });
      return;
    }
  },
);

// LIKE COMMENT
const likeComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId as string;
    if (!commentId || typeof commentId !== "string") {
      res
        .status(400)
        .json({ success: false, message: "Valid Comment ID is required" });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ message: "You must be logged in to like this comment" });
      return;
    }

    const comment = await Comment.findById(new Types.ObjectId(commentId));
    if (!comment) {
      res
        .status(404)
        .json({ success: false, message: "Comment was not found" });
      return;
    }

    const isLiked = comment.likes.some(
      (likeId) => likeId.toString() === userId,
    );
    const updatedComment = await Comment.findByIdAndUpdate(
      new Types.ObjectId(commentId),
      isLiked
        ? { $pull: { likes: userId }, $inc: { commentLikesCount: -1 } }
        : { $push: { likes: userId }, $inc: { commentLikesCount: 1 } },
      { new: true },
    ).populate("likes", ["_id", "username", "profilePicture", "jobTitle"]);

    res.status(200).json({
      success: true,
      message: "Request processed successfully",
      data: updatedComment,
    });
    return;
  },
);

// UPLOAD COMMENT IMAGE
const uploadCommentImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId as string;

    if (!commentId || typeof commentId !== "string") {
      res
        .status(400)
        .json({ success: false, message: "Valid Comment ID is required" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: "No file provided" });
      return;
    }

    const comment = await Comment.findById(new Types.ObjectId(commentId));
    if (!comment) {
      res
        .status(404)
        .json({ success: false, message: "Comment was not found" });
      return;
    }
    if (comment.image?.publicId) {
      await cloudinary.uploader.destroy(comment.image.publicId);
    }
    const result = await cloudinary.uploader.upload(req.file.path);

    comment.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await comment.save();

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Request processed successfully",
      data: comment.image,
    });
    return;
  },
);

// REPLY COMMENT
const replyComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const parentCommentId = req.params.commentId as string;
    const postId = req.params.postId as string;
    if (
      !parentCommentId ||
      typeof parentCommentId !== "string" ||
      !Types.ObjectId.isValid(parentCommentId) ||
      !postId ||
      typeof postId !== "string" ||
      !Types.ObjectId.isValid(postId)
    ) {
      res.status(400).json({
        success: false,
        message: "Valid Post ID and Parent Comment ID are required",
      });
      return;
    }

    const { success, error } = validateCreateComment({
      postId: postId,
      text: req.body.text,
    } as any);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid input",
      });
      return;
    }

    const comment = await Comment.findOne({
      _id: parentCommentId,
      postId: postId,
    });

    if (!comment) {
      res.status(404).json({
        success: false,
        data: { message: "Parent comment was not found in this post" },
      });
      return;
    }

    const newReply = new Comment({
      postId: (req as any).params.postId,
      text: req.body.text,
      user: (req as any).user.id,
      parentComment: parentCommentId,
    });

    await newReply.save();

    await Comment.findByIdAndUpdate(parentCommentId, {
      $inc: { replyCommentsCount: 1 },
    });
    const finalCommentReply = await Comment.findById(newReply._id)
      .populate("user", ["username", "profilePicture", "jobTitle"])
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: ["_id", "username", "profilePicture", "jobTitle"],
        },
      });

    res.status(201).json({
      success: true,
      data: finalCommentReply,
    });
    return;
  },
);

// UPDATE REPLY COMMENT
const updateReplyComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const replyCommentId = req.params.replyCommentId as string;
    const postId = req.params.postId as string;
    if (
      !replyCommentId ||
      typeof replyCommentId !== "string" ||
      !Types.ObjectId.isValid(replyCommentId) ||
      !postId ||
      typeof postId !== "string" ||
      !Types.ObjectId.isValid(postId)
    ) {
      res.status(400).json({
        success: false,
        message: "Valid Post ID and Reply Comment ID are required",
      });
      return;
    }

    const { success, error } = validateUpdateComment(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid input",
      });
      return;
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      replyCommentId,
      {
        $set: {
          text: req.body.text,
        },
      },
      { new: true, runValidators: true },
    ).populate("user", ["username", "profilePicture", "jobTitle"]);

    res.status(200).json({
      success: true,
      data: updatedComment,
      message: "Updated reply comment successfully",
    });
  },
);

// DELETE REPLY COMMENT
const deleteReplyComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const replyCommentId = req.params.replyCommentId as string;
    const postId = req.params.postId as string;
    if (
      !replyCommentId ||
      typeof replyCommentId !== "string" ||
      !Types.ObjectId.isValid(replyCommentId) ||
      !postId ||
      typeof postId !== "string" ||
      !Types.ObjectId.isValid(postId)
    ) {
      res.status(400).json({
        success: false,
        message: "Valid Post ID and Reply Comment ID are required",
      });
      return;
    }
    const replyComment = await Comment.findOne({
      _id: new Types.ObjectId(replyCommentId),
      postId: new Types.ObjectId(postId),
    });
    if (!replyComment) {
      res.status(404).json({
        success: false,
        message: "Reply comment was not found",
      });
      return;
    }
    await Comment.findByIdAndDelete(replyCommentId);
    await Comment.findByIdAndUpdate(replyComment.parentComment, {
      $inc: { replyCommentsCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Deleted reply comment successfully",
    });
    return;
  },
);

// UPLOAD REPLY COMMENT IMAGE
const uploadReplyCommentImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const replyCommentId = req.params.replyCommentId as string;
    const postId = req.params.postId as string;
    if (
      !replyCommentId ||
      typeof replyCommentId !== "string" ||
      !Types.ObjectId.isValid(replyCommentId) ||
      !postId ||
      typeof postId !== "string" ||
      !Types.ObjectId.isValid(postId)
    ) {
      res.status(400).json({
        success: false,
        data: { message: "Invalid reply comment id" },
      });
      return;
    }
    if (!req.file) {
      res.status(400).json({
        success: false,
        data: { message: "Image not provided" },
      });
      return;
    }
    const replyComment = await Comment.findOne({
      _id: replyCommentId,
      postId: postId,
    });
    if (!replyComment) {
      res.status(404).json({
        success: false,
        data: { message: "Reply comment was not found" },
      });
      return;
    }

    if (replyComment.image?.publicId) {
      await cloudinary.uploader.destroy(replyComment.image.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    replyComment.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await replyComment.save();
    fs.unlinkSync(req.file.path);
    res.status(200).json({
      success: true,
      message: "Reply comment image uploaded successfully",
      data: replyComment,
    });
    return;
  },
);

const likeReply = asyncHandler(async (req: Request, res: Response) => {
  const commentId = req.params.commentId as string;
  const replyCommentId = req.params.replyCommentId as string;
  const postId = req.params.postId as string;
  const userId = req.user?.id as string;
  if (
    !commentId ||
    typeof commentId !== "string" ||
    !Types.ObjectId.isValid(commentId) ||
    !postId ||
    typeof postId !== "string" ||
    !Types.ObjectId.isValid(postId)
  ) {
    res.status(400).json({
      success: false,
      data: { message: "Valid Parent comment id and post id are required" },
    });
    return;
  }

  if (
    !replyCommentId ||
    typeof replyCommentId !== "string" ||
    !Types.ObjectId.isValid(replyCommentId)
  ) {
    res.status(400).json({
      success: false,
      data: { message: "Invalid reply comment id" },
    });
    return;
  }

  const comment = await Comment.findOne({
    _id: commentId,
    postId: (req as any).params.postId,
  });
  if (!comment) {
    res.status(404).json({
      success: false,
      data: { message: "Comment not found" },
    });
    return;
  }
  const replyComment = await Comment.findById(
    new Types.ObjectId(replyCommentId),
  );
  if (!replyComment) {
    res.status(404).json({
      success: false,
      data: { message: "Comment was not found" },
    });
    return;
  }
  const isLiked = replyComment.likes.some(
    (likeId) => likeId.toString() === userId,
  );
  const updatedComment = await Comment.findByIdAndUpdate(
    new Types.ObjectId(replyCommentId),
    isLiked
      ? {
          $pull: { likes: new Types.ObjectId(userId) },
          $inc: { replyLikesCount: -1 },
        }
      : {
          $push: { likes: new Types.ObjectId(userId) },
          $inc: { replyLikesCount: 1 },
        },
    { new: true, runValidators: true },
  )
    .populate("likes", ["username", "profilePicture", "jobTitle"])
    .populate("user", ["username", "profilePicture", "jobTitle"]);

  res.status(200).json({
    success: true,
    message: isLiked
      ? "Comment unliked successfully"
      : "Reply comment liked successfully",
    data: updatedComment,
  });
  return;
});

export {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  uploadCommentImage,
  replyComment,
  updateReplyComment,
  deleteReplyComment,
  uploadReplyCommentImage,
  likeReply,
};
