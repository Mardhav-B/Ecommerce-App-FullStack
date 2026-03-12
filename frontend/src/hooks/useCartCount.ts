import { useMemo } from "react";

import { useCart } from "@/hooks/useCart";

export function useCartCount() {
  const cartQuery = useCart();

  const count = useMemo(
    () =>
      cartQuery.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cartQuery.data],
  );

  return {
    ...cartQuery,
    count,
  };
}
