import { Router } from "express";
import { checkout } from "../controllers/payment.controller";
import { stripeWebhook } from "../controllers/webhook.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/checkout", authenticate, checkout);
router.post("/webhook", stripeWebhook);

export default router;
