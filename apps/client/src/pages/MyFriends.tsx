import { Link } from "react-router-dom";
import Header from "../components/Header";
import {
  approveFriendRequest,
  deleteMyFriend,
  getMyFriends,
  recommendFriends,
  sendFriendReq,
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

interface RecommendFriend {
  fullName: string;
  residence: string;
  image: string;
  email: string;
  id: number;
  label: string;
}

interface MutualFriend {
  id: number;
  fullName: string;
}

interface RecommendData {
  recommended: RecommendFriend;
  mutualFriends: MutualFriend[];
}

export default function MyFriends() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<FriendData[]>({
    queryKey: ["myFriends"],
    queryFn: getMyFriends,
  });

  const {
    data: recommendation,
    error: recommendError,
    isLoading: recommendLoad,
  } = useQuery<RecommendData[]>({
    queryKey: ["recommendations"],
    queryFn: recommendFriends,
  });

  const friendDeleteMutation = useMutation({
    mutationFn: deleteMyFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suggestions", "myFriends", "recommendations"],
      });
      window.location.reload();
    },
    onError: (error) => {
      alert(error);
    },
  });

  const friendApproveMutation = useMutation({
    mutationFn: approveFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myFriends", "recommendations"],
      });
      window.location.reload();
    },
    onError: (error) => {
      alert(error);
    },
  });

  const friendRequestMutation = useMutation({
    mutationFn: sendFriendReq,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suggestions", "myFriends", "recommendations"],
      });
      window.location.reload();
    },
    onError: (error) => {
      alert(error);
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

  if (isLoading || recommendLoad) {
    return <div>Loading...</div>;
  }

  if (error || recommendError) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      <Header />
      <div className="after__header">
        <div className="myFriends__container">
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
          <div>
            <h3 className="page__header">Suggestions</h3>
            <div className="recommendation__container">
              {recommendation?.map((item) => (
                <div key={item.recommended.id} className="recommendation__card">
                  <div className="recommendation__img">
                    <img
                      src={item.recommended.image}
                      alt={item.recommended.fullName}
                    />
                  </div>
                  <h1>{item.recommended.fullName}</h1>
                  <span>{item.recommended.residence}</span>
                  <div
                    className="recommendation__mutual"
                    title={item.mutualFriends
                      .map((friends) => friends.fullName)
                      .join(", ")}
                  >
                    {item.mutualFriends.length} Mutual Friend(s)
                  </div>
                  <button
                    className="requestBtn"
                    onClick={() => {
                      friendRequestMutation.mutate({
                        targetId: item.recommended.id,
                      });
                    }}
                  >
                    Send a Friend Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
