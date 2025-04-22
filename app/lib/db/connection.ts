import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

// Track connection status
let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not defined");
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
};
