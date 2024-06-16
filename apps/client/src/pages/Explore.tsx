import { getUsers, sendFriendReq } from "../services/Users";
import Header from "../components/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<UserData[]>({
    queryKey: ["suggestions"],
    queryFn: getUsers,
  });

  const friendRequestMutation = useMutation({
    mutationFn: sendFriendReq,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suggestions", "myFriends"],
      });
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
    },
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
      <h3>This is friends explore page</h3>
      {data?.map((item) => (
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
          <button
            onClick={() => friendRequestMutation.mutate({ targetId: item.id })}
          >
            Send a friend request
          </button>
        </div>
      ))}
    </div>
  );
}
