import { Router } from "express";
import { checkout } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/checkout", authenticate, checkout);
router.post("/create-checkout-session", authenticate, checkout);

export default router;
