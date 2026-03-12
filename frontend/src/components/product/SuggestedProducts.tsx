import { memo } from "react";
import { Link } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/services/product.api";

interface SuggestedProductsProps {
  products: Product[];
  isLoading?: boolean;
}

function SuggestedProductsComponent({
  products,
  isLoading = false,
}: SuggestedProductsProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Suggested Items</h2>
      </div>

      <div className="flex snap-x gap-4 overflow-x-auto pb-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`suggested-skeleton-${index}`}
                className="min-w-[220px] flex-none rounded-2xl border border-biscuit-light bg-white p-4"
              >
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="mt-4 h-5 w-3/4 rounded" />
                <Skeleton className="mt-3 h-4 w-1/3 rounded" />
              </div>
            ))
          : products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="min-w-[220px] flex-none snap-start rounded-2xl border border-biscuit-light bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  loading="lazy"
                  className="h-44 w-full rounded-xl object-cover"
                />
                <h3 className="mt-4 line-clamp-2 font-medium text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-biscuit-dark">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
      </div>
    </section>
  );
}

const SuggestedProducts = memo(SuggestedProductsComponent);

export default SuggestedProducts;
