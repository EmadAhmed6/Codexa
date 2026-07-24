import mongoose, { Schema, Document, model } from "mongoose";
import jwt from "jsonwebtoken";
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema, OtpSchema, } from "./auth.schema.js";
const authSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    profilePicture: {
        type: {
            url: String,
            publicId: { type: String, default: null },
        },
        default: {
            url: "",
            publicId: null,
        },
    },
    postsCount: { type: Number, default: 0 },
}, { timestamps: true });
authSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin, username: this.username }, process.env.JWT_SECRET_KEY);
};
const validateRegisterUser = (user) => {
    return RegisterSchema.safeParse(user);
};
const validateLoginUser = (user) => {
    return LoginSchema.safeParse(user);
};
const validateForgotPassword = (email) => {
    return ForgotPasswordSchema.safeParse(email);
};
const validateResetPassword = (password) => {
    return ResetPasswordSchema.safeParse(password);
};
const validateVerifyOtp = (data) => {
    return OtpSchema.safeParse(data);
};
export const Auth = model("Auth", authSchema, "users");
export { validateRegisterUser, validateLoginUser, validateForgotPassword, validateResetPassword, validateVerifyOtp, };
//# sourceMappingURL=auth.model.js.map