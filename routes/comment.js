import { Router } from "express";
import PostModel from "../models/Post.js";
import CommentModel from "../models/Comment.js";
import { checkAuth } from "../utils/checkAuth.js";
const router = Router();

router.post("/", checkAuth, async (req, res) => {
    try {
      const { postId, desc } = req.body;
      const newComment = new CommentModel({
        desc,
        post:postId
      });

    const comment = await newComment.save();
    const post = await PostModel.findById(postId).populate("author");
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json({ message: "Comment created" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const comment = await CommentModel.find();
      res.status(200).json(comment);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
  )

export default router;