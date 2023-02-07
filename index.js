import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import cookieParser from "cookie-parser"; 
import bodyParser from "body-parser";
import { logger } from "./middleware/logger.js";


const app = express();
app.use(logger);
dotenv.config();

app.use(bodyParser.json({ limit: "50mb" }))
app.use(express.json({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// localhost:3005/api/auth/register
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

function start() {
  try {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(3005, () => console.log("Server has been started..."));
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}

start();
