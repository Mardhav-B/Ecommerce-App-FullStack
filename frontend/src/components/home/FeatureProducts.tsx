import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../product/ProductCard";
import { Skeleton } from "../ui/skeleton";

export default function FeaturedProducts() {
  const { data, isLoading } = useProducts({ limit: 8 });
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products).slice(0, 8) ?? [],
    [data],
  );

  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-biscuit-dark">
              Featured Products
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
              New arrivals with a softer, more premium storefront.
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-biscuit-dark"
          >
            Shop all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-biscuit-light bg-white p-4"
                >
                  <Skeleton className="h-44 w-full rounded-xl" />
                  <Skeleton className="mt-4 h-5 w-3/4 rounded" />
                  <Skeleton className="mt-3 h-4 w-1/2 rounded" />
                  <Skeleton className="mt-4 h-9 w-full rounded-lg" />
                </div>
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
