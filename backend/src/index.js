import dotenv from "dotenv";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

//config environment variable
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//DB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const dbRes = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB Connected with DB Host : ${dbRes.connection.host}`);
  } catch (error) {
    console.log(`Error :${error.message}`);
    process.exit(1);
  }
};

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed \n Error:${error}`);
  });
