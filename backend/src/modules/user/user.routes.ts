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
  verifySuperAdminToken,
} from "../../middlewares/verifyToken.js";
import upload from "../../middlewares/multer.js";
const router = express.Router();

router.route("/").get(verifyToken, getAllUsers);
router.patch("/:id/toggle-admin", verifySuperAdminToken, toggleAdminStatus);
router
  .route("/:id")
  .get(verifyToken, getUserById)
  .put(verifyAuthorizedToken, upload.single("profilePicture"), updateUser)
  .delete(verifyAuthorizedToken, deleteUser);

export default router;
