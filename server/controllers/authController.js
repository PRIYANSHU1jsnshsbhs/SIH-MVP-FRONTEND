const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
