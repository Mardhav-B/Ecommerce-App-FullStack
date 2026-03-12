import { useProducts } from "../../hooks/useProducts";
import { Skeleton } from "../ui/skeleton";
import type { Product } from "../../services/api";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useProducts();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border border-biscuit-light rounded-lg p-4 animate-pulse"
                >
                  <Skeleton className="h-36 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-full mt-3" />
                </div>
              ))
            : (products as Product[]).slice(0, 10).map((product: Product) => (
                <div
                  key={product.id}
                  className="border border-biscuit-light rounded-lg p-4 hover:shadow-lg transition-transform duration-200"
                >
                  <img
                    src={product.imageUrl}
                    className="h-36 w-full object-contain"
                  />

                  <h3 className="mt-3 text-sm font-medium">{product.name}</h3>

                  <p className="text-biscuit font-bold mt-1">
                    ${product.price}
                  </p>

                  <button className="mt-3 w-full bg-biscuit hover:bg-biscuit-dark text-white py-2 rounded-md transition-colors">
                    Add to Cart
                  </button>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
