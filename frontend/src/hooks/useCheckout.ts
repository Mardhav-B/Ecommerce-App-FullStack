import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCheckoutSession,
  createOrder,
  type ShippingFormValues,
} from "@/services/checkout.api";
import { saveCheckoutSnapshot, type OrderData } from "@/services/order.api";

interface CheckoutMutationInput {
  values: ShippingFormValues;
  orderId?: string;
  mode?: "cart" | "buy_now";
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ values, orderId, mode = "cart" }: CheckoutMutationInput) => {
      let order: OrderData;

      if (orderId) {
        order = {
          id: orderId,
          totalPrice: 0,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          items: [],
        };
      } else {
        order = (await createOrder()) as OrderData;
      }

      saveCheckoutSnapshot(order, values, mode);
      const session = await createCheckoutSession(order.id);
      return { session, order };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
