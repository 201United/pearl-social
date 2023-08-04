import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(typeof userId);
    
    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.userid AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.userid = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.userid AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.userid = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY p.createdAt DESC`;

    console.log(q);
    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json({msg:"get post errr"});
      console.log("get post success");
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    console.log(values);
    console.log(userInfo);
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json({msg: "this is bad"});
      console.log("doneee");
      return res.status(200).json("Post has been created.");
    });
  });
};


export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};

export const editPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const { desc } = req.body;
    console.log("aaya kya?", req.body);

    const q = "UPDATE posts SET `desc` = ? WHERE `id` = ? AND `userId` = ?";
    const values = [desc, postId, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) {
        return res.json("Post has been updated.");
      } else {
        return res.status(403).json("You can edit only your post");
      }
    });
  });
};




