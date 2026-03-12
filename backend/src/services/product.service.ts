import prisma from "../config/prisma";

interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: string;
}

interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
}

export const getProducts = async (
  search?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
    : {};

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.product.count({ where });

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const createProduct = async (data: ProductCreateInput) => {
  return prisma.product.create({ data });
};

export const updateProduct = async (id: string, data: ProductUpdateInput) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
