import mongoose, { Document, Types } from "mongoose";
import { type IUpdateComment } from "./comment.schema.js";
interface ICreateComment {
    postId: string;
    text: string;
    image?: {
        url: string;
        publicId: string | null;
    };
}
interface IComment extends Omit<ICreateComment, "postId">, Document {
    postId: Types.ObjectId;
    user: Types.ObjectId;
    likes: Types.ObjectId[];
    commentsCount: Number;
    commentLikesCount: Number;
}
declare const validateCreateComment: (comment: ICreateComment) => import("zod").ZodSafeParseResult<{
    postId: string;
    text: string;
    image?: {
        url: string;
        publicId: string | null;
    } | undefined;
}>;
declare const validateUpdateComment: (comment: IUpdateComment) => import("zod").ZodSafeParseResult<{
    postId?: string | undefined;
    text?: string | undefined;
    image?: {
        url: string;
        publicId: string | null;
    } | undefined;
}>;
declare const Comment: mongoose.Model<IComment, {}, {}, {}, Document<unknown, {}, IComment, {}, mongoose.DefaultSchemaOptions> & IComment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IComment>;
export { Comment, validateCreateComment, validateUpdateComment };
//# sourceMappingURL=comment.model.d.ts.map