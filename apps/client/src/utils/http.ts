import axios from "axios";
import * as cookieStore from "./cookies";
import { logout, refresh } from "./authWithRefresh";

export const http = axios.create({
  baseURL: "http://localhost:4000/",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(async (apiConfig) => {
  const accessToken = await cookieStore.getAccessToken();

  if (accessToken) {
    apiConfig.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return apiConfig;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status !== 401) {
      throw error;
    }

    try {
      const { accessToken } = await refresh();

      cookieStore.setCookies(accessToken);

      return await http(error.config);
    } catch (refreshError) {
      logout();

      window.location.reload();

      throw refreshError;
    }
  }
);
