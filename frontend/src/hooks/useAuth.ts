import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/auth.api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  addresses?: {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }[];
}

export function useAuth() {
  const token = localStorage.getItem("accessToken");

  return useQuery<AuthUser>({
    queryKey: ["authUser", token],
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });
}
