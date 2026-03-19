import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  profile,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/profile", authenticate, profile);
router.post("/addresses", authenticate, createAddress);
router.patch("/addresses/:id", authenticate, updateAddress);
router.delete("/addresses/:id", authenticate, deleteAddress);

export default router;
