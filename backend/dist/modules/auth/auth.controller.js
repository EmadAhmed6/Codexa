import express, {} from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Auth, validateRegisterUser, validateLoginUser, validateResetPassword, validateForgotPassword, validateVerifyOtp, } from "./auth.model.js";
const sendEmail = async (to, subject, html) => {
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
let otpStore = {};
const register = asyncHandler(async (req, res) => {
    const { error, success } = validateRegisterUser(req.body);
    if (!success) {
        res
            .status(400)
            .json({ message: error.issues[0]?.message || "Invalid Input" });
        return;
    }
    const user = await Auth.findOne({ email: req.body.email });
    if (user) {
        res
            .status(400)
            .json({ success: false, message: "Email is already exist" });
        return;
    }
    const genSalt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, genSalt);
    const newUser = new Auth({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isVerified: false,
    });
    const finalUser = await newUser.save();
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[finalUser.email] = otp;
    await sendEmail(finalUser.email, "Verify Your Email", `<div>
        <h3>Welcome ${finalUser.username}</h3>
        <p>Your Verification Code is: <b>${otp}</b></p>
      </div>`);
    const token = finalUser.generateToken();
    const { password, ...others } = finalUser.toObject();
    res.status(200).json({
        success: true,
        data: {
            message: "Registered Successfully, Check your email for verification code",
            token,
            ...others,
        },
    });
    return;
});
// VERIFY OTP
const verifyEmailOTP = asyncHandler(async (req, res) => {
    const { success, error } = validateVerifyOtp(req.body);
    if (!success) {
        res.status(400).json({
            success: false,
            message: error.issues[0]?.message || "Invalid Otp",
        });
        return;
    }
    const { email, otp } = req.body;
    if (!otpStore[email] || otpStore[email] !== Number(otp)) {
        res
            .status(400)
            .json({ success: false, message: "Invalid or expired token" });
        return;
    }
    const user = await Auth.findOne({ email });
    if (!user) {
        res.status(404).json({ success: false, message: "Email was not found" });
        return;
    }
    user.isVerified = true;
    await user.save();
    const { password, ...others } = user.toObject();
    res.status(200).json({
        success: true,
        data: { message: "Account verified successfully", ...others },
    });
    return;
});
// LOGIN USER
const login = asyncHandler(async (req, res) => {
    const { error, success } = validateLoginUser(req.body);
    if (!success) {
        res
            .status(400)
            .json({ message: error.issues[0]?.message || "Invalid Input" });
        return;
    }
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) {
        res
            .status(400)
            .json({ success: false, message: "Invalid email or password" });
        return;
    }
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
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
});
// SEND FORGOT PASSWORD
const sendForgotPasswodLink = asyncHandler(async (req, res) => {
    const { error, success } = validateForgotPassword(req.body);
    if (!success) {
        res
            .status(400)
            .json({ success: false, message: error.issues[0]?.message });
        return;
    }
    const { email } = req.body;
    const user = await Auth.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "User was not found" });
        return;
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email, id: user.id }, secret, {
        expiresIn: "10m",
    });
    const link = `http://localhost:5000/auth/reset-password/${user.id}/${token}`;
    await sendEmail(user.email, "Reset Password Link", `<div>
        <h3>Click the link below to reset your password</h3>
        <p>${link}</p>
      </div>`);
    res.status(200).json({
        success: true,
        data: { message: "Password reset link sent successfully to your email" },
    });
    return;
});
// RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
    const { error, success } = validateResetPassword(req.body);
    if (!success) {
        res
            .status(400)
            .json({ message: error.issues[0]?.message || "Invalid Input" });
        return;
    }
    const user = await Auth.findById(req.params.userId);
    if (!user) {
        res.status(404).json({ message: "User was not found" });
        return;
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    try {
        jwt.verify(req.params.token, secret);
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user.password = req.body.password;
        await user.save();
        res
            .status(200)
            .json({ data: { message: "Password updated successfully" } });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: "Something went wrong" });
        return;
    }
});
export { register, login, sendForgotPasswodLink, resetPassword, verifyEmailOTP, };
//# sourceMappingURL=auth.controller.js.map