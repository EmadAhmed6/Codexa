import express from "express";
import {
  register,
  login,
  sendForgotPasswodLink,
  resetPassword,
  verifyEmailOTP,
  getMe,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", sendForgotPasswodLink);
router.post("/reset-password/:userId/:token", resetPassword);
router.post("/verify-otp", verifyEmailOTP);
router.get("/me", verifyToken, getMe);

export default router;
