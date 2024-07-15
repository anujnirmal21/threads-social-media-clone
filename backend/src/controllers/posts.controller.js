import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = asynchandler(async (req, res) => {
  const { postedBy, postText } = req.body;
  let { postImage } = req.body;

  if (!postedBy || !postText) {
    return res
      .status(400)
      .json(new ApiResponse(400, "", "All fields required"));
  }

  const user = await User.findById(postedBy);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "User not found!"));
  }

  if (user._id.toString() !== req.userId) {
    return res
      .status(403)
      .json(new ApiResponse(403, "", "User not authorized to create post."));
  }

  if (postImage) {
    const uploadImgRes = await cloudinary.uploader.upload(postImage, {
      resource_type: "auto",
      folder: "threads-assets/threads-user-posts",
    });
    postImage = uploadImgRes.secure_url;
  }

  const minLength = 300;
  if (postText.length > minLength) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "",
          `Text must be less than ${minLength} characters.`
        )
      );
  }

  const newPost = new Post({ postedBy, postText, postImage });

  await newPost.save();

  res
    .status(201)
    .json(new ApiResponse(201, newPost, "Post created successfully"));
});

const getPost = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new ApiResponse(400, "", "Invalid post ID"));
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json(new ApiResponse(404, "", "Post not found!"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully."));
});

const deletePost = asynchandler(async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const user = await User.findById(userId);
  const post = await Post.findById(id);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "User not found!"));
  }
  if (!post) {
    return res.status(404).json(new ApiResponse(404, "", "Post not found!"));
  }

  if (post.postedBy.toString() !== userId) {
    return res
      .status(403)
      .json(new ApiResponse(403, "", "User not authorized."));
  }

  await Post.deleteOne({ _id: post._id });

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Post deleted successfully."));
});

const likeDislikePost = asynchandler(async (req, res) => {
  const userId = req.userId;
  const { id: postId } = req.params;

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "User not found!"));
  }
  if (!post) {
    return res.status(404).json(new ApiResponse(404, "", "Post not found!"));
  }

  const userLiked = post.likes.includes(userId);

  if (userLiked) {
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: user.username },
          "Post disliked successfully."
        )
      );
  } else {
    post.likes.push(userId);
    await post.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: user.username, likes: post.likes.length },
          "Post liked successfully."
        )
      );
  }
});

const replyPost = asynchandler(async (req, res) => {
  const userId = req.userId;
  const { id: postId } = req.params;

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "User not found!"));
  }
  if (!post) {
    return res.status(404).json(new ApiResponse(404, "", "Post not found!"));
  }

  const { text } = req.body;
  const { username, profilePhoto } = user;

  if (!text) {
    return res
      .status(400)
      .json(new ApiResponse(400, "", "Text field is required"));
  }

  const reply = { userId, text, userProfilePhoto: profilePhoto, username };

  post.replies.push(reply);
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, reply, "Reply added successfully."));
});

const getFeedPost = asynchandler(async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "User not found!"));
  }

  const following = user.following;
  const posts = await Post.find({ postedBy: { $in: following } }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "User feed fetched successfully."));
});

const getUserPost = asynchandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user)
    return res.status(400).json(new ApiResponse(404, "", "User not found!"));

  const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

  if (!posts)
    return res.status(404).json(new ApiResponse(404, "", "User has no posts."));

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "User posts fetched successfully"));
});

export {
  createPost,
  getPost,
  deletePost,
  likeDislikePost,
  replyPost,
  getFeedPost,
  getUserPost,
};
