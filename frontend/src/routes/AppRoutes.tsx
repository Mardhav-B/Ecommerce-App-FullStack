import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import ProfilePage from "../pages/ProfilePage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import WishlistPage from "../pages/WishlistPage";
import RequireAuth from "./RequireAuth";

const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("../pages/ProductDetailsPage"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
          <Route path="/orders/:id" element={<RequireAuth><OrderDetailsPage /></RequireAuth>} />
          <Route path="/wishlist" element={<RequireAuth><WishlistPage /></RequireAuth>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
