import { useEffect, useState } from "react";
import { fetchHeroBanners, type HeroBanner } from "../../services/api";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "../ui/skeleton";

export default function HeroCarousel() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);

  useEffect(() => {
    fetchHeroBanners().then(setBanners);
  }, []);

  if (!banners.length) {
    return (
      <div className="h-105 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <section className="bg-[#f5f5f5] py-6">
      <div className="max-w-7xl mx-auto px-4">
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
                <div className="relative h-105 w-full overflow-hidden rounded-xl">
                  <img
                    src={banner.imageUrl}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 flex items-center">
                    <div className="pl-12 text-white">
                      <h1 className="text-5xl font-bold">{banner.title}</h1>

                      <p className="mt-3 text-lg">{banner.subtitle}</p>

                      <button className="mt-6 bg-[#E6B17E] px-6 py-3 rounded-lg">
                        Shop Now
                      </button>
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
