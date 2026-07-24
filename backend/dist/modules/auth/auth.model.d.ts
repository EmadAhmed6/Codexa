import mongoose, { Document } from "mongoose";
import { type IRegisterUser, type ILoginUser, type IResetPassword, type IOtp } from "./auth.schema.js";
export interface IAuth extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAdmin: boolean;
    profilePicture?: {
        url: string;
        publicId: string | null;
    };
    postsCount?: number;
    generateToken: () => string;
}
declare const validateRegisterUser: (user: IRegisterUser) => import("zod").ZodSafeParseResult<{
    username: string;
    email: string;
    password: string;
}>;
declare const validateLoginUser: (user: ILoginUser) => import("zod").ZodSafeParseResult<{
    email: string;
    password: string;
}>;
declare const validateForgotPassword: (email: string) => import("zod").ZodSafeParseResult<{
    email: string;
}>;
declare const validateResetPassword: (password: IResetPassword) => import("zod").ZodSafeParseResult<{
    password: string;
    confirmPassword: string;
}>;
declare const validateVerifyOtp: (data: IOtp) => import("zod").ZodSafeParseResult<{
    email: string;
    otp: string;
}>;
export declare const Auth: mongoose.Model<IAuth, {}, {}, {}, Document<unknown, {}, IAuth, {}, mongoose.DefaultSchemaOptions> & IAuth & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAuth>;
export { validateRegisterUser, validateLoginUser, validateForgotPassword, validateResetPassword, validateVerifyOtp, };
//# sourceMappingURL=auth.model.d.ts.map