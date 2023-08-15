import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./updatePost.scss";

const UpdatePost = ({ post, onClose }) => {
  const [description, setDescription] = useState(post.desc || "");
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (desc) => {
      return makeRequest.put(`/posts/${post.id}`, { desc });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        onClose();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(description);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit">Update</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
