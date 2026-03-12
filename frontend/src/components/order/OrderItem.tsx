import { memo } from "react";

import type { OrderItemData } from "@/services/order.api";

interface OrderItemProps {
  item: OrderItemData;
}

function OrderItemComponent({ item }: OrderItemProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-biscuit-light bg-white p-4 shadow-sm">
      <img
        src={item.product.imageUrl || "https://placehold.co/240x240/f6ede4/8b6b50?text=Item"}
        alt={item.product.name}
        loading="lazy"
        className="size-20 rounded-xl border border-biscuit-light bg-white object-contain p-2"
      />

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-medium text-slate-900">{item.product.name}</h3>
        <p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</p>
        <p className="mt-2 text-sm font-semibold text-biscuit-dark">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

const OrderItem = memo(OrderItemComponent);

export default OrderItem;
