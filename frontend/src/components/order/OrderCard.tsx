import { memo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { OrderData } from "@/services/order.api";

interface OrderCardProps {
  order: OrderData;
}

function OrderCardComponent({ order }: OrderCardProps) {
  return (
    <article className="rounded-xl border border-biscuit-light bg-white p-5 shadow-sm transition hover:shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-biscuit-dark">
            Order ID
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{order.id}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="rounded-full bg-biscuit-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-biscuit-dark">
            {order.status}
          </span>
          <p className="text-lg font-semibold text-slate-900">
            ${order.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {order.items.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-biscuit-light bg-biscuit-light/20 p-3"
          >
            <Link to={`/products/${item.productId}`} className="shrink-0">
              <img
                src={
                  item.product.imageUrl ||
                  "https://placehold.co/160x160/f6ede4/8b6b50?text=Item"
                }
                alt={item.product.name}
                className="size-14 rounded-lg bg-white object-contain p-2"
              />
            </Link>
            <div className="min-w-0">
              <Link
                to={`/products/${item.productId}`}
                className="line-clamp-1 text-sm font-medium text-slate-900 hover:text-biscuit-dark"
              >
                {item.product.name}
              </Link>
              <p className="text-xs text-slate-500">Qty {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        asChild
        className="mt-5 bg-biscuit text-white hover:bg-biscuit-dark"
      >
        <Link to={`/orders/${order.id}`}>View Details</Link>
      </Button>
    </article>
  );
}

const OrderCard = memo(OrderCardComponent);

export default OrderCard;
