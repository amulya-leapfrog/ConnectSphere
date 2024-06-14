import { apiEndPoints } from "../constants/endpoints";
import { http } from "../utils/http";

export const getUsers = async () => {
  const { data } = await http.get(apiEndPoints.users);

  return data;
};
