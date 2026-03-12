import { useQuery } from "@tanstack/react-query";

import { fetchOrders } from "@/services/order.api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}
