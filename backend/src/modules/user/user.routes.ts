import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleAdminStatus,
} from "./user.controller.js";
import {
  verifyToken,
  verifyAuthorizedToken,
  verifyAdminToken,
} from "../../middlewares/verifyToken.js";
import upload from "../../middlewares/multer.js";
const router = express.Router();

router.route("/").get(verifyToken, getAllUsers);
router
  .route("/:id")
  .get(verifyToken, getUserById)
  .put(verifyAuthorizedToken, upload.single("profilePicture"), updateUser)
  .delete(verifyAuthorizedToken, deleteUser)
  .patch(verifyAdminToken, toggleAdminStatus);

export default router;
