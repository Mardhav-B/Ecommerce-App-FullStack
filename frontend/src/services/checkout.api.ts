import api from "@/api/axios";
import axios from "axios";

export interface ShippingFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CheckoutOrderItemInput {
  productId: string;
  quantity: number;
}

interface CreatedOrder {
  id: string;
  totalPrice: number;
}

interface CheckoutSessionResponse {
  url: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Please sign in to continue.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createOrder(items?: CheckoutOrderItemInput[]) {
  const response = await api.post<CreatedOrder>(
    "/orders",
    items?.length ? { items } : {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function createCheckoutSession(orderId?: string) {
  try {
    const response = await api.post<CheckoutSessionResponse>(
      "/payment/create-checkout-session",
      orderId ? { orderId } : undefined,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (primaryError) {
    try {
      const response = await api.post<CheckoutSessionResponse>(
        "/payment/checkout",
        orderId ? { orderId } : undefined,
        {
          headers: getAuthHeaders(),
        },
      );

      return response.data;
    } catch (fallbackError) {
      if (axios.isAxiosError(fallbackError)) {
        const message =
          typeof fallbackError.response?.data?.message === "string"
            ? fallbackError.response.data.message
            : fallbackError.message;
        throw new Error(message);
      }

      if (axios.isAxiosError(primaryError)) {
        const message =
          typeof primaryError.response?.data?.message === "string"
            ? primaryError.response.data.message
            : primaryError.message;
        throw new Error(message);
      }

      throw fallbackError;
    }
  }
}
