import express from "express";
import mongoose, { Document, model, Schema, Types } from "mongoose";
import {
  CreateCommentSchema,
  UpdateCommentSchema,
  type IUpdateComment,
} from "./comment.schema.js";

interface ICreateComment {
  postId: string;
  text: string;
  image?: {
    url: string;
    publicId: string | null;
  };
}

interface IComment extends Omit<ICreateComment, "postId">, Document {
  postId: Types.ObjectId;
  user: Types.ObjectId;
  likes: Types.ObjectId[];
  commentsCount: Number;
  commentLikesCount: Number;
}
const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: {
        url: { type: String },
        publicId: { type: String, default: null },
      },
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentLikesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const validateCreateComment = (comment: ICreateComment) => {
  return CreateCommentSchema.safeParse(comment);
};
const validateUpdateComment = (comment: IUpdateComment) => {
  return UpdateCommentSchema.safeParse(comment);
};

const Comment = model<IComment>("Comment", CommentSchema);

export { Comment, validateCreateComment, validateUpdateComment };
