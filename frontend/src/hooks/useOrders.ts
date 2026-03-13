import { useQuery } from "@tanstack/react-query";

import { fetchOrders } from "@/services/order.api";

interface UseOrdersOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useOrders(options: UseOrdersOptions = {}) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: options.enabled,
    refetchInterval: options.refetchInterval,
  });
}
