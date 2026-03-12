import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StoredWishlistProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

export interface StoredWishlistItem {
  id: string;
  productId: string;
  product: StoredWishlistProduct;
}

interface AppState {
  wishlistByUser: Record<string, StoredWishlistItem[]>;
  selectedCheckoutAddressId: string | null;
  setSelectedCheckoutAddressId: (addressId: string | null) => void;
  getWishlist: (userId: string) => StoredWishlistItem[];
  addWishlistItem: (userId: string, item: StoredWishlistItem) => void;
  removeWishlistItem: (userId: string, wishlistItemId: string) => void;
  removeWishlistItemByProductId: (userId: string, productId: string) => void;
  isWishlisted: (userId: string, productId: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      wishlistByUser: {},
      selectedCheckoutAddressId: null,
      setSelectedCheckoutAddressId: (addressId) =>
        set({ selectedCheckoutAddressId: addressId }),
      getWishlist: (userId) => (get().wishlistByUser ?? {})[userId] ?? [],
      addWishlistItem: (userId, item) =>
        set((state) => {
          const wishlistByUser = state.wishlistByUser ?? {};
          const currentWishlist = wishlistByUser[userId] ?? [];

          if (
            currentWishlist.some(
              (wishlistItem) => wishlistItem.productId === item.productId,
            )
          ) {
            return state;
          }

          return {
            wishlistByUser: {
              ...wishlistByUser,
              [userId]: [item, ...currentWishlist],
            },
          };
        }),
      removeWishlistItem: (userId, wishlistItemId) =>
        set((state) => ({
          wishlistByUser: {
            ...(state.wishlistByUser ?? {}),
            [userId]: ((state.wishlistByUser ?? {})[userId] ?? []).filter(
              (item) => item.id !== wishlistItemId,
            ),
          },
        })),
      removeWishlistItemByProductId: (userId, productId) =>
        set((state) => ({
          wishlistByUser: {
            ...(state.wishlistByUser ?? {}),
            [userId]: ((state.wishlistByUser ?? {})[userId] ?? []).filter(
              (item) => item.productId !== productId,
            ),
          },
        })),
      isWishlisted: (userId, productId) =>
        ((get().wishlistByUser ?? {})[userId] ?? []).some(
          (item) => item.productId === productId,
        ),
    }),
    {
      name: "shopsphere-app-store",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as {
          wishlistByUser?: Record<string, StoredWishlistItem[]>;
          wishlist?: StoredWishlistItem[];
          selectedCheckoutAddressId?: string | null;
        };

        return {
          wishlistByUser: state.wishlistByUser ?? { guest: state.wishlist ?? [] },
          selectedCheckoutAddressId: state.selectedCheckoutAddressId ?? null,
        };
      },
      partialize: (state) => ({
        wishlistByUser: state.wishlistByUser,
        selectedCheckoutAddressId: state.selectedCheckoutAddressId,
      }),
    },
  ),
);
