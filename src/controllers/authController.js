// import User from "../models/user.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const registerUser = async (req, res) => {
// 	try {
// 		console.log("🟢 Received Register Request:", req.body);

// 		const { name, email, password } = req.body;

// 		if (!name || !email || !password) {
// 			console.log("❌ Missing required fields");
// 			return res.status(400).json({ error: "All fields are required" });
// 		}

// 		const existingUser = await User.findOne({ email });
// 		if (existingUser) {
// 			console.log("❌ User already exists with email:", email);
// 			return res.status(400).json({ error: "Email is already registered" });
// 		}

// 		// ✅ Hash the password before saving
// 		const salt = await bcrypt.genSalt(10);
// 		const hashedPassword = await bcrypt.hash(password, salt);
// 		console.log("🔑 Hashed Password (Before Storing):", hashedPassword);

// 		// ✅ Create a new user
// 		const newUser = new User({ name, email, password: hashedPassword });
// 		await newUser.save();

// 		console.log("✅ User registered successfully!");

// 		// ✅ Generate JWT Token
// 		const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
// 			expiresIn: "7d",
// 		});

// 		// ✅ FIX: Return username in response
// 		res.status(201).json({
// 			message: "User registered successfully!",
// 			token,
// 			userId: newUser._id,
// 			username: newUser.name, // ✅ Ensure username is included
// 		});
// 	} catch (error) {
// 		console.error("🚨 Registration Error:", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// export const loginUser = async (req, res) => {
// 	try {
// 		console.log("🔍 Received Login Request:", req.body);

// 		const { email, password } = req.body;
// 		if (!email || !password) {
// 			console.log("❌ Missing email or password");
// 			return res
// 				.status(400)
// 				.json({ error: "Please provide both email and password" });
// 		}

// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			console.log("❌ No user found with email:", email);
// 			return res.status(400).json({ error: "Invalid email or password" });
// 		}

// 		console.log("✅ User found:", user.email);
// 		console.log("🔐 Stored Hashed Password:", user.password);
// 		console.log("🔑 Attempted Password:", password);

// 		// 🔍 Debug: Check if bcrypt.compare() works
// const debugMatch = await bcrypt.compare(password, user.password);
// console.log("🛠️ Debug Password Match:", debugMatch);


// // 🔍 Manually hash the password to compare
// const testHash = await bcrypt.hash(password, 10);
// console.log("🛠️ Manually Hashed Attempted Password:", testHash);

// 		// ✅ FIXED: Correct password comparison using bcrypt.compare
// 		const isMatch = await bcrypt.compare(password, user.password);

// 		console.log("🔍 Password Match:", isMatch);

// 		if (!isMatch) {
// 			console.log("❌ Passwords do not match");
// 			return res.status(400).json({ error: "Invalid email or password" });
// 		}

// 		// ✅ Generate JWT Token
// 		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
// 			expiresIn: "7d",
// 		});

// 		// ✅ FIX: Return username in response
// 		res.json({ token, userId: user._id, username: user.name });
// 	} catch (error) {
// 		console.error("🚨 Login Error:", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };



import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register User
export const registerUser = async (req, res) => {
	try {
		console.log("🟢 Received Register Request:", req.body);

		const { name, email, password } = req.body;

		// ✅ Validate required fields
		if (!name || !email || !password) {
			console.log("❌ Missing required fields");
			return res.status(400).json({ error: "All fields are required" });
		}

		// ✅ Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			console.log("❌ User already exists with email:", email);
			return res.status(400).json({ error: "Email is already registered" });
		}

		// ✅ Hash the password before saving (ONLY ONCE)
		console.log("🔑 Password Before Hashing:", password);
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		console.log("🔐 Hashed Password:", hashedPassword);

		// ✅ Create and save new user
		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();
		console.log("✅ User registered successfully!");

		// ✅ Generate JWT Token
		const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// ✅ Send response with user data and token
		res.status(201).json({
			message: "User registered successfully!",
			token,
			userId: newUser._id,
			username: newUser.name,
		});
	} catch (error) {
		console.error("🚨 Registration Error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// ✅ Login User
export const loginUser = async (req, res) => {
	try {
		console.log("🔍 Received Login Request:", req.body);

		const { email, password } = req.body;

		// ✅ Validate required fields
		if (!email || !password) {
			console.log("❌ Missing email or password");
			return res
				.status(400)
				.json({ error: "Please provide both email and password" });
		}

		// ✅ Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			console.log("❌ No user found with email:", email);
			return res.status(400).json({ error: "Invalid email or password" });
		}

		console.log("✅ User found:", user.email);
		console.log("🔐 Stored Hashed Password:", user.password);
		console.log("🔑 Attempted Password:", password);

		// ✅ Compare passwords correctly
		const isMatch = await bcrypt.compare(password, user.password);
		console.log("🛠️ Debug Password Match:", isMatch);

		// ✅ If passwords don't match, return error
		if (!isMatch) {
			console.log("❌ Passwords do not match");
			return res.status(400).json({ error: "Invalid email or password" });
		}

		// ✅ Generate JWT Token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// ✅ Send response with user data and token
		res.json({ token, userId: user._id, username: user.name });
	} catch (error) {
		console.error("🚨 Login Error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
