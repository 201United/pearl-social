import { useContext } from "react";
import "./rightBar.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data: followedUsers } = useQuery(
    ["followedUsers"],
    () =>
      makeRequest
        .get(`/followed/:${currentUser.userid}/followedUsers`)
        .then((res) => res.data)
  );

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {/* Suggestions for the user */}
        </div>
        <div className="item">
          <span>Latest Activities</span>
          {/* Latest activities */}
        </div>
        <div className="item">
          <span>Followed Users</span>
          {error ? (
            <div>Error: {error.message}</div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : (
            followedUsers.map((user) => (
              <div className="user" key={user.userid}>
                <div className="userInfo">
                  <img src={"/upload/" + user.profilePic} alt="" />
                  <span>{user.name}</span>
                </div>
                <div className="buttons">
                  <button>follow</button>
                  <button>dismiss</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
