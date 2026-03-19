import HeroCarousel from "@/components/home/HeroSection";
import Categories from "../components/home/Categories";
import FeaturedProducts from "@/components/home/FeatureProducts";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#f6ede4_100%)]">
      <HeroCarousel />
      <Categories />
      <FeaturedProducts />
      <Features />
      <Footer />
    </main>
  );
}
