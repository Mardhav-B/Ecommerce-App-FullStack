import { Navigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import CartEmpty from "@/components/cart/CartEmpty";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { useOrder } from "@/hooks/useOrder";
import type { ShippingFormValues } from "@/services/checkout.api";

function getOrderTotals(items: Array<{ quantity: number; product: { price: number } }>) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = subtotal * 0.08;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const directOrderId = searchParams.get("orderId") ?? undefined;
  const { data: user } = useAuth();
  const { data, isLoading, isError, error } = useCart();
  const directOrderQuery = useOrder(directOrderId);
  const checkoutMutation = useCheckout();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const directItems =
    directOrderQuery.data?.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product,
    })) ?? [];
  const items = directOrderId ? directItems : data?.items ?? [];
  const totals = getOrderTotals(items);

  if (!localStorage.getItem("accessToken")) {
    return <Navigate to="/auth" replace />;
  }

  const handleCheckout = async (values: ShippingFormValues) => {
    try {
      setCheckoutError(null);
      const result = await checkoutMutation.mutateAsync({
        values,
        orderId: directOrderId,
        mode: directOrderId ? "buy_now" : "cart",
      });
      window.location.href = result.session.url;
    } catch (checkoutFailure) {
      setCheckoutError(
        checkoutFailure instanceof Error
          ? checkoutFailure.message
          : "Unable to start checkout.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#fff_24%)] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-biscuit-dark">
            Checkout
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Confirm shipping and continue to payment.
          </h1>
        </div>

        {isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error instanceof Error ? error.message : "Unable to load checkout."}
          </div>
        ) : null}

        {isLoading || (directOrderId ? directOrderQuery.isLoading : false) ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Skeleton className="h-[34rem] rounded-xl" />
            <Skeleton className="h-[28rem] rounded-xl" />
          </div>
        ) : isError || (directOrderId ? directOrderQuery.isError : false) ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : directOrderQuery.error instanceof Error
                ? directOrderQuery.error.message
                : "Unable to load checkout."}
          </div>
        ) : items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <CheckoutForm
              defaultValues={{
                name: user?.name ?? "",
                email: user?.email ?? "",
                country: "India",
              }}
              savedAddresses={user?.addresses ?? []}
              onSubmit={(values) => {
                void handleCheckout(values);
              }}
              isSubmitting={checkoutMutation.isPending}
            />

            {checkoutError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 lg:hidden">
                {checkoutError}
              </div>
            ) : null}

            <OrderSummary
              items={items}
              subtotal={totals.subtotal}
              shipping={totals.shipping}
              tax={totals.tax}
              total={totals.total}
            />
          </div>
        )}

        {checkoutError ? (
          <div className="mt-6 hidden rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 lg:block">
            {checkoutError}
          </div>
        ) : null}
      </div>
    </main>
  );
}
