import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import generateTokenAndSetCookie from "../utils/helper/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import { Post } from "../models/post.model.js";

//Sign Up
const userSignup = asynchandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if ([name, username, email, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, "", "All fields required"));
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    return res
      .status(400)
      .json(new ApiResponse(400, "", "User already exists"));
  }

  if (password && password.length < 6) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "", "Password must be at least 6 characters.")
      );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  if (!newUser) {
    return res
      .status(500)
      .json(new ApiResponse(500, "", "Error while signing up the User!"));
  } else {
    generateTokenAndSetCookie(newUser._id, res);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePhoto: newUser.profilePhoto,
      },
      "User Signed Up successfully."
    )
  );
});

//Login
const userLogin = asynchandler(async (req, res) => {
  const { username, password } = req.body;

  if ([username, password].some((field) => field === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, "", "All fields required"));
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "Invalid username."));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json(new ApiResponse(401, "", "Invalid password."));
  }

  generateTokenAndSetCookie(user._id, res);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePhoto: user.profilePhoto,
      },
      "User Logged In successfully."
    )
  );
});

//Logout
const userLogout = asynchandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("accessToken", { httpOnly: true, maxAge: 1 })
    .json(new ApiResponse(200, "", "User Logged Out successfully."));
});

//Unfollow or Follow the user and Update the User
const userFollowAndUnFollow = asynchandler(async (req, res) => {
  const { id } = req.params;

  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.userId);

  if (!userToModify || !currentUser) {
    return res.status(404).json(new ApiResponse(404, "", "User not found."));
  }

  if (userToModify._id.toString() === currentUser._id.toString()) {
    return res
      .status(400)
      .json(new ApiResponse(400, "", "User cannot follow/unfollow himself"));
  }

  const isFollowing = currentUser.following.includes(id);

  if (isFollowing) {
    await User.findByIdAndUpdate(currentUser._id, { $pull: { following: id } });
    await User.findByIdAndUpdate(id, { $pull: { followers: currentUser._id } });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { unfollowed: userToModify.username },
          "User unfollowed successfully"
        )
      );
  } else {
    await User.findByIdAndUpdate(currentUser._id, { $push: { following: id } });
    await User.findByIdAndUpdate(id, { $push: { followers: currentUser._id } });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { followed: userToModify.username },
          "User followed successfully"
        )
      );
  }
});

//update user details
const userUpdate = asynchandler(async (req, res) => {
  const { name, username, password, email, bio } = req.body;
  let { profilePhoto } = req.body;

  const userId = req.userId;

  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "User not found!"));
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(password, salt);
    user.password = newpassword;
  }

  if (profilePhoto) {
    //delete old photo and upload new one
    if (user.profilePhoto) {
      const publicId = user.profilePhoto.split("/").pop().split(".")[0];

      // Attempt to delete the old profile photo
      await cloudinary.uploader.destroy(`threads-user-avatar/${publicId}`);
    }
    const uploadImgRes = await cloudinary.uploader.upload(profilePhoto, {
      resource_type: "auto",
      folder: "threads-assets/threads-user-avatar",
    });
    profilePhoto = uploadImgRes.secure_url;
  }

  if (name) {
    user.name = name;
  }
  if (username) {
    user.username = username;
  }
  if (email) {
    user.email = email;
  }
  if (profilePhoto) {
    user.profilePhoto = profilePhoto;
  }
  if (bio) {
    user.bio = bio;
  }

  await user.save();

  // Find all posts that this user replied and update username and userProfilePic fields
  await Post.updateMany(
    { "replies.userId": userId },
    {
      $set: {
        "replies.$[item].username": user.username,
        "replies.$[item].userProfilePic": user.profilePic,
      },
    },
    { arrayFilters: [{ "item.userId": userId }] }
  );

  //reset password to null
  user.password = null;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

//get the user profile details
const getUserProfile = asynchandler(async (req, res) => {
  // we can get user as username or userId in query
  const { query } = req.params;
  let user;

  if (mongoose.Types.ObjectId.isValid(query)) {
    //checked if userId is passed in params
    user = await User.findById(query).select("-password -updatedAt");
  } else {
    //checked if username is passed in params
    user = await User.findOne({ username: query }).select(
      "-password -updatedAt"
    );
  }

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "", "User not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const searchUserProfile = asynchandler(async (req, res) => {
  const { query } = req.params;

  if (query || query !== "") {
    const result = { username: { $regex: `^${query}`, $options: "i" } };
    const userProfiles = await User.find(result);

    if (!userProfiles || userProfiles.length === 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "", "No such user with the specified username")
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, userProfiles, "searched successfull..."));
  }
});

export {
  userSignup,
  userLogin,
  userLogout,
  userFollowAndUnFollow,
  userUpdate,
  getUserProfile,
  searchUserProfile,
};
