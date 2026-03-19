import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import OrderCard from "@/components/order/OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";
import { fetchCart, removeCartItem, type CartData } from "@/services/cart.api";
import {
  getCheckoutSnapshot,
  isOrderMarkedPaid,
  markOrderAsPaid,
  type OrderData,
} from "@/services/order.api";

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const checkoutSnapshot = getCheckoutSnapshot();
  const isPaymentReturn = searchParams.get("payment") === "success";
  const requestedOrderId =
    searchParams.get("orderId") || checkoutSnapshot?.orderId || null;
  const shouldForcePaidStatus = Boolean(requestedOrderId) && isPaymentReturn;
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
        (shouldForcePaidStatus && requestedOrderId && order.id === requestedOrderId) ||
        isOrderMarkedPaid(order.id)
          ? { ...order, status: "PAID" }
          : order,
      ),
    [orders, requestedOrderId, shouldForcePaidStatus],
  );

  useEffect(() => {
    if (!shouldForcePaidStatus || !requestedOrderId) {
      return;
    }

    markOrderAsPaid(requestedOrderId);

    queryClient.setQueryData<OrderData[]>(["orders"], (currentOrders) =>
      currentOrders?.map((order) =>
        order.id === requestedOrderId ? { ...order, status: "PAID" } : order,
      ) ?? currentOrders,
    );

    queryClient.setQueryData<OrderData>(["order", requestedOrderId], (currentOrder) =>
      currentOrder ? { ...currentOrder, status: "PAID" } : currentOrder,
    );
  }, [queryClient, requestedOrderId, shouldForcePaidStatus]);

  useEffect(() => {
    if (
      !isPaymentReturn ||
      !checkoutSnapshot?.orderId ||
      checkoutSnapshot.mode === "buy_now" ||
      (requestedOrderId && checkoutSnapshot.orderId !== requestedOrderId)
    ) {
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
  }, [
    checkoutSnapshot?.mode,
    checkoutSnapshot?.orderId,
    isPaymentReturn,
    queryClient,
    requestedOrderId,
  ]);

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
            {highlightedOrder || requestedOrderId
              ? `Payment completed successfully. Order ${highlightedOrder?.id ?? requestedOrderId} is now confirmed.`
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
