import { useMemo } from "react";

import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/services/product.api";
import type { WishlistItem } from "@/services/wishlist.api";
import { useAppStore } from "@/stores/app.store";

const EMPTY_WISHLIST: WishlistItem[] = [];

export function useWishlist() {
  const { data: user } = useAuth();
  const userId = user?.id ?? "guest";
  const wishlist = useAppStore(
    (state) => state.wishlistByUser[userId] ?? EMPTY_WISHLIST,
  );
  const addWishlistItem = useAppStore((state) => state.addWishlistItem);
  const removeWishlistItem = useAppStore((state) => state.removeWishlistItem);
  const removeWishlistItemByProductId = useAppStore(
    (state) => state.removeWishlistItemByProductId,
  );
  const isWishlisted = useAppStore((state) => state.isWishlisted);

  const apiShapeWishlist = useMemo<WishlistItem[]>(
    () => wishlist.map((item) => ({ ...item })),
    [wishlist],
  );

  const addToWishlist = (product: Product) => {
    addWishlistItem(userId, {
      id: `wishlist-${product.id}`,
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });
  };

  const toggleWishlist = (product: Product) => {
    if (isWishlisted(userId, product.id)) {
      removeWishlistItemByProductId(userId, product.id);
      return;
    }

    addToWishlist(product);
  };

  return {
    data: apiShapeWishlist,
    isLoading: false,
    isError: false,
    error: null,
    addToWishlist,
    removeFromWishlist: (wishlistItemId: string) =>
      removeWishlistItem(userId, wishlistItemId),
    toggleWishlist,
    isWishlisted: (productId: string) => isWishlisted(userId, productId),
    isAddingToWishlist: false,
    isRemovingFromWishlist: false,
  };
}
