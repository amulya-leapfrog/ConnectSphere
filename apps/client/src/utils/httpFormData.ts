import axios from "axios";
import * as cookieStore from "./cookies";
import { logout, refresh } from "./authWithRefresh";

export const httpFormData = axios.create({
  baseURL: "http://localhost:4000/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

httpFormData.interceptors.request.use(async (apiConfig) => {
  const accessToken = await cookieStore.getAccessToken();

  if (accessToken) {
    apiConfig.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return apiConfig;
});

httpFormData.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status !== 401) {
      throw error;
    }

    try {
      const { accessToken } = await refresh();

      cookieStore.setCookies(accessToken);

      return await httpFormData(error.config);
    } catch (refreshError) {
      logout();

      window.location.reload();

      throw refreshError;
    }
  }
);
