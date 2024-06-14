import axios from "axios";
import * as cookieStore from "./cookies";

export const httpWithRefreshToken = axios.create({
  baseURL: "http://localhost:4000/",
  headers: {
    "Content-Type": "application/json",
  },
});

httpWithRefreshToken.interceptors.request.use(async (apiConfig) => {
  const refreshToken = cookieStore.getRefreshToken();

  if (refreshToken) {
    apiConfig.headers.set("Authorization", `Bearer ${refreshToken}`);
  }

  return apiConfig;
});
