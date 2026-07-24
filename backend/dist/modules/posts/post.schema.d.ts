import { z } from "zod";
declare const CreatePostSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const UpdatePostSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export { CreatePostSchema, UpdatePostSchema };
export type ICreatePost = z.infer<typeof CreatePostSchema>;
export type IUpdatePost = z.infer<typeof UpdatePostSchema>;
//# sourceMappingURL=post.schema.d.ts.map