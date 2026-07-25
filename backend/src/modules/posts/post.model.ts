import express from "express";
import mongoose, { Schema, Document, Types, model } from "mongoose";
import {
  CreatePostSchema,
  UpdatePostSchema,
  type ICreatePost,
  type IUpdatePost,
} from "./post.schema.js";

interface IPost extends ICreatePost, Document {
  user: Types.ObjectId;
  likes: Types.ObjectId[];
  shares: Types.ObjectId[];
  sharedPost: Types.ObjectId;
  sharesCount: Number;
  commentsCount: Number;
  postLikesCount: Number;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 250,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: {
        url: { type: String },
        publicId: { type: String, default: null },
      },
      _id: false,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shares: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sharedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    postLikesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});

const validateCreatePost = (post: Omit<IPost, "user" | "likes">) => {
  return CreatePostSchema.safeParse(post);
};

const validateUpdatePost = (
  post: Partial<Omit<IUpdatePost, "user" | "likes">>,
) => {
  return UpdatePostSchema.safeParse(post);
};

const Post = model<IPost>("Post", PostSchema);

export { Post, validateCreatePost, validateUpdatePost };
