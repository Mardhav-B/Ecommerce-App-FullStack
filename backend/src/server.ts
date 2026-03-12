import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import categoryRoutes from "./routes/category.routes";
import bannerRoutes from "./routes/banner.routes";

dotenv.config();

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://ecommerce-app-full-stack-lemon.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

      callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);

app.get("/", (req, res) => {
  res.send("Ecommerce API running");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
