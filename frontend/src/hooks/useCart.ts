import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchCart,
  removeCartItem,
  updateCartItem,
  type CartData,
} from "@/services/cart.api";

export function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<CartData>(["cart"]);

      queryClient.setQueryData<CartData>(["cart"], (currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        return {
          ...currentCart,
          items: currentCart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
        };
      });

      return { previousCart };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<CartData>(["cart"]);

      queryClient.setQueryData<CartData>(["cart"], (currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        return {
          ...currentCart,
          items: currentCart.items.filter((item) => item.id !== itemId),
        };
      });

      return { previousCart };
    },
    onError: (_error, _itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    ...cartQuery,
    updateQuantity: updateQuantityMutation.mutate,
    updateQuantityAsync: updateQuantityMutation.mutateAsync,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutate,
    removeItemAsync: removeItemMutation.mutateAsync,
    isRemovingItem: removeItemMutation.isPending,
  };
}
