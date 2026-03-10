import { Router } from "express";
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  editProduct,
  removeProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", fetchProducts);
router.get("/:id", fetchProductById);

router.post("/", addProduct);
router.put("/:id", editProduct);
router.delete("/:id", removeProduct);

export default router;
