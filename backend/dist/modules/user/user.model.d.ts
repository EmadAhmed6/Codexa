import { Document } from "mongoose";
import { type IUserSchema } from "./user.schema.js";
interface IUser extends Document, IUserSchema {
    postsCount: number;
}
declare const validateUpdateUser: (user: Partial<IUser> & {
    profilePicture: {
        url: string;
        publicId: string | null;
    };
}) => import("zod").ZodSafeParseResult<{
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    profilePicture?: {
        url: string;
        publicId: string | null;
    } | undefined;
}>;
declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export { User, validateUpdateUser, };
//# sourceMappingURL=user.model.d.ts.map