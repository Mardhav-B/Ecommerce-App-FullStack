import { Router } from "express";
import {
  placeOrder,
  fetchOrders,
  fetchOrderById,
} from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, placeOrder);
router.get("/", authenticate, fetchOrders);
router.get("/:id", authenticate, fetchOrderById);

export default router;
