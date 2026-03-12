import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import prisma from "../config/prisma";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/profile", authenticate, async (req, res) => {
  const user = (req as any).user; 

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      street: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
    },
  });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    addresses,
  });
});

export default router;
