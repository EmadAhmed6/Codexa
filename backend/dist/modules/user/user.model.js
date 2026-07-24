import { Document, Schema, model } from "mongoose";
import { UpdateUserSchema, } from "./user.schema.js";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        unique: true,
    },
    postsCount: {
        type: Number,
        default: 0,
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
}, { timestamps: true });
userSchema.virtual("userPosts", {
    ref: "Posts",
    foreignField: "user",
    localField: "_id",
});
const validateUpdateUser = (user) => {
    return UpdateUserSchema.safeParse(user);
};
const User = model("User", userSchema, "users");
export { User, validateUpdateUser, };
//# sourceMappingURL=user.model.js.map