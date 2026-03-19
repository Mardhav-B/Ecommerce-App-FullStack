import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation();
  const hasToken = Boolean(localStorage.getItem("accessToken"));

  if (!hasToken) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}

