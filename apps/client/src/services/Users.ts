import { DeleteFriend, FriendReq } from "~/interfaces/Users";
import { apiEndPoints } from "../constants/endpoints";
import { http } from "../utils/http";

export const getUsers = async () => {
  const { data } = await http.get(apiEndPoints.users);

  return data;
};

export const sendFriendReq = async (id: FriendReq) => {
  const { data } = await http.post(apiEndPoints.userReq, id);

  return data;
};

export const getMyFriends = async () => {
  const { data } = await http.get(apiEndPoints.userFriends);

  return data;
};

export const deleteMyFriend = async (deleteData: DeleteFriend) => {
  const { data } = await http.post(apiEndPoints.userDeleteFriend, deleteData);

  return data;
};

export const approveFriendRequest = async (approveData: DeleteFriend) => {
  const { data } = await http.post(apiEndPoints.userApproveFriend, approveData);

  return data;
};
