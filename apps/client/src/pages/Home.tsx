import { useEffect, useState } from "react";
import Header from "../components/Header";
import { me } from "../services/Auth";

export default function Home() {
  const [count, setCount] = useState("");

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await me();
        setCount(data.fullName);
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
      <h3>This is Home page: {count}</h3>
    </div>
  );
}
