
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fallbacksPath = path.join(__dirname, "../data/fallbacks.json");

let fallbackCache = null;

// Normalize for matching
function normalize(str) {
	return str.toLowerCase().trim();
}

// Load fallback JSON (once)
async function getFallbackRecommendation(genre, mood) {
	if (!fallbackCache) {
		const raw = await fs.readFile(fallbacksPath, "utf-8");
		fallbackCache = JSON.parse(raw);
	}

	return fallbackCache.find(
		(entry) =>
			normalize(entry.genre) === normalize(genre) &&
			normalize(entry.mood) === normalize(mood)
	);
}

export const getAIRecommendations = async (req, res) => {
	try {
		const { genre, mood } = req.body;
		if (!genre || !mood)
			return res.status(400).json({ error: "Genre and mood are required!" });

		console.log(`🔍 Generating book recommendation for: Genre = ${genre}, Mood = ${mood}`);

		const model = "gpt2";

		const aiResponse = await axios.post(
			`https://api-inference.huggingface.co/models/${model}?wait_for_model=true`,
			{
				inputs: `Suggest a book for someone who likes ${genre} and feels ${mood}.`,
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
					"Content-Type": "application/json",
				},
				timeout: 30000,
			}
		);

		const generatedText = aiResponse.data[0]?.generated_text?.trim();
		if (!generatedText) throw new Error("No text generated");

		console.log("✅ AI Recommended Title:", generatedText);

		const googleResponse = await axios.get(
			`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
				generatedText
			)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
		);

		const bookData = googleResponse.data?.items?.[0]?.volumeInfo;
		if (!bookData) throw new Error("No book found from Google");

		// Fallback cover check
		let coverUrl =
			bookData.imageLinks?.thumbnail ||
			"https://books.google.com/googlebooks/images/no_cover_thumb.gif";

		if (
			coverUrl.includes("no_cover_thumb") ||
			coverUrl.includes("default_cover") ||
			coverUrl.includes("books.google.com")
		) {
			coverUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(
				bookData.title
			)}-L.jpg`;
		}

		const bookDetails = {
			title: bookData.title || generatedText,
			author: bookData.authors?.join(", ") || "Unknown",
			cover: coverUrl,
			description: bookData.description || "No description available.",
		};

		console.log("📚 Final Book Recommendation:", bookDetails);
		res.json(bookDetails);
	} catch (error) {
		console.warn("⚠️ Falling back to static recommendation...");

		const { genre, mood } = req.body;
		const match = await getFallbackRecommendation(genre, mood);

		if (!match) {
			return res.status(500).json({
				error: "AI and fallback failed. Please try again later.",
			});
		}

		let coverUrl;

		try {
			const googleRes = await axios.get(
				`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
					match.book_title
				)}&inauthor=${encodeURIComponent(match.author)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
			);

			coverUrl =
				googleRes.data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail ||
				"https://books.google.com/googlebooks/images/no_cover_thumb.gif";

			if (
				coverUrl.includes("no_cover_thumb") ||
				coverUrl.includes("default_cover") ||
				coverUrl.includes("books.google.com")
			) {
				coverUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(
					match.book_title
				)}-L.jpg`;
			}
		} catch {
			coverUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(
				match.book_title
			)}-L.jpg`;
		}

		const fallbackBook = {
			title: match.book_title,
			author: match.author,
			cover: coverUrl,
			description:
				"We ran out of free tokens for AI recommendations. Here’s a hand-picked book recommendation alternative for you!",
		};

		res.json(fallbackBook);
	}
};