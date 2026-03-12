import Navbar from "../components/navbar/Navbar";
import HeroCarousel from "@/components/home/HeroSection";
import Categories from "../components/home/Categories";
import FeaturedProducts from "@/components/home/FeatureProducts";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-biscuit-light">
      <Navbar />
      <HeroCarousel />
      <Categories />
      <FeaturedProducts />
      <Features />
      <Footer />
    </div>
  );
}
