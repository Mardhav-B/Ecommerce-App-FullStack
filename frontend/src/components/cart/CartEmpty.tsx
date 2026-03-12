import { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

function CartEmptyComponent() {
  return (
    <div className="rounded-2xl border border-dashed border-biscuit-light bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-biscuit-light text-biscuit-dark">
        <ShoppingBag className="size-7" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-slate-900">
        Your cart is empty
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Add a few items to your cart and come back here to review your order.
      </p>
      <Button
        asChild
        className="mt-6 bg-biscuit text-white hover:bg-biscuit-dark"
      >
        <Link to="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}

const CartEmpty = memo(CartEmptyComponent);

export default CartEmpty;
