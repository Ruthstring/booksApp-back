
import Book from "../models/book.js";
import User from "../models/user.js";

// //Search with Api by title or author

// export const searchBooks = async (req, res) => {
//     try {
//       const query = req.query.query;
//       if (!query) return res.status(400).json({ error: "Search query is required" });
  
//       const response = await axios.get(
//         `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
//       );
  
//       const books = response.data.items.map((book) => ({
//         googleBooksId: book.id,
//         title: book.volumeInfo.title,
//         author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
//         coverImage: book.volumeInfo.imageLinks?.thumbnail || "",
//         description: book.volumeInfo.description || "No description available",
//         publishedYear: book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.split("-")[0] : "Unknown",
//       }));
  
//       res.json(books);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch books" });
//     }
//   };
  
//   // Add book to user's reading list
//   export const addBookToReadingList = async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const { googleBooksId, title, author, coverImage, description, publishedYear } = req.body;
  
//       let book = await Book.findOne({ googleBooksId });
//       if (!book) {
//         book = new Book({ googleBooksId, title, author, coverImage, description, publishedYear });
//         await book.save();
//       }
  
//       await User.findByIdAndUpdate(userId, { $push: { readingList: { bookId: book._id } } });
  
//       res.json({ message: "Book added to reading list!" });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to add book" });
//     }
//   };

import axios from "axios";

// ✅ Search books using Google Books API
export const searchBooks = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Search query is required" });

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );

    const books = response.data.items.map((book) => ({
      googleBooksId: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
      coverImage: book.volumeInfo.imageLinks?.thumbnail || "",
      description: book.volumeInfo.description || "No description available",
      publishedYear: book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.split("-")[0] : "Unknown",
    }));

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// ✅ Add Book to User's Reading List
export const addBookToReadingList = async (req, res) => {
  try {
    const { userId } = req.params;
    const { googleBooksId, title, author, coverImage, description, publishedYear } = req.body;

    // ✅ Ensure user exists
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

    // ✅ Check if the book is already in the user's reading list
    const alreadyInList = user.readingList.some((item) => item.bookId.toString() === book._id.toString());
    if (alreadyInList) {
      return res.status(400).json({ error: "Book is already in the reading list" });
    }

    // ✅ Add book to user's reading list
    user.readingList.push({ bookId: book._id });
    await user.save();

    res.json({ message: "Book added to reading list!" });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
};

