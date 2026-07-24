import { z } from "zod";

const CreatePostSchema = z.object({
  title: z.string().trim().min(1).max(32),
  description: z.string().trim().min(1).max(250),
  category: z.string(),
  image: z
    .object({
      url: z.string().url(),
      publicId: z.string().nullable(),
    })
    .optional(),
});

const UpdatePostSchema = CreatePostSchema.partial();

export { CreatePostSchema, UpdatePostSchema };

export type ICreatePost = z.infer<typeof CreatePostSchema>;
export type IUpdatePost = z.infer<typeof UpdatePostSchema>;
