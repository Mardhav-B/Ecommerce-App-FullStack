import { memo } from "react";

interface SummaryItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
}

interface OrderSummaryProps {
  items: SummaryItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

function OrderSummaryComponent({
  items,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <aside className="rounded-xl border border-biscuit-light bg-white p-6 shadow-sm lg:sticky lg:top-28">
      <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img
              src={item.product.imageUrl || "https://placehold.co/200x200/f6ede4/8b6b50?text=Item"}
              alt={item.product.name}
              className="size-16 rounded-xl border border-biscuit-light bg-white object-contain p-2"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-slate-900">
                {item.product.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Qty {item.quantity} x ${item.product.price.toFixed(2)}
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-biscuit-light pt-4 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
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
  );
}

const OrderSummary = memo(OrderSummaryComponent);

export default OrderSummary;
