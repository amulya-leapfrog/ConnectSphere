import Header from "../components/Header";
import {
  approveFriendRequest,
  deleteMyFriend,
  getMyFriends,
} from "../services/Users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<FriendData[]>({
    queryKey: ["myFriends"],
    queryFn: getMyFriends,
  });

  const friendDeleteMutation = useMutation({
    mutationFn: deleteMyFriend,
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

  const friendApproveMutation = useMutation({
    mutationFn: approveFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myFriends"],
      });
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
            <button onClick={() => friendDeleteMutation.mutate({ edgeId })}>
              Cancel Request
            </button>
            <button onClick={() => friendApproveMutation.mutate({ edgeId })}>
              Approve
            </button>
          </div>
        );
      } else {
        return (
          <div>
            <button onClick={() => friendDeleteMutation.mutate({ edgeId })}>
              Unsend Request
            </button>
          </div>
        );
      }
    } else if (status === "APPROVED") {
      return (
        <div>
          <button onClick={() => friendDeleteMutation.mutate({ edgeId })}>
            Unfriend
          </button>
        </div>
      );
    } else {
      return "";
    }
  };

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
