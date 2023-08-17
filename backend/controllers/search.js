import { db } from "../connect.js";

export const searchUsers = (req, res) => {
  const { q: query } = req.query;
  const q = "SELECT userid, name, username FROM users WHERE LOWER(name) LIKE LOWER(?)";

  db.query(q, `%${query}%`, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};
