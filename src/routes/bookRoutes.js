

import express from "express";
import { searchBooks, addBookToReadingList, getRandomBook } from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchBooks);
router.post("/:userId/reading-list", protect, addBookToReadingList); // ✅ Moved here
router.get("/random", getRandomBook);

export default router;