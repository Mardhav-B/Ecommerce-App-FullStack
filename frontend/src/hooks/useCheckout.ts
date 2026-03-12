import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCheckoutSession,
  createOrder,
  type ShippingFormValues,
} from "@/services/checkout.api";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_values: ShippingFormValues) => {
      const order = await createOrder();
      const session = await createCheckoutSession(order.id);
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
