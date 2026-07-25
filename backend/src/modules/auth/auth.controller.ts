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

const generateOtpEmailHtml = (username: string, otp: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" max-width="560" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 20px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15)); border-bottom: 1px solid #334155;">
                <div style="display: inline-block; padding: 10px 18px; background: #6366f1; border-radius: 12px; font-weight: 800; font-size: 20px; color: #ffffff; letter-spacing: 1px;">
                  CODEXA 🚀
                </div>
                <h1 style="margin: 16px 0 0 0; font-size: 22px; font-weight: 700; color: #ffffff;">Email Verification Code</h1>
              </td>
            </tr>

            <!-- Content Body -->
            <tr>
              <td style="padding: 32px; text-align: center;">
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                  Hello <strong style="color: #ffffff;">${username}</strong> 👋, welcome to Codexa!
                </p>
                <p style="margin: 0 0 28px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                  Use the 6-digit verification code below to complete your account registration:
                </p>

                <!-- OTP Code Display Card -->
                <div style="background-color: #0f172a; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; margin: 0 auto 28px auto; max-width: 320px;">
                  <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #818cf8; letter-spacing: 10px; display: inline-block; margin-left: 10px;">${otp}</span>
                </div>

                <p style="margin: 0 0 8px 0; font-size: 13px; color: #e2e8f0; font-weight: 600;">
                  ⏱️ Code expires in <strong>10 minutes</strong>.
                </p>
                <p style="margin: 0; font-size: 12px; color: #64748b;">
                  If you didn't create an account with Codexa, please safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 20px; background-color: #0f172a; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
                © ${new Date().getFullYear()} Codexa Engineering Platform. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

const generateResetPasswordEmailHtml = (username: string, resetLink: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" max-width="560" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 20px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(147, 51, 234, 0.15)); border-bottom: 1px solid #334155;">
                <div style="display: inline-block; padding: 10px 18px; background: #6366f1; border-radius: 12px; font-weight: 800; font-size: 20px; color: #ffffff; letter-spacing: 1px;">
                  CODEXA 🚀
                </div>
                <h1 style="margin: 16px 0 0 0; font-size: 22px; font-weight: 700; color: #ffffff;">Reset Your Password</h1>
              </td>
            </tr>

            <!-- Content Body -->
            <tr>
              <td style="padding: 32px; text-align: center;">
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                  Hello <strong style="color: #ffffff;">${username}</strong>,
                </p>
                <p style="margin: 0 0 28px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                  We received a request to reset the password for your Codexa account. Click the button below to choose a new password:
                </p>

                <!-- Reset Password CTA Button -->
                <div style="margin: 0 0 28px 0;">
                  <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; border-radius: 12px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
                    Reset Password
                  </a>
                </div>

                <p style="margin: 0 0 16px 0; font-size: 13px; color: #e2e8f0; font-weight: 600;">
                  ⏱️ Link expires in <strong>10 minutes</strong>.
                </p>
                <div style="background-color: #0f172a; border-radius: 10px; padding: 12px; font-size: 11px; color: #64748b; word-break: break-all;">
                  If the button above doesn't work, copy and paste this URL into your browser:<br>
                  <a href="${resetLink}" style="color: #818cf8; text-decoration: underline;">${resetLink}</a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 20px; background-color: #0f172a; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
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
      "Verify Your Email - Codexa",
      generateOtpEmailHtml(finalUser.username, generatedOtp),
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
        message: error.issues[0]?.message || "Invalid Input",
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
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const link = `${frontendUrl}/auth/reset-password/${user.id}/${token}`;
    await sendEmail(
      user.email,
      "Reset Password Link - Codexa",
      generateResetPasswordEmailHtml(user.username, link),
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

      const genSalt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, genSalt);
      await user.save();
      res.status(200).json({
        data: { message: "Password updated successfully" },
      });
      return;
    } catch {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }
  },
);

// GET CURRENT USER ME
const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
  },
);

export {
  register,
  login,
  sendForgotPasswodLink,
  resetPassword,
  verifyEmailOTP,
  getMe,
};
