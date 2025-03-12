
import User from "../models/user.js";
import Book from "../models/book.js";

// ✅ Get User's Reading List (with user existence check)
export const getUserReadingList = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("readingList.bookId");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.readingList);
  } catch (error) {
    console.error("Error fetching reading list:", error);
    res.status(500).json({ error: "Failed to get reading list" });
  }
};

// ✅ Add Book to Reading List (with duplication prevention & user authentication)
export const addBookToReadingList = async (req, res) => {
  try {
    const { userId } = req.params;
    const { googleBooksId, title, author, coverImage, description, publishedYear } = req.body;

    // ✅ Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Check if book already exists in DB
    let book = await Book.findOne({ googleBooksId });
    if (!book) {
      book = new Book({ googleBooksId, title, author, coverImage, description, publishedYear });
      await book.save();
    }

    // ✅ Check if the book is already in the reading list
    const alreadyInList = user.readingList.some((item) => item.bookId.toString() === book._id.toString());
    if (alreadyInList) {
      return res.status(400).json({ error: "Book is already in the reading list" });
    }

    // ✅ Add book to reading list
    user.readingList.push({ bookId: book._id });
    await user.save();

    res.json({ message: "Book added to reading list!" });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
};

// ✅ Remove Book from Reading List (with user existence check)
export const removeBookFromReadingList = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    // ✅ Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Remove book from reading list
    user.readingList = user.readingList.filter((item) => item.bookId.toString() !== bookId);
    await user.save();

    res.json({ message: "Book removed from reading list" });
  } catch (error) {
    console.error("Error removing book:", error);
    res.status(500).json({ error: "Failed to remove book" });
  }
};