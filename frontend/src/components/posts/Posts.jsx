import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

const Posts = () => {
  const { currentUser } = useContext(AuthContext);
  console.log("this is current user");
  console.log(currentUser);

  const location = useLocation();
  const userId = location.pathname.includes(":")
    ? parseInt(location.pathname.split(":")[1])
    : "undefined";
  console.log("fetched user id for post");
  console.log(userId);

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get(`/posts?userId=${userId}`).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        "loading"
      ) : (
        data.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;
