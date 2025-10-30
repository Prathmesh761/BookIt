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

// Configure CORS: allow origin(s) from env var FRONTEND_URL (comma-separated),
// or fallback to localhost for local dev. Use '*' to allow any origin (use with caution).
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. curl, server-to-server) which have no origin
    if (!origin) return callback(null, true);

    if (FRONTEND_URL === '*') return callback(null, true);

    const allowed = FRONTEND_URL.split(',').map((s) => s.trim());
    if (allowed.includes(origin)) return callback(null, true);

    return callback(new Error('CORS policy: This origin is not allowed'));
  },
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
  console.log(`📱 Frontend URL(s): ${FRONTEND_URL}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

