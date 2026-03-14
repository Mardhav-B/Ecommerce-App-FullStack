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

router.patch("/addresses/:id", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { street, city, state, country, zipCode } = req.body;

    if (!street || !city || !state || !country || !zipCode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
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

    return res.json(address);
  } catch {
    return res.status(500).json({
      message: "Failed to update address",
    });
  }
});

router.delete("/addresses/:id", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return res.status(204).send();
  } catch {
    return res.status(500).json({
      message: "Failed to delete address",
    });
  }
});

export default router;
