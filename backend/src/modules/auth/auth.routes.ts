import express from "express";
import {
  register,
  login,
  sendForgotPasswodLink,
  resetPassword,
  verifyEmailOTP,
  resendOTP,
  getMe,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { authLimiter } from "../../middlewares/limiter.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, sendForgotPasswodLink);
router.post("/reset-password/:userId/:token", resetPassword);
router.post("/verify-otp", verifyEmailOTP);
router.post("/resend-otp", authLimiter, resendOTP);
router.get("/me", verifyToken, getMe);

export default router;
