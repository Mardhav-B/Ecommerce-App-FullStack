import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import OrderCard from "@/components/order/OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";
import { fetchCart, removeCartItem, type CartData } from "@/services/cart.api";
import type { OrderData } from "@/services/order.api";

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const isPaymentReturn = searchParams.get("payment") === "success";
  const requestedOrderId = searchParams.get("orderId");
  const { data: orders = [], isLoading, isError, error } = useOrders({
    refetchInterval: isPaymentReturn ? 2500 : false,
  });
  const highlightedOrder = useMemo(
    () => (requestedOrderId ? orders.find((order) => order.id === requestedOrderId) : null),
    [orders, requestedOrderId],
  );
  const displayOrders = useMemo(
    () =>
      orders.map((order) =>
        isPaymentReturn && requestedOrderId && order.id === requestedOrderId
          ? { ...order, status: "PAID" }
          : order,
      ),
    [isPaymentReturn, orders, requestedOrderId],
  );

  useEffect(() => {
    if (!isPaymentReturn || !requestedOrderId) {
      return;
    }

    queryClient.setQueryData<OrderData[]>(["orders"], (currentOrders) =>
      currentOrders?.map((order) =>
        order.id === requestedOrderId ? { ...order, status: "PAID" } : order,
      ) ?? currentOrders,
    );

    queryClient.setQueryData<OrderData>(["order", requestedOrderId], (currentOrder) =>
      currentOrder ? { ...currentOrder, status: "PAID" } : currentOrder,
    );
  }, [isPaymentReturn, queryClient, requestedOrderId]);

  useEffect(() => {
    if (!isPaymentReturn) {
      return;
    }

    let cancelled = false;

    const clearCartAfterPayment = async () => {
      try {
        const cart = await fetchCart();

        if (!cart.items.length) {
          if (!cancelled) {
            queryClient.setQueryData<CartData>(["cart"], {
              id: cart.id,
              items: [],
            });
          }
          return;
        }

        await Promise.all(
          cart.items.map((item) =>
            removeCartItem(item.id).catch(() => item.id),
          ),
        );

        if (!cancelled) {
          queryClient.setQueryData<CartData>(["cart"], {
            id: cart.id,
            items: [],
          });
          void queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
      } catch {
        return;
      }
    };

    void clearCartAfterPayment();

    return () => {
      cancelled = true;
    };
  }, [isPaymentReturn, queryClient]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#fff_28%)] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-biscuit-dark">
            Orders
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Review your order history.
          </h1>
        </div>

        {isPaymentReturn ? (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-800">
            {highlightedOrder
              ? `Payment completed successfully. Order ${highlightedOrder.id} is now confirmed.`
              : "Payment completed. Your latest order is syncing and will update here shortly."}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error instanceof Error ? error.message : "Unable to load orders."}
          </div>
        ) : null}

        <div className="space-y-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-56 rounded-xl" />
              ))
            : displayOrders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      </div>
    </main>
  );
}
