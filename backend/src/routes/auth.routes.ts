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

router.post("/addresses", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const { street, city, state, country, zipCode } = req.body;

    if (!street || !city || !state || !country || !zipCode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        street,
        city,
        state,
        country,
        zipCode,
      },
      select: {
        id: true,
        street: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
      },
    });

    return res.status(201).json(address);
  } catch {
    return res.status(500).json({
      message: "Failed to save address",
    });
  }
});

export default router;
