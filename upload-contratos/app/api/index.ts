import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
