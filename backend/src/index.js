import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connectDB.js";
import { v2 as cloudinary } from "cloudinary";

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
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed \n Error:${error}`);
  });
