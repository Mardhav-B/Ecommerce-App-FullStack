import { Request, Response } from "express";
import stripe from "../config/stripe";
import prisma from "../config/prisma";

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: {
    price: number;
  };
}

export const stripeWebhook = async (req: Request, res: Response) => {
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart) return res.json({ received: true });

    let totalPrice = 0;

    const items = cart.items.map((item: CartItemWithProduct) => {
      totalPrice += item.product.price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "PAID",
        items: { create: items },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  res.json({ received: true });
};
