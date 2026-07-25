import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  validateRegisterUser,
  User,
  validateLoginUser,
  validateResetPassword,
  validateForgotPassword,
  validateVerifyOtp,
} from "../user/user.model.js";

const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to,
    subject,
    html,
  });
};

// REGISTER USER
const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateRegisterUser(req.body);
    if (!success) {
      res
        .status(400)
        .json({ message: error.issues[0]?.message || "Invalid Input" });
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res
        .status(400)
        .json({ success: false, message: "Email is already exist" });
      return;
    }
    const genSalt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, genSalt);

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpired = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isVerified: false,
      otp: generatedOtp,
      otpExpired,
    });

    const finalUser = await newUser.save();
    await sendEmail(
      finalUser.email,
      "Verify Your Email",
      `<div>
        <h3>Welcome ${finalUser.username}</h3>
        <p>Your Verification Code is: <b>${generatedOtp}</b></p>
      </div>`,
    );

    const token = finalUser.generateToken();
    const {
      password,
      otp: _,
      otpExpired: __,
      ...others
    } = finalUser.toObject();

    res.status(200).json({
      success: true,
      data: {
        message:
          "Registered Successfully, Check your email for verification code",
        token,
        ...others,
      },
    });
    return;
  },
);

// VERIFY OTP
const verifyEmailOTP = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { success, error } = validateVerifyOtp(req.body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: error.issues[0]?.message || "Invalid Otp",
      });
      return;
    }
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "Email was not found" });
      return;
    }
    if (user.otp !== otp || !user.otpExpired || user.otpExpired < new Date()) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpired = undefined;
    await user.save();
    const { password, otp: __, otpExpired: _, ...others } = user.toObject();
    res.status(200).json({
      success: true,
      data: { message: "Account verified successfully", ...others },
    });
    return;
  },
);

// LOGIN USER
const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateLoginUser(req.body);
    if (!success) {
      res
        .status(400)
        .json({ message: error.issues[0]?.message || "Invalid Input" });
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordMatch) {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }
    const token = user.generateToken();
    const { password, ...others } = user.toObject();
    res.status(200).json({ success: true, data: { ...others, token } });
    return;
  },
);

// SEND FORGOT PASSWORD
const sendForgotPasswodLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateForgotPassword(req.body);
    if (!success) {
      res
        .status(400)
        .json({ success: false, message: error.issues[0]?.message });
      return;
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User was not found" });
      return;
    }
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }
    const token = jwt.sign({ email, id: user.id }, secret, {
      expiresIn: "10m",
    });
    const link = `http://localhost:3000/auth/reset-password/${user.id}/${token}`;
    await sendEmail(
      user.email,
      "Reset Password Link",
      `<div>
        <h3>Click the link below to reset your password</h3>
        <p>${link}</p>
      </div>`,
    );
    res.status(200).json({
      success: true,
      data: { message: "Password reset link sent successfully to your email" },
    });
    return;
  },
);

// RESET PASSWORD
const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateResetPassword(req.body);
    if (!success) {
      res
        .status(400)
        .json({ message: error.issues[0]?.message || "Invalid Input" });
      return;
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: "User was not found" });
      return;
    }
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }
    try {
      jwt.verify(req.params.token as string, secret as string);

      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      user.password = req.body.password;

      await user.save();
      res
        .status(200)
        .json({ data: { message: "Password updated successfully" } });
      return;
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
      return;
    }
  },
);

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res
      .status(401)
      .json({ success: false, data: { message: "Not authorized" } });
    return;
  }
  const user = await User.findById(userId)
    .select("-password")
    .populate({
      path: "posts",
      populate: [
        {
          path: "user",
          select: ["_id", "username", "profilePicture", "jobTitle"],
        },
        {
          path: "likes",
          select: ["_id", "username", "profilePicture", "jobTitle"],
        },
        {
          path: "shares",
          select: ["_id", "username", "profilePicture", "jobTitle"],
        },
        {
          path: "sharedPost",
          populate: [
            {
              path: "user",
              select: ["_id", "username", "profilePicture", "jobTitle"],
            },
            {
              path: "likes",
              select: ["_id", "username", "profilePicture", "jobTitle"],
            },
            {
              path: "shares",
              select: ["_id", "username", "profilePicture", "jobTitle"],
            },
          ],
        },
      ],
    });
  if (!user) {
    res
      .status(404)
      .json({ success: false, data: { message: "User not found" } });
    return;
  }
  res.status(200).json({ success: true, data: user });
  return;
});

export {
  register,
  login,
  sendForgotPasswodLink,
  resetPassword,
  verifyEmailOTP,
  getMe,
};
