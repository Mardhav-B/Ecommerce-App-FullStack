import api from "@/api/axios";

export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface CartData {
  id: string | null;
  items: CartItem[];
}

interface RawCartData {
  id: string;
  items: CartItem[];
}

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Please sign in to access your cart.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function normalizeCart(cart: RawCartData | null): CartData {
  return {
    id: cart?.id ?? null,
    items: cart?.items ?? [],
  };
}

export async function fetchCart(): Promise<CartData> {
  const response = await api.get<RawCartData | null>("/cart", {
    headers: getAuthHeaders(),
  });

  return normalizeCart(response.data);
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    const response = await api.patch<CartItem>(
      `/cart/${itemId}`,
      { quantity },
      { headers: getAuthHeaders() },
    );

    return response.data;
  } catch {
    const response = await api.put<CartItem>(
      `/cart/${itemId}`,
      { quantity },
      { headers: getAuthHeaders() },
    );

    return response.data;
  }
}

export async function removeCartItem(itemId: string) {
  await api.delete(`/cart/${itemId}`, {
    headers: getAuthHeaders(),
  });

  return itemId;
}
