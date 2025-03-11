import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, favoriteGenres } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "User already exists" });

//     const newUser = new User({ name, email, password, favoriteGenres });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Login User & Generate JWT Token
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     res.json({ token, userId: user._id });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// ✅ Register a new user
export const registerUser = async (req, res) => {
  try {
    console.log("🟢 Received Register Request:", req.body);

    const { name, email, password, favoriteGenres } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists with email:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    // ✅ Create a new user
    const newUser = new User({ name, email, password, favoriteGenres });
    await newUser.save();

    console.log("✅ User registered successfully!");
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("🚨 Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Login User & Generate JWT Token
export const loginUser = async (req, res) => {
  try {
    console.log("🔍 Received Login Request:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ error: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔐 Stored Hashed Password:", user.password);
    console.log("🔑 Attempted Password:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ Login Successful! Token generated:", token);
    res.json({ token, userId: user._id });

  } catch (error) {
    console.error("🚨 Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
