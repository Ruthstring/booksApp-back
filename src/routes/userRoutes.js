// import express from "express";
// import { getUserReadingList, removeBookFromReadingList } from "../controllers/userController.js";
// import {protect} from "../middleware/authMiddleware.js"

// const router = express.Router();

// router.get("/:userId/reading-list", getUserReadingList);
// router.delete("/:userId/reading-list/:bookId", protect, removeBookFromReadingList);

// export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserReadingList,addBookToReadingList, removeBookFromReadingList } from "../controllers/userController.js";

const router = express.Router();

// ✅ Do not require "protect" for GET routes (users can see reading lists without login)
router.get("/:userId/reading-list", getUserReadingList);

router.post("/:userId/reading-list", protect, addBookToReadingList);

// ✅ Keep DELETE protected
router.delete("/:userId/reading-list/:bookId", protect, removeBookFromReadingList);

export default router;