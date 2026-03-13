import { Request, Response } from "express";
import Stripe from "stripe";
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
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata;
    if (!metadata) {
      console.log("No metadata in session");
      return res.status(400).json({ error: "No metadata" });
    }

    const userId = metadata.userId;
    const orderId = metadata.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return res.json({ received: true });
    }

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
