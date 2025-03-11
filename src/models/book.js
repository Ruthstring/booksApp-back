import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  googleBooksId: { type: String, required: true, unique: true }, // Google Books API ID
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  coverImage: { type: String }, // URL of the book cover
  description: { type: String },
  publishedYear: { type: Number },
});

export default mongoose.model("Book", BookSchema);