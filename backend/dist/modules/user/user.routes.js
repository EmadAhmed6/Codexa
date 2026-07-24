import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser, uploadUserPicture, } from "./user.controller.js";
import { verifyToken, verifyAuthorizedToken, verifyAdminToken, } from "../../middlewares/verifyToken.js";
import upload from "../../middlewares/multer.js";
const router = express.Router();
router.post("/:id/upload", verifyAuthorizedToken, upload.single("profilePicture"), uploadUserPicture);
router.route("/").get(verifyToken, getAllUsers);
router
    .route("/:id")
    .get(verifyToken, getUserById)
    .put(verifyAuthorizedToken, updateUser)
    .delete(verifyAdminToken, deleteUser);
export default router;
//# sourceMappingURL=user.routes.js.map