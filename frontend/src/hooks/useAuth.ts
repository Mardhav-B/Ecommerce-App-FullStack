import { useQuery } from "@tanstack/react-query";
import { getProfile, type SavedAddress } from "../services/auth.api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  addresses?: SavedAddress[];
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
