import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { Post, validateCreatePost, validateUpdatePost } from "./post.model.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/cloudinary.js";
import { Types } from "mongoose";
import { User } from "../user/user.model.js";

// GET ALL POSTS

const getAllPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const postsPerPage = 6;
    const posts = await Post.find()
      .populate("user", ["_id", "username", "profilePicture", "jobTitle"])
      .populate("likes", ["_id", "username", "profilePicture", "jobTitle"])
      .populate("shares", ["_id", "username", "profilePicture", "jobTitle"])
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: ["_id", "username", "profilePicture", "jobTitle"],
          },
          {
            path: "likes",
            select: ["_id", "username", "profilePicture", "jobTitle"],
          },
        ],
      })
      .skip((pageNumber - 1) * postsPerPage)
      .limit(postsPerPage)
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
    return;
  },
);

// GET POST BY ID
const getPostById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const posts = await Post.findById(req.params.postId)
      .populate("user", ["_id", "username", "profilePicture", "jobTitle"])
      .populate("likes", ["_id", "username", "profilePicture", "jobTitle"])
      .populate("shares", ["_id", "username", "profilePicture", "jobTitle"])
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: ["_id", "username", "profilePicture", "jobTitle"],
          },
          {
            path: "likes",
            select: ["_id", "username", "profilePicture", "jobTitle"],
          },
        ],
      });
    res.status(200).json({ success: true, data: posts });
    return;
  },
);

// CREATE POST
const createPost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateCreatePost(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Input",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { postsCount: 1 },
    });

    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
      user: req.user?.id,
    });

    const finalPost = await newPost.save();
    await finalPost.populate("user", ["_id", "username", "profilePicture", "jobTitle"]);
    res.status(201).json({ success: true, data: finalPost });
    return;
  },
);

// UPDATE POST
const updatePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateUpdatePost(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Input",
      });
      return;
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404).json({ success: false, message: "Post was not found" });
      return;
    }

    if (!req.user || req.user.id !== post.user.toString()) {
      res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
      return;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
        },
      },
      { new: true },
    ).populate("user", ["_id", "username", "profilePicture", "jobTitle"]);

    res.status(200).json({ success: true, data: updatedPost });
    return;
  },
);

// DELETE POST
const deletePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404).json({ success: false, message: "Post was not found" });
      return;
    }

    const isOwner = req.user && req.user.id === post.user.toString();
    const isAdmin = req.user && req.user.isAdmin;
    if (!isOwner && !isAdmin) {
      res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
      return;
    }

    if (post.image && post.image.publicId) {
      await cloudinary.uploader.destroy(post.image.publicId);
    }

    await Post.findByIdAndDelete(req.params.postId);

    await User.findByIdAndUpdate(post.user, {
      $inc: { postsCount: -1 },
    });

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
    return;
  },
);

// UPLOAD POST IMAGE
const uploadPostImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No image file" });
      return;
    }

    const imagePath = req.file.path;
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "posts",
    });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          image: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        },
      },
      { new: true },
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ success: true, data: updatedPost });
    return;
  },
);

// LIKE / UNLIKE POST
const likePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "You are not logged in" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: "Post was not found" });
      return;
    }

    const isLiked = post.likes.some((like) => like.toString() === userId);
    const userObjectId = new Types.ObjectId(userId);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      isLiked
        ? {
            $pull: { likes: userObjectId },
            $inc: { postLikesCount: -1 } as any,
          }
        : {
            $push: { likes: userObjectId },
            $inc: { postLikesCount: 1 } as any,
          },
      { new: true },
    ).populate("likes", ["_id", "username", "profilePicture", "jobTitle"]);

    res.status(200).json({ success: true, data: updatedPost });
    return;
  },
);

// SHARE POST
const sharePost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ success: false, data: { message: "Not authorized" } });
    return;
  }
  const { postId } = req.params;
  const { description } = req.body || {};
  const originalPost = await Post.findById(postId);
  if (!originalPost) {
    res
      .status(404)
      .json({ success: false, data: { message: "Post was not found" } });
    return;
  }
  const sharedPostRecord = new Post({
    title: originalPost?.title,
    description:
      description?.trim() || originalPost?.description || "Shared Article",
    category: originalPost?.category,
    image: originalPost?.image,
    user: req.user.id,
    sharedPost: originalPost?._id,
  });

  const savedSharedPost = await sharedPostRecord.save();
  await Post.findByIdAndUpdate(postId, {
    $inc: { sharesCount: 1 },
    $push: { shares: new Types.ObjectId(req.user.id) },
  });
  await Post.findByIdAndUpdate(req.user.id, {
    $inc: { postsCount: 1 },
  });
  res.status(201).json({
    success: true,
    data: { message: "Post shared successfully", savedSharedPost },
  });
  return;
});

export {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  likePost,
  sharePost,
};
