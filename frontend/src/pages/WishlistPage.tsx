import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import WishlistCard from "@/components/wishlist/WishlistCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { addToCart } from "@/services/product.api";

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const hasToken = Boolean(localStorage.getItem("accessToken"));
  const {
    data: wishlist = [],
    isLoading,
    removeFromWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const cartMutation = useMutation({
    mutationFn: ({
      productId,
    }: {
      wishlistItemId: string;
      productId: string;
    }) =>
      addToCart(productId, 1),
    onSuccess: (_data, variables) => {
      removeFromWishlist(variables.wishlistItemId);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (!hasToken) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#fff_28%)] px-4 py-10 md:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-biscuit-light bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-biscuit-light text-biscuit-dark">
            <Heart className="size-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            Sign in to view your wishlist
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Wishlist items are tied to your account and are not shown before
            login.
          </p>
          <Button
            asChild
            className="mt-6 bg-biscuit text-white hover:bg-biscuit-dark"
          >
            <Link to="/auth">Go to Login</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcf5ee_0%,#fff_28%)] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-biscuit-dark">
            Wishlist
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Saved products for later.
          </h1>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-biscuit-light bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-biscuit-light text-biscuit-dark">
              <Heart className="size-7" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
              Wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Save products from the listing page and they will show up here.
            </p>
            <Button
              asChild
              className="mt-6 bg-biscuit text-white hover:bg-biscuit-dark"
            >
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={removeFromWishlist}
                onAddToCart={(wishlistItemId, productId) =>
                  cartMutation.mutate({ wishlistItemId, productId })
                }
                disabled={isRemovingFromWishlist || cartMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
