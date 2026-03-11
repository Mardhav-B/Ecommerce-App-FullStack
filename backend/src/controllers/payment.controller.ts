import { Request, Response } from "express";
import { createCheckoutSession } from "../services/payment.service";

export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const session = await createCheckoutSession(userId);

    res.json({
      url: session.url,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
