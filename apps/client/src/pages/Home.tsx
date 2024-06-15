import { useEffect, useState } from "react";
import Header from "../components/Header";
import { me } from "../services/Auth";
import Logout from "../components/Logout";

export default function Home() {
  const [name, setName] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await me();
        setName(data.fullName);
        setImg(data.image);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    getInfo();
  }, []);

  return (
    <div>
      <Header />
      <h3>This is Home page: {name}</h3>
      <img
        src={img ? img : "/default.jpg"}
        alt="Profile Pic"
        style={{ width: "200px", height: "auto" }}
      />
      <Logout />
    </div>
  );
}
