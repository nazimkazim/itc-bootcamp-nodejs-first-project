import { Router } from "express";
import UserModel from "../models/User.js";
import PostModel from "../models/Post.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = Router();
router.post("/", checkAuth, async (req, res) => {
  try {
    const { title, description, img } = req.body;
    const user = await UserModel.findById(req.user.userId);
    const post = new PostModel({
      title,
      description,
      img,
    });
    await post.save();
    await UserModel.findByIdAndUpdate(user._id, {
        $push: { posts: post },
    });
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/", async (req, res) => {
    try {
        const post = await PostModel.find().populate("author");
        res.status(200).json(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
} );

router.get("/:id", async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id).populate("author");
        res.status(200).json(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

export default router;
