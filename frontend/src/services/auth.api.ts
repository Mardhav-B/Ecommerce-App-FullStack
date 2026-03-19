import api from "@/api/axios";
import { isAxiosError } from "axios";

export interface SavedAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface SaveAddressInput {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  message?: string;
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message?: string;
  user: AuthUser;
}

function extractApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as unknown;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string" &&
    (data as { message: string }).message.trim()
  ) {
    return (data as { message: string }).message;
  }

  return fallback;
}

export const loginUser = async (data: LoginInput): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/auth/login", data);
    const result = res.data;

    localStorage.setItem("accessToken", result.accessToken);

    return result;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, "Login failed"));
  }
};

export const registerUser = async (
  data: RegisterInput,
): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>("/auth/register", data);
    return res.data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, "Registration failed"));
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No access token");

  try {
    const res = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, "Unable to load profile"));
  }
};

export const saveAddress = async (data: SaveAddressInput): Promise<SavedAddress> => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No access token");

  const res = await api.post<SavedAddress>("/auth/addresses", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateAddress = async (
  addressId: string,
  data: SaveAddressInput,
): Promise<SavedAddress> => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No access token");

  const res = await api.patch<SavedAddress>(`/auth/addresses/${addressId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteAddress = async (addressId: string) => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No access token");

  await api.delete(`/auth/addresses/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logoutUser = async () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    await api.post("/auth/logout", undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  localStorage.removeItem("accessToken");
};
