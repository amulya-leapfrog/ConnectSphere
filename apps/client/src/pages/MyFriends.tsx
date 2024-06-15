import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  approveFriendRequest,
  deleteMyFriend,
  getMyFriends,
} from "../services/Users";

export interface FriendData {
  friendId: number;
  image: string | null;
  fullName: string;
  bio: string;
  residence: string;
  status: string;
  requestedBy: number;
  receivedBy: number;
  edgeId: string;
}

export default function MyFriends() {
  const [friends, setFriends] = useState<FriendData[]>([]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await getMyFriends();
        setFriends(data);
      } catch (error) {
        console.log(error);
      }
    };

    getInfo();
  }, []);

  const handleDeleteFriend = async (edgeId: string) => {
    const friendDelete = {
      edgeId: edgeId,
    };
    try {
      await deleteMyFriend(friendDelete);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveRequest = async (edgeId: string) => {
    const approveFriend = {
      edgeId: edgeId,
    };
    try {
      await approveFriendRequest(approveFriend);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getButtonLabel = (
    status: string,
    friendId: number,
    requestedBy: number,
    edgeId: string
  ) => {
    if (status === "PENDING") {
      if (requestedBy === friendId) {
        return (
          <div>
            <button onClick={() => handleDeleteFriend(edgeId)}>
              Cancel Request
            </button>
            <button onClick={() => handleApproveRequest(edgeId)}>
              Approve
            </button>
          </div>
        );
      } else {
        return (
          <div>
            <button onClick={() => handleDeleteFriend(edgeId)}>
              Unsend Request
            </button>
          </div>
        );
      }
    } else if (status === "APPROVED") {
      return (
        <div>
          <button onClick={() => handleDeleteFriend(edgeId)}>Unfriend</button>
        </div>
      );
    } else {
      return "";
    }
  };

  return (
    <div>
      <Header />
      <h3>This is friends explore page</h3>
      {friends.map((item) => (
        <div key={item.friendId}>
          <h1>{item.fullName}</h1>
          <p>{item.residence}</p>
          <p>{item.bio}</p>
          <img
            src={item.image ? item.image : "/default.jpg"}
            alt="Profile Pic"
            style={{ width: "200px", height: "auto" }}
          />
          {getButtonLabel(
            item.status,
            item.friendId,
            item.requestedBy,
            item.edgeId
          )}
        </div>
      ))}
    </div>
  );
}
