const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // In serverless, we don't want to exit the process, just throw
    throw error;
  }
};

module.exports = connectDB;