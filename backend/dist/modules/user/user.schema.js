import { z } from "zod";
import { passwordSchema } from "../auth/auth.schema.js";
const UserSchema = z.object({
    username: z.string().trim().min(3).max(10),
    email: z.string().email().trim().min(4),
    password: passwordSchema,
    profilePicture: z
        .object({
        url: z.string().url(),
        publicId: z.string().nullable(),
    })
        .optional(),
});
const UpdateUserSchema = UserSchema.partial();
export { UserSchema, UpdateUserSchema, };
//# sourceMappingURL=user.schema.js.map