import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

// Connect to Database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors()); // Enable CORS

// Use All Routes from /routes/index.js
app.use("/api", routes);

// Root Route (Health Check)
app.get("/", (req, res) => {
  res.json({ message: " API is running!" });
});

export default app;