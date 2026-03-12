import { useQuery } from "@tanstack/react-query";

import { fetchProduct } from "@/services/product.api";

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: Boolean(id),
  });
}
