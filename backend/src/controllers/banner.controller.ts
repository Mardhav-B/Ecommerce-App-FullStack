import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getHeroBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch banners",
    });
  }
};
