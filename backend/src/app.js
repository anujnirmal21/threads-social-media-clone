import express from "express";
import cookieParser from "cookie-parser";
import userroutes from "./routes/user.routes.js";
import postroutes from "./routes/posts.routes.js";

import cors from "cors";

const app = express();

//middlewares
app.use(cors());
//parse the json data in req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // used to parse into nested object in URL with payload upto 10 mb
app.use(cookieParser()); // parse the cookies from http req headers

//middleware routes
app.use("/api/v1/user", userroutes);
app.use("/api/v1/post", postroutes);

export default app;
