import axios from "axios";
import prisma from "../config/prisma";

async function seedProducts() {
  try {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=100",
    );

    const products = response.data.products;

    console.log(`Fetched ${products.length} products`);

    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.thumbnail,
        },
      });
    }

    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
