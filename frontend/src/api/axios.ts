import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://ecommerce-app-fullstack.onrender.com/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !String(originalRequest.url).includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post("/auth/refresh");
        const nextAccessToken = refreshResponse.data?.accessToken;

        if (typeof nextAccessToken === "string" && nextAccessToken.length > 0) {
          localStorage.setItem("accessToken", nextAccessToken);
          originalRequest.headers = {
            ...(originalRequest.headers ?? {}),
            Authorization: `Bearer ${nextAccessToken}`,
          };
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
