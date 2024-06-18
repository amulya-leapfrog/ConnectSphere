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
        queryKey: ["suggestions", "myFriends", "recommendations"],
      });
      window.location.reload();
    },
    onError: (error) => {
      alert(error);
    },
  });

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
          <h3 className="page__header">People You May Know</h3>
          <div className="explore__people">
            {data?.map((item) => (
              <div key={item.id}>
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
                    <button
                      onClick={() =>
                        friendRequestMutation.mutate({ targetId: item.id })
                      }
                    >
                      Send a friend request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
