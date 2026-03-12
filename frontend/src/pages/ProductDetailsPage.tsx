import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag, ShoppingCart, Star } from "lucide-react";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import SuggestedProducts from "@/components/product/SuggestedProducts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useProduct";
import { useProducts } from "@/hooks/useProducts";
import { addToCart } from "@/services/product.api";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: product, isLoading, isError, error } = useProduct(id);

  const relatedProductsQuery = useProducts({
    category: product?.categoryId ? [product.categoryId] : undefined,
    limit: 12,
  });

  const relatedProducts = useMemo(
    () =>
      (relatedProductsQuery.data?.pages.flatMap((page) => page.products) ?? [])
        .filter((item) => item.id !== product?.id)
        .slice(0, 8),
    [product?.id, relatedProductsQuery.data],
  );

  const cartMutation = useMutation({
    mutationFn: (nextQuantity: number) => addToCart(product!.id, nextQuantity),
    onSuccess: () => {
      setFeedback("Added to cart");
      window.setTimeout(() => setFeedback(null), 2000);
    },
    onError: (mutationError) => {
      setFeedback(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to add item to cart",
      );
    },
  });

  const sizes = product?.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];

  useEffect(() => {
    setQuantity(1);
    setSelectedSize(null);
    setFeedback(null);
  }, [product?.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fdf8f3_0%,#fff_22%)] px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3 rounded" />
            <Skeleton className="h-10 w-3/4 rounded" />
            <Skeleton className="h-6 w-1/4 rounded" />
            <Skeleton className="h-24 w-full rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error instanceof Error ? error.message : "Product not found."}
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (sizes.length && !selectedSize) {
      setFeedback("Select a size before adding this item.");
      return;
    }

    cartMutation.mutate(quantity);
  };

  const handleBuyNow = async () => {
    if (sizes.length && !selectedSize) {
      setFeedback("Select a size before continuing.");
      return;
    }

    try {
      await cartMutation.mutateAsync(quantity);
      navigate("/profile");
    } catch {
      return;
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fdf8f3_0%,#fff_22%)] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-14">
        <div className="mb-2 text-sm text-slate-500">
          <Link to="/products" className="hover:text-biscuit-dark">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px]">
          <ProductImageGallery
            key={product.id}
            images={product.images}
            alt={product.name}
          />

          <div className="rounded-3xl border border-biscuit-light bg-white p-6 shadow-sm md:p-8">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-biscuit-dark">
                  {product.categoryName ?? "Selected Product"}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-3xl font-semibold text-biscuit-dark">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-600">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={`star-${index}`}
                      className={`size-4 ${
                        index < Math.round(product.rating)
                          ? "fill-current"
                          : "text-amber-200"
                      }`}
                    />
                  ))}
                  <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="leading-7 text-slate-600">{product.description}</p>

              {sizes.length ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          selectedSize === size
                            ? "border-biscuit bg-biscuit text-white"
                            : "border-biscuit-light text-slate-700 hover:border-biscuit"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Quantity
                </p>
                <div className="inline-flex items-center rounded-full border border-biscuit-light bg-biscuit-light/50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="rounded-full p-2 text-slate-700 transition hover:bg-white"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-12 px-4 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.min(product.stock || 99, current + 1))
                    }
                    className="rounded-full p-2 text-slate-700 transition hover:bg-white"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-11 flex-1 bg-biscuit text-white hover:bg-biscuit-dark"
                  onClick={handleAddToCart}
                  disabled={cartMutation.isPending}
                >
                  <ShoppingCart className="size-4" />
                  {cartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  className="h-11 flex-1 border-biscuit text-biscuit-dark hover:bg-biscuit-light"
                  onClick={() => void handleBuyNow()}
                  disabled={cartMutation.isPending}
                >
                  <ShoppingBag className="size-4" />
                  Buy Now
                </Button>
              </div>

              {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
            </div>
          </div>
        </section>

        <SuggestedProducts
          products={relatedProducts}
          isLoading={relatedProductsQuery.isLoading}
        />
      </div>
    </main>
  );
}
