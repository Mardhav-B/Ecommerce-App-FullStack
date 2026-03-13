import { memo } from "react";
import { Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WishlistItem } from "@/services/wishlist.api";

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (wishlistItemId: string) => void;
  onAddToCart: (wishlistItemId: string, productId: string) => void;
  disabled?: boolean;
}

function WishlistCardComponent({
  item,
  onRemove,
  onAddToCart,
  disabled = false,
}: WishlistCardProps) {
  return (
    <article className="rounded-xl border border-biscuit-light bg-white p-4 shadow-sm transition hover:shadow-lg">
      <img
        src={item.product.imageUrl || "https://placehold.co/320x320/f6ede4/8b6b50?text=Wishlist"}
        alt={item.product.name}
        className="h-52 w-full rounded-xl bg-white object-contain p-4"
      />

      <div className="mt-4">
        <h2 className="line-clamp-2 font-semibold text-slate-900">{item.product.name}</h2>
        <p className="mt-2 text-lg font-semibold text-biscuit-dark">
          ${item.product.price.toFixed(2)}
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <Button
          type="button"
          className="flex-1 bg-biscuit text-white hover:bg-biscuit-dark"
          onClick={() => onAddToCart(item.id, item.productId)}
          disabled={disabled}
        >
          <ShoppingCart className="size-4" />
          Add to Cart
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-biscuit text-biscuit-dark hover:bg-biscuit-light"
          onClick={() => onRemove(item.id)}
          disabled={disabled}
        >
          <Heart className="size-4 fill-current" />
        </Button>
      </div>
    </article>
  );
}

const WishlistCard = memo(WishlistCardComponent);

export default WishlistCard;
