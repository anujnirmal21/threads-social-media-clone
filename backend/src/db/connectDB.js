import mongoose from "mongoose";

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

export default connectDB;
