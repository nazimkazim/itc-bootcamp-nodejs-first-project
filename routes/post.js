import { Router } from "express";
import UserModel from "../models/User.js";
import PostModel from "../models/Post.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = Router();

router.post("/:id", checkAuth, async (req, res) => {
  try {
    const { title, description, img, tags } = req.body;
    const userId = await UserModel.findById(req.params.id);
    const post = new PostModel({
      title,
      description,
      img,
      tags: tags.map((tag) => tag.toLowerCase()),
    });
    post.author = userId;
    await post.save();
    await UserModel.findByIdAndUpdate(userId, {
      $push: { posts: post },
    });
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/",checkAuth, async (req, res) => {
  try {
    const post = await PostModel.find().populate("author");
    res.status(200).json(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/:id", checkAuth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("author")
      .populate("comments");
    res.status(200).json(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const {userId} = req.body
  try {
    const post = await PostModel.findById(req.params.id);
    if (post.author.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await PostModel.findByIdAndDelete(req.params.id);
    const user = await UserModel.findById(userId);
    user.posts.splice(user.posts.indexOf(req.params.id), 1);
    await user.save();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/:id", checkAuth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    const { title, description, img, tags } = req.body;
    if (post.author.toString() == req.body.userId) {
      await PostModel.findByIdAndUpdate(req.params.id, {
        title,
        description,
        img,
        tags: tags.split(",").map((tag) => tag.toLowerCase()),
      });
      res.status(200).json({ message: "Post updated" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/view/:id", async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json({ message: "View added" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/user/:userId", checkAuth, async (req, res) => {
  try {
    const post = await PostModel.find({ author: req.params.userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/s/tags", async (req, res) => {
  try {
    const tags = req.query.tags.split(",").map((tag) => tag.toLowerCase());
    const posts = await PostModel.find({ tags: { $in: tags } });
    res.status(200).send({ posts });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/s/search", async (req, res) => {
  const search = req.query.q;
  try {
    const posts = await PostModel.find({
      title: { $regex: search, $options: "i" },
    });
    res.status(200).send({ posts });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/like/:postId", checkAuth, async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;
  try {
    if (postId) {
      await PostModel.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId },
      });
    }
    res.status(200).json({ message: "Like added" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/unlike/:postId", checkAuth, async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;
  try {
    if (postId) {
      await PostModel.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      })
    }
    res.status(200).json({ message: "Like removed" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

export default router;
