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

const PAID_ORDER_IDS_STORAGE_KEY = "paidOrderIds";

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
  mode: "cart" | "buy_now" = "cart",
) {
  localStorage.setItem(
    "latestOrderSummary",
    JSON.stringify({
      orderId: order.id,
      totalPrice: order.totalPrice,
      status: order.status,
      shipping,
      mode,
      initiatedAt: new Date().toISOString(),
    }),
  );
}

export function getCheckoutSnapshot(): {
  orderId?: string;
  totalPrice?: number;
  status?: string;
  shipping?: ShippingFormValues;
  mode?: "cart" | "buy_now";
  initiatedAt?: string;
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
      mode?: "cart" | "buy_now";
      initiatedAt?: string;
    };
  } catch {
    return null;
  }
}

export function clearCheckoutSnapshot() {
  localStorage.removeItem("latestOrderSummary");
}

export function markOrderAsPaid(orderId: string) {
  const currentIds = new Set(getPaidOrderIds());
  currentIds.add(orderId);
  localStorage.setItem(
    PAID_ORDER_IDS_STORAGE_KEY,
    JSON.stringify(Array.from(currentIds)),
  );
}

export function getPaidOrderIds(): string[] {
  const raw = localStorage.getItem(PAID_ORDER_IDS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isOrderMarkedPaid(orderId?: string | null) {
  if (!orderId) {
    return false;
  }

  return getPaidOrderIds().includes(orderId);
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
