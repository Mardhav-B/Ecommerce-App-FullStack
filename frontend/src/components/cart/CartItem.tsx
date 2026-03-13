import { memo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CartItem as CartItemType } from "@/services/cart.api";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  disabled?: boolean;
}

function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
  disabled = false,
}: CartItemProps) {
  const subtotal = item.product.price * item.quantity;

  return (
    <article className="rounded-xl border border-biscuit-light bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="overflow-hidden rounded-xl bg-biscuit-light sm:w-32">
          <img
            src={item.product.imageUrl || "https://placehold.co/400x400/f6ede4/8b6b50?text=Product"}
            alt={item.product.name}
            className="h-32 w-full object-contain bg-white p-3"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.product.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                ${item.product.price.toFixed(2)} each
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={disabled}
              className="inline-flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              Remove
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center rounded-full border border-biscuit-light bg-biscuit-light/50 p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                disabled={disabled || item.quantity <= 1}
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-10 text-center text-sm font-semibold">
                {item.quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                disabled={disabled}
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <p className="text-base font-semibold text-biscuit-dark">
              ${subtotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

const CartItem = memo(CartItemComponent);

export default CartItem;
