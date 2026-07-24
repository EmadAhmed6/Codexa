import jwt from "jsonwebtoken";
import { Post } from "../modules/posts/post.model.js";
import { Comment } from "../modules/comment/comment.model.js";
const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    const secret = process.env.JWT_SECRET_KEY;
    if (typeof secret !== "string" || secret.length === 0) {
        return res.status(500).json({ message: "JWT secret is not configured" });
    }
    if (typeof token !== "string" || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        token = token.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
const verifyAuthorizedToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "You are not allowed" });
        }
    });
};
const verifyAdminToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (req.user.isAdmin) {
            next();
        }
        else {
            return res
                .status(403)
                .json({ message: "You are not allowed, only admin allowed" });
        }
    });
};
const verifyPostOwner = (req, res, next) => {
    verifyToken(req, res, async () => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post was not found" });
        }
        if (post.user?.toString() === req.user.id || req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "You are not allowed" });
        }
    });
};
const verifyCommentOwner = (req, res, next) => {
    verifyToken(req, res, async () => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment was not found" });
        }
        if (comment.user.toString() === req.user.id || req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json({ message: "You are not allowed" });
        }
    });
};
export { verifyToken, verifyAuthorizedToken, verifyAdminToken, verifyPostOwner, verifyCommentOwner, };
//# sourceMappingURL=verifyToken.js.map