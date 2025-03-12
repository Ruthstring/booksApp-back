

import express from "express";
import { searchBooks, addBookToReadingList } from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchBooks);
router.post("/:userId/reading-list", protect, addBookToReadingList); // ✅ Moved here

export default router;