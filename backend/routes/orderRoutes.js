import express from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/seller", protect, authorize("seller", "admin"), getSellerOrders);
router.put("/:id/status", protect, authorize("seller", "admin"), updateOrderStatus);

export default router;
