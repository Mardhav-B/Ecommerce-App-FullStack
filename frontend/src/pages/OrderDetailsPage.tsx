import { useMutation } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import OrderItem from "@/components/order/OrderItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useOrder } from "@/hooks/useOrder";
import { createOrder } from "@/services/checkout.api";
import { getCheckoutSnapshot, isOrderMarkedPaid } from "@/services/order.api";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrder(id);
  const { data: user } = useAuth();
  const snapshot = getCheckoutSnapshot();
  const displayStatus =
    (snapshot?.orderId === order?.id && snapshot?.status) || isOrderMarkedPaid(order?.id)
      ? "PAID"
      : order?.status ?? "PENDING";
  const shipping =
    snapshot && snapshot.orderId === order?.id
      ? snapshot.shipping
      : undefined;
  const fallbackAddress = user?.addresses?.[0];
  const reorderMutation = useMutation({
    mutationFn: () =>
      createOrder(
        order?.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })) ?? [],
      ),
    onSuccess: (nextOrder) => {
      navigate(`/checkout?orderId=${encodeURIComponent(nextOrder.id)}`);
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-10 md:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen px-4 py-10 md:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error instanceof Error ? error.message : "Unable to load order details."}
        </div>
      </main>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#fff_28%)] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-biscuit-light bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-biscuit-dark">
              Order ID
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">{order.id}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <span className="rounded-full bg-biscuit-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-biscuit-dark">
              {displayStatus}
            </span>
            <div className="flex gap-3">
              <Button className="bg-biscuit text-white hover:bg-biscuit-dark">
                <Truck className="size-4" />
                Track Order
              </Button>
              <Button
                variant="outline"
                className="border-biscuit text-biscuit-dark hover:bg-biscuit-light"
                onClick={() => reorderMutation.mutate()}
                disabled={reorderMutation.isPending}
              >
                {reorderMutation.isPending ? "Preparing..." : "Reorder"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            <div className="rounded-2xl border border-biscuit-light bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Shipping Address</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {shipping ? (
                  <>
                    {shipping.name}
                    <br />
                    {shipping.address}
                    <br />
                    {shipping.city}, {shipping.state}, {shipping.country} - {shipping.zipCode}
                  </>
                ) : fallbackAddress ? (
                  <>
                    {fallbackAddress.street}
                    <br />
                    {fallbackAddress.city}, {fallbackAddress.state}, {fallbackAddress.country} - {fallbackAddress.zipCode}
                  </>
                ) : (
                  "Shipping address will appear here after checkout."
                )}
              </p>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-biscuit-light bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-biscuit-light pt-3 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
