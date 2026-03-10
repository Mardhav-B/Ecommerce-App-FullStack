import { Router } from "express";
import {
  fetchCart,
  addItemToCart,
  updateItem,
  deleteItem,
} from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, fetchCart);
router.post("/", authenticate, addItemToCart);
router.put("/:itemId", authenticate, updateItem);
router.delete("/:itemId", authenticate, deleteItem);

export default router;
