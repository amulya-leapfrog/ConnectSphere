import { apiEndPoints } from "../constants/endpoints";
import { http } from "../utils/http";

export const login = async () => {
  const loginData = {
    email: "abcd@abcd.com",
    password: "20540913",
  };

  const { data } = await http.post(apiEndPoints.login, loginData);

  return data;
};
