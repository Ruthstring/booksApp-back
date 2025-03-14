import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    
        // ✅ MVP Feature: User’s favorite genres
        favoriteGenres: [{ type: String }], // Example: ["Fantasy", "Sci-Fi"]
    
        // ✅ MVP Feature: User’s reading list (Books added from AI recommendations)
        readingList: [
          {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }, // References Book model
            addedAt: { type: Date, default: Date.now },
          }
        ],
    
        // 🔄 Future Feature: Books already read
        completedBooks: [
          {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
            finishedAt: { type: Date, default: Date.now },
          }
        ],
    
        // ✅ Future Practice: Ratings stored inside User model
        ratings: [
          {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }, // Link to rated book
            rating: { type: Number, min: 1, max: 5 }, // Rating between 1-5
            review: { type: String }, // Optional user review
            ratedAt: { type: Date, default: Date.now } // Date when rated
          }
        ],

        // ✅ Plan for Future: Last login timestamp
        lastLogin: { type: Date, default: Date.now },
      },
      { timestamps: true }
);

export default mongoose.model("User", UserSchema);