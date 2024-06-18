import { TextField } from "@mui/material";
import Header from "../components/Header";
import SendIcon from "@mui/icons-material/Send";

function Home() {
  return (
    <div>
      <Header />
      <div className="after__header">
        <div className="home__container">
          <h3 className="page__header">My Feed</h3>
          <div className="feed__container">
            <div className="feed__card">
              <div className="feed__cardHeader">
                <div className="feed__cardHeader-user">
                  <img src="/default.jpg" alt="User Image" />
                </div>
                <div className="feed__cardHeader-info">
                  <p>John Doe</p>
                  <span>2024-09-09</span>
                </div>
              </div>
              <div className="feed__post">
                <span>My First Post</span>
                <div className="feed__postImage">
                  <img src="/background.jpg" alt="Post Image" />
                </div>
              </div>
              <div className="feed__postComment">
                <div className="feed__comment-img">
                  <img src="/default.jpg" alt="" />
                </div>
                <div className="feed__comment-input">
                  <TextField
                    name="email"
                    fullWidth
                    placeholder="Add a comment"
                    variant="outlined"
                  />{" "}
                  <SendIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
