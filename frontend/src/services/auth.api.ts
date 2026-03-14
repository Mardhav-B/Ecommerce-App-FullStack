import api from "@/api/axios";

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

export const loginUser = async (data: any) => {
  const res = await api.post("/auth/login", data);
  const result = res.data;

  localStorage.setItem("accessToken", result.accessToken);

  return result;
};

export const registerUser = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No access token");

  const res = await api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; 
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
