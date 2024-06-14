import { clearCookieStorage } from "../utils/cookies";
import { apiEndPoints } from "../constants/endpoints";
import { httpWithRefreshToken } from "./httpWithRefreshToken";

export const refresh = async () => {
  const { data } = await httpWithRefreshToken.post(apiEndPoints.refresh);

  return data;
};

export const logout = async () => {
  clearCookieStorage();
};
