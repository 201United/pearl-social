import { db } from "../connect.js";

export const getFollowedUsers = (req, res) => {
    const { userId } = req.params;
    const q = `
      SELECT users.userid, users.profilePic, users.name
      FROM relationships
      INNER JOIN users ON relationships.followedUserId = users.userid
      WHERE relationships.followerUserId = ?
    `;
  
    db.query(q, [userId.substring(1)], (err, data) => {
      if (err) return res.status(500).json(err);
      console.log("followed list");
      console.log(data);
      return res.json(data);
    });
  };
  
