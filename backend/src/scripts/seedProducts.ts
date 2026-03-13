import axios from "axios";
import prisma from "../config/prisma";

async function seedDatabase() {
  try {
    console.log("Fetching products from DummyJSON...");

    const response = await axios.get(
      "https://dummyjson.com/products?limit=100",
    );

    const products = response.data.products;

    console.log(`Fetched ${products.length} products`);

    const categoryImages: Record<string, string> = {
      beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      fragrances:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f",
      groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e",
      furniture: "https://images.unsplash.com/photo-1505693314120-0d443867891c",

      smartphones:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      laptops: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",

      "mens-shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "mens-watches":
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",

      "mens-shirts":
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "mobile-accessories":
        "https://mate.net.in/public/uploads/all/UsReqZvujmEjMUb27qlTtRcCG8Pf18SyULO4HW7U.jpg",

      "kitchen-accessories":
        "https://images.unsplash.com/photo-1506368249639-73a05d6f6488",
      "home-decoration":
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    };

    const categoryMap: Record<string, string> = {};

    for (const product of products) {
      const categoryName = product.category;

      if (!categoryMap[categoryName]) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {
            imageUrl: categoryImages[categoryName] || null,
          },
          create: {
            name: categoryName,
            imageUrl: categoryImages[categoryName] || null,
          },
        });

        categoryMap[categoryName] = category.id;
      }
    }

    console.log("Categories seeded");

    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.heroBanner.deleteMany();
    await prisma.product.deleteMany();

    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.images?.[0] || product.thumbnail,
          images: Array.isArray(product.images)
            ? product.images.filter(Boolean).slice(0, 5)
            : product.thumbnail
              ? [product.thumbnail]
              : [],
          categoryId: categoryMap[product.category],
        },
      });
    }

    console.log("Products seeded");

    const heroBanners = [
      {
        title: "Latest Smartphones",
        subtitle: "Discover cutting-edge technology",
        imageUrl:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      },
      {
        title: "Luxury Watches",
        subtitle: "Timeless elegance",
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      },
      {
        title: "Upgrade Your Laptop",
        subtitle: "Performance meets design",
        imageUrl:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      },
    ];

    await prisma.heroBanner.createMany({
      data: heroBanners,
    });

    console.log("Hero banners seeded");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
