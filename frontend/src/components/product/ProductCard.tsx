import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addToCart, type Product } from "@/services/product.api";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setFeedback(null);
  }, [product.id]);

  const cartMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) => addToCart(productId, 1),
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
    <article className="group rounded-xl border border-biscuit-light bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/products/${product.id}`}
        className="block overflow-hidden rounded-xl bg-biscuit-light"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="mt-4 space-y-2">
        <Link
          to={`/products/${product.id}`}
          className="line-clamp-2 font-medium text-slate-900"
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

        <Button
          type="button"
          className="mt-2 w-full bg-biscuit text-white hover:bg-biscuit-dark"
          onClick={() => cartMutation.mutate({ productId: product.id })}
          disabled={cartMutation.isPending}
        >
          <ShoppingCart className="size-4" />
          {cartMutation.isPending ? "Adding..." : "Add to Cart"}
        </Button>

        {feedback ? <p className="text-xs text-slate-500">{feedback}</p> : null}
      </div>
    </article>
  );
}

const ProductCard = memo(ProductCardComponent);

export default ProductCard;
