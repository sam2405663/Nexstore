import express from "express";
import { getAdminStats, getUsers, updateUserRole, deleteUser, approveUser } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/approve", approveUser);
router.delete("/users/:id", deleteUser);

export default router;
