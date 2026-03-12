import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import ProductCard from "./ProductCard";
import type { Product } from "@/services/product.api";

export default function ProductCarousel({
  products,
}: {
  products?: Product[];
}) {
  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Carousel>
        <CarouselContent>
          {products.map((product: Product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
