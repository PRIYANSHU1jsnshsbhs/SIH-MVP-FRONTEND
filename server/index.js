// Load environment variables at the very top
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const ipfsRoutes = require("./routes/ipfs");

const app = express();

// Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ipfs", ipfsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running");
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
