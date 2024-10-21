// @ts-nocheck

import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(404)
        .json(new ApiResponse(404, "", "User is Unauthorized"));
    }

    const decode = jwt.verify(token, process.env.JWT_Secret);

    req.userId = decode.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default protectRoute;
