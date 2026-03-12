import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getCheckoutSnapshot } from "@/services/order.api";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const snapshot = getCheckoutSnapshot();
  const orderId = searchParams.get("orderId") || snapshot?.orderId || "Pending";
  const totalPaid = snapshot?.totalPrice ?? 0;
  const paymentStatus = snapshot?.status ?? "PAID";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6fff4_0%,#fff_28%)] px-4 py-12 md:px-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-green-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="size-10" />
        </div>

        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
          Payment completed successfully. Your order has been confirmed.
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
            <p className="mt-2 text-sm font-medium text-green-700">{paymentStatus}</p>
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
