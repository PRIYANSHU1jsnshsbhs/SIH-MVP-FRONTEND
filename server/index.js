const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/auth-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
