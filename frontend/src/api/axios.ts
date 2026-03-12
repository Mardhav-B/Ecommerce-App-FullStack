import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-app-fullstack.onrender.com/api",
});

export default api;
