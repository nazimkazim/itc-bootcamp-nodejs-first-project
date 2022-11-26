import { Router } from "express";
import UserModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkAuth } from "../utils/checkAuth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const isUser = await UserModel.findOne({ email, username });
    if (isUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await savedUser.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await UserModel.findOne({ email, username }).lean();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("access_token", token, {httpOnly:true})
    .status(200).json({token, user: {
      ...user,
      password: null,
    }, message:"User logged in"});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/currentUser",checkAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {expiresIn: "1h",});

    res.json({ user,token, message: "User found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
