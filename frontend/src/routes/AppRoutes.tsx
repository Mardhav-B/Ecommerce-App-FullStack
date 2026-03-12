import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import ProfilePage from "../pages/ProfilePage";

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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
