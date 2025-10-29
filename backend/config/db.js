const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Read the MongoDB URI from environment; fall back to local default
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/BookIt";
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;