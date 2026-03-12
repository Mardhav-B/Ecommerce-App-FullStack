import api from "@/api/axios";
import type { ShippingFormValues } from "@/services/checkout.api";

export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

export interface OrderItemData {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: OrderProduct;
}

export interface OrderData {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItemData[];
}

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Please sign in to view orders.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function saveCheckoutSnapshot(
  order: Partial<Pick<OrderData, "id" | "totalPrice" | "status">>,
  shipping?: ShippingFormValues,
) {
  localStorage.setItem(
    "latestOrderSummary",
    JSON.stringify({
      orderId: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
      shipping,
    }),
  );
}

export function getCheckoutSnapshot(): {
  orderId?: string;
  totalPrice?: number;
  status?: string;
  shipping?: ShippingFormValues;
} | null {
  const raw = localStorage.getItem("latestOrderSummary");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as {
      orderId?: string;
      totalPrice?: number;
      status?: string;
      shipping?: ShippingFormValues;
    };
  } catch {
    return null;
  }
}

export async function fetchOrders() {
  const response = await api.get<OrderData[]>("/orders", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function fetchOrder(orderId: string) {
  const response = await api.get<OrderData>(`/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}
