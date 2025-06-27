import dotenv from "dotenv";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import path from "path";
import express from "express";

//config environment variable
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;
const _dir = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//DB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const dbRes = await mongoose.connect(" mongodb+srv://anuj:anuj123@threads-cluster.vpbb5vh.mongodb.net/threads?retryWrites=true&w=majority&appName=threads-cluster");

    console.log(`MongoDB Connected with DB Host : ${dbRes.connection.host}`);
  } catch (error) {
    console.log(`Error :${error.message}`);
    process.exit(1);
  }
};

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dir, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dir, "frontend", "dist", "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed \n Error:${error}`);
  });
