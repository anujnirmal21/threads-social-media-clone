import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  likeDislikePost,
  replyPost,
  getFeedPost,
  getUserPost,
} from "../controllers/posts.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const postroutes = Router();

postroutes.get("/feed", protectRoute, getFeedPost);
postroutes.post("/create", protectRoute, createPost);
postroutes.get("/:id", getPost);
postroutes.get("/user/:username", getUserPost);
postroutes.delete("/:id", protectRoute, deletePost);
postroutes.put("/like/:id", protectRoute, likeDislikePost);
postroutes.put("/reply/:id", protectRoute, replyPost);

export default postroutes;
