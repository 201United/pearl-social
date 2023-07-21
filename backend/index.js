import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import storyRoutes from "./routes/stories.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import searchRoutes from "./routes/search.js"
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import followedRoutes from "./routes/followed.js";

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/followed", followedRoutes);

app.listen(8800, () => {
  console.log("API working!");
});
