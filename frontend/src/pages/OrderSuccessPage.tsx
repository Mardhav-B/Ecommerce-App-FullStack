import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import {
  clearCheckoutSnapshot,
  getCheckoutSnapshot,
  type OrderData,
} from "@/services/order.api";
import type { CartData } from "@/services/cart.api";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const snapshot = getCheckoutSnapshot();
  const requestedOrderId = searchParams.get("orderId") || snapshot?.orderId;
  const initiatedAt = snapshot?.initiatedAt
    ? new Date(snapshot.initiatedAt).getTime()
    : null;
  const hasToken = Boolean(localStorage.getItem("accessToken"));
  const { data: orders = [] } = useOrders({
    enabled: hasToken,
    refetchInterval: 2500,
  });

  const resolvedOrder = useMemo<OrderData | null>(() => {
    if (requestedOrderId) {
      return orders.find((order) => order.id === requestedOrderId) ?? null;
    }

    if (!initiatedAt) {
      return null;
    }

    return (
      [...orders]
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        )
        .find(
          (order) => new Date(order.createdAt).getTime() >= initiatedAt - 60_000,
        ) ?? null
    );
  }, [initiatedAt, orders, requestedOrderId]);

  const orderId = resolvedOrder?.id || requestedOrderId || "Processing";
  const totalPaid = resolvedOrder?.totalPrice ?? snapshot?.totalPrice ?? 0;
  const paymentStatus = resolvedOrder?.status ?? snapshot?.status ?? "PROCESSING";
  const isPaid = paymentStatus === "PAID";

  useEffect(() => {
    queryClient.setQueryData<CartData>(["cart"], { id: null, items: [] });
  }, [queryClient]);

  useEffect(() => {
    if (!isPaid) {
      return;
    }

    const timer = window.setTimeout(() => {
      clearCheckoutSnapshot();
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/orders", { replace: true });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [isPaid, navigate, queryClient]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6fff4_0%,#fff_28%)] px-4 py-12 md:px-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-green-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="size-10" />
        </div>

        <div
          className={`mt-6 rounded-2xl border p-4 ${
            isPaid
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {isPaid
            ? "Payment completed successfully. Redirecting you to your orders."
            : "Payment received. Finalizing your order and syncing the latest status."}
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Order Success</h1>
        <p className="mt-3 text-sm text-slate-500">
          Thank you for shopping with ShopSphere.
        </p>

        <div className="mt-8 grid gap-4 rounded-2xl border border-biscuit-light bg-biscuit-light/25 p-5 text-left sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Order ID
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">{orderId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Total Paid
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              ${totalPaid.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Payment Status
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium">
              {!isPaid ? <LoaderCircle className="size-4 animate-spin text-amber-600" /> : null}
              <p className={isPaid ? "text-green-700" : "text-amber-700"}>
                {paymentStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-biscuit text-white hover:bg-biscuit-dark">
            <Link to="/products">Continue Shopping</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-biscuit text-biscuit-dark hover:bg-biscuit-light"
          >
            <Link to="/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
