import { memo } from "react";

interface CartBadgeProps {
  count: number;
}

function CartBadgeComponent({ count }: CartBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-biscuit px-1.5 py-0.5 text-[11px] font-semibold text-white">
      {count}
    </span>
  );
}

const CartBadge = memo(CartBadgeComponent);

export default CartBadge;
