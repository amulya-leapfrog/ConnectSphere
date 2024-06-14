import { ILogin, ISignup } from "../interfaces/Auth";
import { apiEndPoints } from "../constants/endpoints";
import { http } from "../utils/http";
import { httpFormData } from "../utils/httpFormData";

export const login = async (loginData: ILogin) => {
  const { data } = await http.post(apiEndPoints.login, loginData);

  return data;
};

export const signup = async (signupData: ISignup) => {
  const { data } = await httpFormData.post(apiEndPoints.signup, signupData);

  return data;
};

export const me = async () => {
  const { data } = await http.get(apiEndPoints.me);

  return data;
};
