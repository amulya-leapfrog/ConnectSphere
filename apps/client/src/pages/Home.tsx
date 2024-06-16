import Header from "../components/Header";
import { me } from "../services/Auth";
import Logout from "../components/Logout";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["myDetails"],
    queryFn: me,
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <Header />
      <h3>This is Home page: {data.fullName}</h3>
      <img
        src={data.image ? data.image : "/default.jpg"}
        alt="Profile Pic"
        style={{ width: "200px", height: "auto" }}
      />
      <Logout />
    </div>
  );
}
