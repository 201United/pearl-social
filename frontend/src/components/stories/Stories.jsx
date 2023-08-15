import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      console.log(res.data);
      return res.data;
    })
  );

  // TODO: Implement adding a story using react-query mutations and the upload function.

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {error ? (
        "Something went wrong"
      ) : isLoading ? (
        "Loading"
      ) : (
        data.map((story) => (
          <div className="story" key={story.id}>
            <img src={story.img} alt="" />
            <span>{story.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;
