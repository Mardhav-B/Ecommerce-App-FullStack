import { useInfiniteQuery } from "@tanstack/react-query";

import {
  fetchProducts,
  type ProductFilters,
  type ProductsResponse,
} from "@/services/product.api";

interface UseProductsOptions extends ProductFilters {
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ["products", options],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchProducts({
        ...options,
        page: Number(pageParam),
        limit: options.limit ?? 12,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
