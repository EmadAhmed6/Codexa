import { z } from "zod";
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must include uppercase, lowercase, and numbers",
  );
const RegisterSchema = z.object({
  fullName: z.string().min(3).max(100),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must contain only letters, numbers, and underscores",
    ),
  email: z.string().email().trim().min(4),
  jobTitle: z.string().min(3).max(50).optional().or(z.literal("")),
  password: passwordSchema,
});

const LoginSchema = z.object({
  email: z.string().email().trim().min(4),
  password: passwordSchema,
});

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});
const OtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().min(6, { message: "Otp Must be at least 6 digits" }),
});

const ResetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

const UserSchema = z.object({
  fullName: z.string().trim().min(3).max(250),
  username: z.string().trim().min(3).max(50),
  email: z.string().email().trim().min(4),
  password: passwordSchema,
  profilePicture: z
    .object({
      url: z.string().url(),
      publicId: z.string().nullable(),
    })
    .optional(),
  jobTitle: z.string().max(50).optional().or(z.literal("")),
  otp: z.string().min(6).optional(),
  otpExpired: z.date().optional(),
  bio: z.string().max(250).optional().or(z.literal("")),
});

const UpdateUserSchema = UserSchema.partial();

export {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  passwordSchema,
  OtpSchema,
  UserSchema,
  UpdateUserSchema,
};

export type IRegisterUser = z.infer<typeof RegisterSchema>;
export type ILoginUser = z.infer<typeof LoginSchema>;
export type IOtp = z.infer<typeof OtpSchema>;
export type IForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type IResetPassword = z.infer<typeof ResetPasswordSchema>;
export type IUserSchema = z.infer<typeof UserSchema>;
export type IUpdateUser = z.infer<typeof UpdateUserSchema>;
