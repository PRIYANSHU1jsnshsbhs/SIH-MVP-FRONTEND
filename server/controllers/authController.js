// Helper to check if profile is complete
function isProfileComplete(user) {
  if (
    !user.personal_info ||
    !user.personal_info.first_name ||
    !user.personal_info.last_name ||
    !user.personal_info.dob ||
    !user.personal_info.gender ||
    !user.personal_info.nationality ||
    !user.personal_info.contact?.email ||
    !user.personal_info.contact?.phone_number
  )
    return false;
  // Add more checks as needed for required fields
  return true;
}

exports.getMe = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      user,
      profileComplete: isProfileComplete(user),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.completeProfile = async (req, res) => {
  const userId = req.userId; // Only use userId from JWT middleware
  const profileData = { ...req.body };
  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No user ID from token." });
  }
  // Remove fields that should not be updated
  delete profileData._id;
  delete profileData.password;
  delete profileData.email;

  // Flatten nested objects for MongoDB dot notation
  function flatten(obj, prefix = "") {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + "." : "";
      if (
        typeof obj[k] === "object" &&
        obj[k] !== null &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, flatten(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  }
  const updateData = flatten(profileData);
  updateData.updated_at = new Date();

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "Profile updated successfully.", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

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
    // Auto-generate a token so the client can call /me and /complete-profile immediately
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ message: "User registered successfully.", token });
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
