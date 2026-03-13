import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCheckoutSession,
  createOrder,
  type ShippingFormValues,
} from "@/services/checkout.api";
import { saveCheckoutSnapshot, type OrderData } from "@/services/order.api";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ShippingFormValues) => {
      const order = (await createOrder()) as OrderData;
      saveCheckoutSnapshot(order, values);
      const session = await createCheckoutSession(order.id);
      return { session, order };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
