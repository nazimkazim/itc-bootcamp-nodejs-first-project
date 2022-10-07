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
        post: postId,
        author: req.user.userId,
      });
      const comment = await newComment.save();
      const post = await PostModel.findById(postId);
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
});

router.delete("/:id", checkAuth, async (req, res) => {
  const comment = await CommentModel.findById(req.params.id);
  try {
    if (req.user.userId === comment.author.toString()) {
      const post = await PostModel.findById(comment.post);
      await comment.delete();
      post.comments = post.comments.filter(
        (id) => id.toString() !== req.params.id
      );
      await post.save();
      res.status(200).json({ message: "Comment deleted" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/:id", checkAuth, async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (comment.author.toString() == req.user.userId) {
      await CommentModel.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json({ message: "Comment updated" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

export default router;
