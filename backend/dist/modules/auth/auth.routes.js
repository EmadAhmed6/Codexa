import express from "express";
import { register, login, sendForgotPasswodLink, resetPassword, verifyEmailOTP, } from "./auth.controller.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", sendForgotPasswodLink);
router.post("/reset-password/:userId/:token", resetPassword);
router.post("/verify-otp", verifyEmailOTP);
export default router;
//# sourceMappingURL=auth.routes.js.map