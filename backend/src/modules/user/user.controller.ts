import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import { User, validateUpdateUser } from "./user.model.js";
import fs from "fs";
import bcrypt from "bcryptjs";

// GET ALL USERS
const getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.find().select("-password");
    res.status(200).json({ success: true, data: user });
    return;
  },
);

// GET USER BY ID
const getUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "posts",
        populate: [
          {
            path: "user",
            select: [
              "_id",
              "fullName",
              "username",
              "profilePicture",
              "jobTitle",
            ],
          },
          {
            path: "likes",
            select: [
              "_id",
              "fullName",
              "username",
              "profilePicture",
              "jobTitle",
            ],
          },
          {
            path: "shares",
            select: [
              "_id",
              "fullName",
              "username",
              "profilePicture",
              "jobTitle",
            ],
          },
          {
            path: "sharedPost",
            populate: [
              {
                path: "user",
                select: [
                  "_id",
                  "fullName",
                  "username",
                  "profilePicture",
                  "jobTitle",
                ],
              },
              {
                path: "likes",
                select: [
                  "_id",
                  "fullName",
                  "username",
                  "profilePicture",
                  "jobTitle",
                ],
              },
              {
                path: "shares",
                select: [
                  "_id",
                  "fullName",
                  "username",
                  "profilePicture",
                  "jobTitle",
                ],
              },
            ],
          },
        ],
      });
    res.status(200).json({
      success: true,
      message: "Request processed successfully",
      data: user,
    });
    return;
  },
);

// UPDATE USER
const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { success, error } = validateUpdateUser(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Input",
      });
      return;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    let userImage: { url: string; publicId: string | null } | undefined =
      undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      userImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      fs.unlinkSync(req.file.path);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          jobTitle: req.body.jobTitle,
          profilePicture: userImage,
          bio: req.body.bio,
        },
      },
      { new: true, runValidators: true },
    )
      .select("-password")
      .select("+email");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Request processed successfully",
      data: user,
    });
    return;
  },
);

// DELETE USER
const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
      return;
    } else {
      res.status(404).json({ success: false, message: "User was not found" });
      return;
    }
  },
);
const toggleAdminStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Request failed",
        data: { message: "User not found" },
      });
      return;
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Request processed successfully",
      data: {
        message: `User status changed to ${user.isAdmin ? "Admin" : "Not Admin"}`,
      },
    });
    return;
  },
);

export { getAllUsers, getUserById, updateUser, deleteUser, toggleAdminStatus };
