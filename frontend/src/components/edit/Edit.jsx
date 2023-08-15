import "./edit.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Edit = ({ post, onClose }) => {
  const [file, setFile] = useState(post.img ? post.img : null);
  const [desc, setDesc] = useState(post.desc ? post.desc : "");
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
    (updatedPost) => {
      return makeRequest.put("/posts/" + post.id, updatedPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
        onClose(); // Close the Edit component after successfully updating the post
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    console.log(imgUrl);
    mutation.mutate({ desc, img: imgUrl });
  };

  const handleCancel = () => {
    onClose(); // Close the Edit component without making any changes
  };

  const handleInputChange = (e) => {
    setDesc(e.target.value);
    if (!showCancel) setShowCancel(true);
  };

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
              disabled={!isShareButtonClickable}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
