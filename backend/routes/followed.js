import express from "express";
import { getFollowedUsers } from "../controllers/followed.js";

const router = express.Router();

router.get("/:userId/followedUsers", getFollowedUsers);

export default router;
