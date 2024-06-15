import { useEffect, useState } from "react";
import { getUsers, sendFriendReq } from "../services/Users";
import Header from "../components/Header";

export interface UserData {
  id: number;
  label: string;
  image: string | null;
  phone: string;
  fullName: string;
  bio: string;
  residence: string;
  email: string;
}

export default function Explore() {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    getInfo();
  }, []);

  const handleFriendRequest = async (id: number) => {
    try {
      await sendFriendReq({ targetId: id });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <h3>This is friends explore page</h3>
      {users.map((item) => (
        <div key={item.id}>
          <h1>{item.fullName}</h1>
          <p>{item.phone}</p>
          <p>{item.residence}</p>
          <p>{item.bio}</p>
          <img
            src={item.image ? item.image : "/default.jpg"}
            alt="Profile Pic"
            style={{ width: "200px", height: "auto" }}
          />
          <button onClick={() => handleFriendRequest(item.id)}>
            Send a friend request
          </button>
        </div>
      ))}
    </div>
  );
}
