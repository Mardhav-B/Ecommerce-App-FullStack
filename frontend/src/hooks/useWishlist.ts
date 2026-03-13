import { useMemo } from "react";

import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/services/product.api";
import type { WishlistItem } from "@/services/wishlist.api";
import { useAppStore } from "@/stores/app.store";

const EMPTY_WISHLIST: WishlistItem[] = [];

export function useWishlist() {
  const { data: user } = useAuth();
  const userId = user?.id;
  const wishlist = useAppStore(
    (state) => (userId ? state.wishlistByUser[userId] ?? EMPTY_WISHLIST : EMPTY_WISHLIST),
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
    if (!userId) {
      return false;
    }

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
    return true;
  };

  const toggleWishlist = (product: Product) => {
    if (!userId) {
      return false;
    }

    if (isWishlisted(userId, product.id)) {
      removeWishlistItemByProductId(userId, product.id);
      return true;
    }

    return addToWishlist(product);
  };

  return {
    data: apiShapeWishlist,
    isLoading: false,
    isError: false,
    error: null,
    requiresAuth: !userId,
    addToWishlist,
    removeFromWishlist: (wishlistItemId: string) =>
      userId ? removeWishlistItem(userId, wishlistItemId) : undefined,
    toggleWishlist,
    isWishlisted: (productId: string) => (userId ? isWishlisted(userId, productId) : false),
    isAddingToWishlist: false,
    isRemovingFromWishlist: false,
  };
}
