import api from "@/api/axios";

export interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: WishlistProduct;
}

interface RawWishlistItem {
  id: string;
  productId?: string;
  product?: WishlistProduct;
  name?: string;
  price?: number;
  imageUrl?: string | null;
}

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Please sign in to manage your wishlist.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function normalizeWishlistItem(item: RawWishlistItem): WishlistItem {
  const product = item.product ?? {
    id: item.productId ?? item.id,
    name: item.name ?? "Wishlist item",
    price: item.price ?? 0,
    imageUrl: item.imageUrl,
  };

  return {
    id: item.id,
    productId: item.productId ?? product.id,
    product,
  };
}

export async function fetchWishlist() {
  const response = await api.get<RawWishlistItem[]>("/wishlist", {
    headers: getAuthHeaders(),
  });

  return response.data.map(normalizeWishlistItem);
}

export async function addToWishlist(productId: string) {
  const response = await api.post<RawWishlistItem>(
    "/wishlist",
    { productId },
    { headers: getAuthHeaders() },
  );

  return normalizeWishlistItem(response.data);
}

export async function removeFromWishlist(wishlistItemId: string) {
  await api.delete(`/wishlist/${wishlistItemId}`, {
    headers: getAuthHeaders(),
  });

  return wishlistItemId;
}
