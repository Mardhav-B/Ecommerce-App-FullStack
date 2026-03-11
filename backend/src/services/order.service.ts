import prisma from "../config/prisma";

export const createOrder = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalPrice = 0;

  const orderItems = cart.items.map((item) => {
    totalPrice += item.product.price * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    };
  });

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      status: "PENDING",
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return order;
};

export const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrderById = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};
