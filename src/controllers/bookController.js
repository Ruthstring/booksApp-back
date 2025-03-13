
import Book from "../models/book.js";
import User from "../models/user.js";


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

// export const getRandomBook = async (req, res) => {
//   try {
//     const count = await Book.countDocuments();
//     const randomIndex = Math.floor(Math.random() * count);
//     const randomBook = await Book.findOne().skip(randomIndex);

//     if (!randomBook) {
//       return res.status(404).json({ error: "No books found" });
//     }
//     console.log("📚 Book Data Sent:", randomBook); 

//     res.json({
//       title: randomBook.title,
//       author: randomBook.author,
//       cover: randomBook.coverImage || "https://via.placeholder.com/150",
//     });
//   } catch (error) {
//     console.error("🚨 Error fetching book:", error);
//     res.status(500).json({ error: "Failed to fetch book" });
//   }
// };


// export const getRandomBook = async (req, res) => {
//   try {
//     const count = await Book.countDocuments();
//     const randomIndex = Math.floor(Math.random() * count);
//     const randomBook = await Book.findOne().skip(randomIndex);

//     if (!randomBook) {
//       return res.status(404).json({ error: "No books found" });
//     }

//     console.log("📚 Book Data Sent:", randomBook);

//     res.json({
//       title: randomBook.title,
//       author: randomBook.author,
//       cover: randomBook.coverImage && randomBook.coverImage.startsWith("http")
//         ? randomBook.coverImage
//         : "https://via.placeholder.com/150", // Use placeholder if cover is missing
//     });
//   } catch (error) {
//     console.error("🚨 Error fetching book:", error);
//     res.status(500).json({ error: "Failed to fetch book" });
//   }
// };




// export const getRandomBook = async (req, res) => {
//   try {
//     const count = await Book.countDocuments();
//     const randomIndex = Math.floor(Math.random() * count);
//     const randomBook = await Book.findOne().skip(randomIndex);

//     if (!randomBook) {
//       return res.status(404).json({ error: "No books found" });
//     }

//     console.log("📚 Book Data Sent:", randomBook);

//     // ✅ Filter out invalid cover images
//     const isValidCover =
//       randomBook.coverImage &&
//       randomBook.coverImage.startsWith("http") &&
//       !randomBook.coverImage.includes("example.com"); // Exclude fake covers

//     const coverImage = isValidCover
//       ? randomBook.coverImage
//       : "https://books.google.com/googlebooks/images/no_cover_thumb.gif"; // Google Books placeholder

//     res.json({
//       title: randomBook.title,
//       author: randomBook.author,
//       cover: coverImage,
//     });
//   } catch (error) {
//     console.error("🚨 Error fetching book:", error);
//     res.status(500).json({ error: "Failed to fetch book" });
//   }
// };


export const getRandomBook = async (req, res) => {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      return res.status(404).json({ error: "No books available" });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomBook = await Book.findOne().skip(randomIndex);

    if (!randomBook) {
      return res.status(404).json({ error: "No books found" });
    }

    console.log("📚 Random Book Selected:", randomBook);

    let coverImage = randomBook.coverImage;

    // ✅ If the cover is missing or invalid, fetch from Google Books API
    if (!coverImage || coverImage.includes("example.com")) {
      console.log("🔍 Fetching book cover from Google Books API...");
      const googleBooksResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(randomBook.title)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
      );

      const googleBook = googleBooksResponse.data.items?.[0]?.volumeInfo;
      if (googleBook?.imageLinks) {
        coverImage =
        
          googleBook.imageLinks.medium ||
          googleBook.imageLinks.large ||
          googleBook.imageLinks.thumbnail ||
          "https://books.google.com/googlebooks/images/no_cover_thumb.gif";
      }
    }

    res.json({
      title: randomBook.title,
      author: randomBook.author,
      cover: coverImage,
    });
  } catch (error) {
    console.error("🚨 Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};
