import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Track connection status
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  if (typeof window !== "undefined") {
    console.log("Not connecting to MongoDB on the client");
    return;
  }

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL not found");
  }

  try {
    const db = await mongoose.connect(DATABASE_URL);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
