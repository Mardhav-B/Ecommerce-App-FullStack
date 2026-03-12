const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");

  const result = await res.json();

  localStorage.setItem("accessToken", result.accessToken);

  return result;
};

export const registerUser = async (data: any) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Register failed");

  return res.json();
};

export const getProfile = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No access token");

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch profile: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data; 
};

export const saveAddress = async (data: SaveAddressInput): Promise<SavedAddress> => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw new Error("No access token");

  const res = await fetch(`${API_URL}/auth/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.message || "Failed to save address");
  }

  return res.json();
};

export const logoutUser = async () => {
  const token = localStorage.getItem("accessToken");

  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  localStorage.removeItem("accessToken");
};
