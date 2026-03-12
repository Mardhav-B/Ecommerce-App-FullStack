import prisma from "../config/prisma";
import stripe from "../config/stripe";

interface ItemWithProduct {
  product: {
    id?: string;
    name: string;
    price: number;
  };
  quantity: number;
}

function toStripeLineItems(items: ItemWithProduct[]) {
  return items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));
}

export const createCheckoutSession = async (userId: string, orderId?: string) => {
  let lineItems;

  if (orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order || order.items.length === 0) {
      throw new Error("Order not found or empty");
    }

    lineItems = toStripeLineItems(order.items as ItemWithProduct[]);
  } else {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    lineItems = toStripeLineItems(cart.items as ItemWithProduct[]);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: {
      userId,
      orderId: orderId || "",
    },
  });

  return session;
};
