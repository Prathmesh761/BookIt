const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  }));
app.use(cookieParser());
// Debug middleware to log request body
app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test Route
app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "API is running and MongoDB is connected!",
      timestamp: new Date().toISOString(),
    });
});

//routes for authentication
app.use("/api/auth", authRoutes);

//routes for bookings
app.use("/api/bookings", bookingRoutes);

// Debug middleware for experiences route
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

