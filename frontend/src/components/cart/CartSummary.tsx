import { memo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  disabled?: boolean;
}

function CartSummaryComponent({
  subtotal,
  shipping,
  total,
  itemCount,
  disabled = false,
}: CartSummaryProps) {
  return (
    <aside className="rounded-xl border border-biscuit-light bg-white p-6 shadow-sm lg:sticky lg:top-28">
      <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>
      <p className="mt-1 text-sm text-slate-500">
        {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
      </p>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="border-t border-biscuit-light pt-4">
          <div className="flex items-center justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        asChild
        className="mt-6 h-12 w-full bg-biscuit text-white hover:bg-biscuit-dark"
        disabled={disabled}
      >
        <Link to="/checkout">Proceed to Checkout</Link>
      </Button>
    </aside>
  );
}

const CartSummary = memo(CartSummaryComponent);

export default CartSummary;
