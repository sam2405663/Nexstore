import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", optionalProtect, createProduct);
router.put("/:id", optionalProtect, updateProduct);
router.delete("/:id", optionalProtect, deleteProduct);

export default router;