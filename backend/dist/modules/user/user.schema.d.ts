import { z } from "zod";
declare const UserSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    profilePicture: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const UpdateUserSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    profilePicture: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export { UserSchema, UpdateUserSchema, };
export type IUserSchema = z.infer<typeof UserSchema>;
export type IUpdateUser = z.infer<typeof UpdateUserSchema>;
//# sourceMappingURL=user.schema.d.ts.map