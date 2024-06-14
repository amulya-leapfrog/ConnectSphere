import Cookies from "js-cookie";
import { TOKEN } from "../constants/tokens";

export const setCookies = (accessToken: string, refreshToken?: string) => {
  Cookies.set(TOKEN.ACCESS_TOKEN, accessToken, { secure: true });
  if (refreshToken) {
    Cookies.set(TOKEN.REFRESH_TOKEN, refreshToken, { secure: true });
  }
};

export const getCookie = (key: string) => {
  const value = Cookies.get(key);
  if (!value) {
    return null;
  }

  return value;
};

export const getAccessToken = () => {
  return getCookie(TOKEN.ACCESS_TOKEN);
};

export const getRefreshToken = () => {
  return getCookie(TOKEN.REFRESH_TOKEN);
};

export const clearCookieStorage = () => {
  Cookies.remove(TOKEN.ACCESS_TOKEN);
  Cookies.remove(TOKEN.REFRESH_TOKEN);
};
