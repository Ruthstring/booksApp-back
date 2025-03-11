import express from "express";

// all the necessary routes
import authRoutes from "./authRoutes.js"
import bookRoutes from "./bookRoutes.js";
import userRoutes from "./userRoutes.js";
import aiRoutes from "./aiRoutes.js";

const router = express.Router();


//Route paths
router.use("/auth",authRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes);
router.use("/ai", aiRoutes);


export default router;