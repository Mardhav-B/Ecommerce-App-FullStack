import prisma from "../config/prisma";

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: {
    price: number;
  };
}

interface DirectOrderItemInput {
  productId: string;
  quantity: number;
}

export const createOrder = async (
  userId: string,
  directItems?: DirectOrderItemInput[],
) => {
  if (directItems?.length) {
    const productIds = Array.from(new Set(directItems.map((item) => item.productId)));
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products could not be found");
    }

    let totalPrice = 0;

    const orderItems = directItems.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      totalPrice += product.price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    return prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "PENDING",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

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

  const orderItems = cart.items.map((item: CartItemWithProduct) => {
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
      items: {
        include: {
          product: true,
        },
      },
    },
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
