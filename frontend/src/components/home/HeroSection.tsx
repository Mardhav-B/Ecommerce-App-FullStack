import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Sparkles, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fetchHeroBanners, type HeroBanner } from "../../services/api";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "../ui/skeleton";

export default function HeroCarousel() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHeroBanners().then(setBanners);
  }, []);

  if (!banners.length) {
    return (
      <div className="px-4 py-6 md:px-6">
        <div className="mx-auto h-[32rem] max-w-7xl overflow-hidden rounded-[2rem]">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <Carousel
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative min-h-[24rem] overflow-hidden rounded-[1.75rem] sm:min-h-[28rem] md:min-h-[34rem] md:rounded-[2rem]">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,22,17,0.86)_0%,rgba(31,22,17,0.46)_45%,rgba(31,22,17,0.12)_100%)]" />

                  <div className="relative flex min-h-[24rem] items-center px-4 py-10 sm:min-h-[28rem] sm:px-6 sm:py-12 md:min-h-[34rem] md:px-12">
                    <div className="max-w-2xl text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f5d7bc]">
                        Curated weekly picks
                      </p>
                      <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
                        {banner.title}
                      </h1>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-white/82 sm:mt-5 sm:text-base md:text-lg">
                        {banner.subtitle}
                      </p>

                      <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => navigate("/products")}
                          className="inline-flex items-center justify-center gap-2 rounded-[1.15rem] bg-biscuit px-5 py-3 text-sm font-semibold text-white transition hover:bg-biscuit-dark sm:px-6"
                        >
                          Shop collection
                          <ArrowRight className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/products?sort=newest")}
                          className="inline-flex items-center justify-center gap-2 rounded-[1.15rem] border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:px-6"
                        >
                          New arrivals
                          <Sparkles className="size-4" />
                        </button>
                      </div>

                      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
                        <div className="rounded-[1.15rem] bg-white/12 px-4 py-3 backdrop-blur">
                          <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <Truck className="size-4 text-[#f5d7bc]" />
                            Fast delivery
                          </div>
                          <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">
                            Smooth on mobile small, medium, and large screens.
                          </p>
                        </div>
                        <div className="rounded-[1.15rem] bg-white/12 px-4 py-3 backdrop-blur">
                          <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <BadgeCheck className="size-4 text-[#f5d7bc]" />
                            Quality picks
                          </div>
                          <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">
                            Handpicked products with a cleaner browsing flow.
                          </p>
                        </div>
                        <div className="rounded-[1.15rem] bg-white/12 px-4 py-3 backdrop-blur">
                          <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <Sparkles className="size-4 text-[#f5d7bc]" />
                            Fresh drops
                          </div>
                          <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">
                            Discover trending items without leaving the homepage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
