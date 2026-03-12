import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fetchHeroBanners, type HeroBanner } from "../../services/api";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "../ui/skeleton";

export default function HeroCarousel() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHeroBanners().then(setBanners);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

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
                <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem]">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,22,17,0.86)_0%,rgba(31,22,17,0.46)_45%,rgba(31,22,17,0.12)_100%)]" />

                  <div className="relative flex min-h-[34rem] items-center px-6 py-12 md:px-12">
                    <div className="max-w-2xl text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f5d7bc]">
                        Curated weekly picks
                      </p>
                      <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
                        {banner.title}
                      </h1>
                      <p className="mt-5 max-w-xl text-base leading-7 text-white/82 md:text-lg">
                        {banner.subtitle}
                      </p>

                      <form
                        onSubmit={handleSearch}
                        className="mt-8 flex max-w-xl flex-col gap-3 rounded-[1.5rem] bg-white/14 p-3 backdrop-blur-md md:flex-row"
                      >
                        <div className="flex flex-1 items-center gap-3 rounded-[1.2rem] bg-white px-4">
                          <Search className="size-4 text-slate-400" />
                          <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search what you need today"
                            className="h-12 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                          />
                        </div>
                        <button className="rounded-[1.2rem] bg-biscuit px-6 py-3 text-sm font-semibold text-white transition hover:bg-biscuit-dark">
                          Shop now
                        </button>
                      </form>
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
