import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Check if the user has already liked the post
    const checkQuery = "SELECT * FROM likes WHERE userId = ? AND postId = ?";
    const checkValues = [userInfo.id, req.body.postId];

    db.query(checkQuery, checkValues, (checkErr, checkData) => {
      if (checkErr) return res.status(500).json(checkErr);

      if (checkData.length > 0) {
        // User has already liked the post, delete the like
        const deleteQuery = "DELETE FROM likes WHERE userId = ? AND postId = ?";
        const deleteValues = [userInfo.id, req.body.postId];

        db.query(deleteQuery, deleteValues, (deleteErr, deleteData) => {
          if (deleteErr) return res.status(500).json(deleteErr);
          return res.status(200).json("Post has been unliked.");
        });
      } else {
        // User has not liked the post, proceed to add the like
        const insertQuery = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
        const insertValues = [userInfo.id, req.body.postId];

        db.query(insertQuery, [insertValues], (insertErr, insertData) => {
          if (insertErr) return res.status(500).json(insertErr);
          return res.status(200).json("Post has been liked.");
        });
      }
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const deleteQuery = "DELETE FROM likes WHERE userId = ? AND postId = ?";
    const deleteValues = [userInfo.id, req.query.postId];

    db.query(deleteQuery, deleteValues, (deleteErr, deleteData) => {
      if (deleteErr) return res.status(500).json(deleteErr);
      return res.status(200).json("Post has been unliked.");
    });
  });
};
