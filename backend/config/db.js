import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const createConnection = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in .env file");
    }

    /*Set up the connection  and Define the mongodb connectin url*/

    await mongoose.connect(mongoUrl);

    console.log("✅ Connected to MongoDB server");

    /* It define an object which responsible to perform some action */
    const db = mongoose.connection;

    db.on("disconnected", () => {
      console.log("⚠️ Disconnected from MongoDB");
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // agar error aaye to process band kar de (optional)
  }
};
