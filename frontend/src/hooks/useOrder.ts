import { useQuery } from "@tanstack/react-query";

import { fetchOrder } from "@/services/order.api";

export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId!),
    enabled: Boolean(orderId),
  });
}
