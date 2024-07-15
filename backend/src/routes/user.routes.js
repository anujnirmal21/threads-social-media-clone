import { Router } from "express";
import {
  userSignup,
  userUpdate,
  userLogin,
  userLogout,
  userFollowAndUnFollow,
  getUserProfile,
} from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
const userroutes = Router();

userroutes.post("/signup", userSignup);
userroutes.post("/login", userLogin);
userroutes.post("/logout", userLogout);
userroutes.post("/follow/:id", protectRoute, userFollowAndUnFollow);
userroutes.put("/update", protectRoute, userUpdate);
userroutes.get("/profile/:query", getUserProfile);

export default userroutes;
