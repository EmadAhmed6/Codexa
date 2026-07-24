import express, {} from "express";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import { User, validateUpdateUser } from "./user.model.js";
import { Auth } from "../auth/auth.model.js";
import fs from "fs";
import bcrypt from "bcryptjs";
// GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
    const user = await User.find();
    res.status(200).json({ success: true, data: user });
    return;
});
// GET USER BY ID
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
    return;
});
// UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
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
        // Update password in the auth model (same users collection)
        await Auth.findByIdAndUpdate(req.params.id, {
            $set: { password: req.body.password }
        });
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            email: req.body.email,
        },
    }, { new: true, runValidators: true });
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }
    res.status(200).json({ success: true, data: user });
    return;
});
// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await User.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "User deleted successfully" });
        return;
    }
    else {
        res.status(404).json({ success: false, message: "User was not found" });
        return;
    }
});
// Upload User Profile Picture
const uploadUserPicture = asyncHandler(async (req, res) => {
    const id = req.user?.id;
    if (!id) {
        res.status(401).json({ success: false, message: "Not authorized" });
        return;
    }
    const user = await User.findById(id);
    if (!user) {
        res.status(404).json({ success: false, message: "User was not found" });
        return;
    }
    if (!req.file) {
        res.status(400).json({ success: false, message: "No file provided" });
        return;
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    const updatedUser = await User.findByIdAndUpdate(id, {
        $set: {
            profilePicture: {
                url: result.secure_url,
                publicId: result.public_id,
            },
        },
    }, { new: true });
    fs.unlinkSync(req.file.path);
    res.status(200).json({ success: true, data: updatedUser });
    return;
});
export { getAllUsers, getUserById, updateUser, deleteUser, uploadUserPicture };
//# sourceMappingURL=user.controller.js.map