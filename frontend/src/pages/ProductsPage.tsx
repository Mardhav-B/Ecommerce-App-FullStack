import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductFilters, {
  type FilterState,
} from "@/components/product/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/services/product.api";

const defaultFilters: FilterState = {
  categories: [],
  minPrice: 0,
  maxPrice: 1000,
  search: "",
  sort: "newest",
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: searchParams.get("category")?.split(",").filter(Boolean) ?? [],
    minPrice: Number(searchParams.get("minPrice") ?? defaultFilters.minPrice),
    maxPrice: Number(searchParams.get("maxPrice") ?? defaultFilters.maxPrice),
    search: searchParams.get("search") ?? "",
    sort: (searchParams.get("sort") as FilterState["sort"]) ?? defaultFilters.sort,
  }));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useProducts({
    category: filters.categories,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    search: filters.search,
    sort: filters.sort,
    limit: 12,
  });

  const products = useMemo<Product[]>(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  useEffect(() => {
    setFilters({
      categories: searchParams.get("category")?.split(",").filter(Boolean) ?? [],
      minPrice: Number(searchParams.get("minPrice") ?? defaultFilters.minPrice),
      maxPrice: Number(searchParams.get("maxPrice") ?? defaultFilters.maxPrice),
      search: searchParams.get("search") ?? "",
      sort:
        (searchParams.get("sort") as FilterState["sort"]) ?? defaultFilters.sort,
    });
  }, [searchParams]);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams();

    if (filters.categories.length) {
      nextSearchParams.set("category", filters.categories.join(","));
    }
    if (filters.minPrice !== defaultFilters.minPrice) {
      nextSearchParams.set("minPrice", String(filters.minPrice));
    }
    if (filters.maxPrice !== defaultFilters.maxPrice) {
      nextSearchParams.set("maxPrice", String(filters.maxPrice));
    }
    if (filters.search.trim()) {
      nextSearchParams.set("search", filters.search.trim());
    }
    if (filters.sort !== defaultFilters.sort) {
      nextSearchParams.set("sort", filters.sort);
    }

    setSearchParams(nextSearchParams, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fdf8f3_0%,#fff_22%)] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-biscuit-dark">
            Product Listing
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Discover curated essentials for every corner of your routine.
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductFilters value={filters} onChange={setFilters} />
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {products.length} product{products.length === 1 ? "" : "s"} loaded
              </p>
            </div>

            {isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error instanceof Error ? error.message : "Unable to load products."}
              </div>
            ) : null}

            <ProductGrid products={products} isLoading={isLoading} skeletonCount={8} />

            {!isLoading && products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-biscuit-light bg-white p-10 text-center text-slate-500">
                No products match the selected filters.
              </div>
            ) : null}

            <div ref={sentinelRef} className="h-10 w-full" />

            {isFetchingNextPage ? (
              <ProductGrid products={[]} isLoading skeletonCount={4} />
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
