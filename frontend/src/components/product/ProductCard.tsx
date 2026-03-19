import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addToCart, type Product } from "@/services/product.api";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
  lazyImage?: boolean;
}

function ProductCardComponent({
  product,
  lazyImage = true,
}: ProductCardProps) {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isWishlisted, requiresAuth } = useWishlist();

  const wishlisted = isWishlisted(product.id);
  const maxQuantity = Math.max(1, product.stock || 99);

  const cartMutation = useMutation({
    mutationFn: ({
      productId,
      quantity: nextQuantity,
    }: {
      productId: string;
      quantity: number;
    }) => addToCart(productId, nextQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setFeedback("Added to cart");
      window.setTimeout(() => setFeedback(null), 2000);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : "Unable to add item");
    },
  });

  return (
    <article className="group flex h-full flex-col rounded-xl border border-biscuit-light bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => {
            const updated = toggleWishlist(product);

            if (!updated && requiresAuth) {
              setFeedback("Please sign in to save items to your wishlist.");
            }
          }}
          className={`inline-flex size-9 items-center justify-center rounded-full border transition ${
            wishlisted
              ? "border-biscuit bg-biscuit-light text-biscuit-dark"
              : "border-biscuit-light text-slate-500 hover:border-biscuit hover:text-biscuit-dark"
          }`}
        >
          <Heart className={`size-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      <Link
        to={`/products/${product.id}`}
        className="block overflow-hidden rounded-xl bg-white"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading={lazyImage ? "lazy" : "eager"}
          decoding="async"
          className="aspect-square h-44 w-full bg-white object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Link
          to={`/products/${product.id}`}
          className="line-clamp-2 min-h-10 font-medium text-slate-900"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold text-biscuit-dark">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-1 text-sm text-amber-500">
            <Star className="size-4 fill-current" />
            <span className="font-medium text-slate-700">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-xl border border-biscuit-light bg-biscuit-light/20 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Qty
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className={`rounded-full p-1.5 text-slate-700 transition hover:bg-white ${
                quantity <= 1 ? "opacity-30" : ""
              }`}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(maxQuantity, current + 1))
              }
              className={`rounded-full p-1.5 text-slate-700 transition hover:bg-white ${
                quantity >= maxQuantity ? "opacity-30" : ""
              }`}
              disabled={quantity >= maxQuantity}
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-auto space-y-2 pt-2">
          <Button
            type="button"
            className="w-full bg-biscuit text-white hover:bg-biscuit-dark"
            onClick={() =>
              cartMutation.mutate({
                productId: product.id,
                quantity,
              })
            }
            disabled={cartMutation.isPending}
          >
            <ShoppingCart className="size-4" />
            {cartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>

          {feedback ? (
            <p className="text-xs text-slate-500">{feedback}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const ProductCard = memo(ProductCardComponent);

export default ProductCard;
