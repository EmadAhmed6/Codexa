import jwt from "jsonwebtoken";
import { Document, Schema, model } from "mongoose";
import {
  ForgotPasswordSchema,
  LoginSchema,
  OtpSchema,
  RegisterSchema,
  ResetPasswordSchema,
  UpdateUserSchema,
  type ILoginUser,
  type IOtp,
  type IRegisterUser,
  type IResetPassword,
  type IUserSchema,
} from "./user.schema.js";

interface IUser extends Document, IUserSchema {
  isAdmin: boolean;
  generateToken: () => string;
  isVerified: boolean;
  postsCount: number;
  isSuperAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
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
    jobTitle: {
      type: String,
      default: "User",
      trim: true,
      maxLength: 50,
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 250,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
      default: null,
      select: false,
    },
    otpExpired: {
      type: Date,
      default: null,
      select: false,
    },
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
    isVerified: { type: Boolean, default: false },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
);
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

userSchema.methods.generateToken = function (this: IUser): string {
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
      isSuperAdmin: this.isSuperAdmin,
      username: this.username,
    },
    process.env.JWT_SECRET_KEY as string,
  );
};

const validateRegisterUser = (user: IRegisterUser) => {
  return RegisterSchema.safeParse(user);
};
const validateLoginUser = (user: ILoginUser) => {
  return LoginSchema.safeParse(user);
};
const validateForgotPassword = (email: string) => {
  return ForgotPasswordSchema.safeParse(email);
};
const validateResetPassword = (password: IResetPassword) => {
  return ResetPasswordSchema.safeParse(password);
};

const validateVerifyOtp = (data: IOtp) => {
  return OtpSchema.safeParse(data);
};
const validateUpdateUser = (
  user: Partial<IUser> & {
    profilePicture: { url: string; publicId: string | null };
  },
) => {
  return UpdateUserSchema.safeParse(user);
};

const User = model<IUser>("User", userSchema);

export {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateResetPassword,
  validateForgotPassword,
  validateVerifyOtp,
  validateUpdateUser,
};
