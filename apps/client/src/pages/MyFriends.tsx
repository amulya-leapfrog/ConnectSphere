import { Link } from "react-router-dom";
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
  phone: string;
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
          <div className="friendsBtns">
            <button
              onClick={() => friendApproveMutation.mutate({ edgeId })}
              id="updateBtn"
            >
              Approve
            </button>
            <button
              onClick={() => friendDeleteMutation.mutate({ edgeId })}
              id="deleteBtn"
            >
              Cancel Request
            </button>
          </div>
        );
      } else {
        return (
          <button
            onClick={() => friendDeleteMutation.mutate({ edgeId })}
            id="deleteBtn"
          >
            Unsend Request
          </button>
        );
      }
    } else if (status === "APPROVED") {
      return (
        <div>
          <button
            onClick={() => friendDeleteMutation.mutate({ edgeId })}
            id="deleteBtn"
          >
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
    <>
      <Header />
      <div className="after__header">
        <div className="explore__container">
          <h3 className="page__header">My Friends</h3>
          <div className="explore__people">
            {data && data.length > 0 ? (
              data?.map((item) => (
                <div key={item.friendId}>
                  <div className="explore__peopleCard">
                    <div className="explore__peopleInfo">
                      <div className="explore__image">
                        <img
                          src={item.image ? item.image : "/default.jpg"}
                          alt="Profile Pic"
                        />
                      </div>
                      <div className="explore__desc">
                        <h1>{item.fullName}</h1>
                        <div className="explore__personalInfo">
                          <p>Residence: {item.residence}</p>
                          <p>Phone: {item.phone}</p>
                        </div>
                        <p>{item.bio}</p>
                      </div>
                    </div>
                    <div className="btnContainer">
                      {getButtonLabel(
                        item.status,
                        item.friendId,
                        item.requestedBy,
                        item.edgeId
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty__state">
                You haven't made any friends yet.{" "}
                <span>
                  <Link to="/explore">Make Friends</Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
