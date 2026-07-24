import { z } from "zod";
declare const CreateCommentSchema: z.ZodObject<{
    postId: z.ZodString;
    text: z.ZodString;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const UpdateCommentSchema: z.ZodObject<{
    postId: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export { CreateCommentSchema, UpdateCommentSchema };
export type IUpdateComment = z.infer<typeof UpdateCommentSchema>;
//# sourceMappingURL=comment.schema.d.ts.map