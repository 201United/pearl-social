import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      console.log(newPost);
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    console.log(imgUrl);
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
    setShowCancel(false); // Reset the cancel button state
  };

  const handleCancel = () => {
    setDesc("");
    setFile(null);
    setShowCancel(false);
  };

  const handleInputChange = (e) => {
    setDesc(e.target.value);
    if (!showCancel) setShowCancel(true);
  };

  // Check if the required fields have content to enable the Share button
  const isShareButtonClickable = desc.trim() !== "" || file !== null;

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={handleInputChange}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            {showCancel && (
              <div className="item">
                <button className="cancelButton" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="right">
            <button
              onClick={handleClick}
              disabled={!isShareButtonClickable} // Disable the Share button if required fields are empty
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
