import OrderCard from "@/components/order/OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useOrders();

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
            : orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      </div>
    </main>
  );
}
