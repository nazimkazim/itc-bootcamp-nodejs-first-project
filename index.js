import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import cookieParser from "cookie-parser"; 
import bodyParser from "body-parser";
import { logger } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";


const app = express();
app.use(logger);
app.use(cors(corsOptions));

dotenv.config();

app.use(bodyParser.json({ limit: "50mb" }))
app.use(express.json({ extended: true }));
app.use(cookieParser());

// localhost:3005/api/auth/register
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(errorHandler);

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
