

// import axios from "axios";



// export const getAIRecommendations = async (req, res) => {
//   try {
//     const { genre, mood } = req.body;

//     if (!genre || !mood) {
//       return res.status(400).json({ error: "Genre and mood are required!" });
//     }

//     console.log(`🔍 Generating book recommendation for: Genre = ${genre}, Mood = ${mood}`);

//     // ✅ Choose a working model (FLAN-T5)
//     const model = "google/flan-t5-large"; 

//     const response = await axios.post(
//       `https://api-inference.huggingface.co/models/${model}`,
//       {
//         inputs: `Suggest a book for someone who likes ${genre} and wants to feel ${mood}.`
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.data || !response.data.length) {
//       throw new Error("Empty response from Hugging Face API.");
//     }

//     const recommendation = response.data[0]?.generated_text || "No recommendation found.";

//     console.log("✅ AI Recommendation:", recommendation);
//     res.json({ recommendation });

//   } catch (error) {
//     console.error("🚨 AI Recommendation Error:", error.response?.data || error.message);

//     if (error.response?.status === 404) {
//       res.status(500).json({ error: "Hugging Face model not found. Try a different one." });
//     } else if (error.response?.status === 401) {
//       res.status(500).json({ error: "Invalid Hugging Face API key." });
//     } else {
//       res.status(500).json({ error: "AI recommendation failed" });
//     }
//   }
// };


// import axios from "axios";

// export const getAIRecommendations = async (req, res) => {
//   try {
//     const { genre, mood } = req.body;

//     if (!genre || !mood) {
//       return res.status(400).json({ error: "Genre and mood are required!" });
//     }

//     console.log(`🔍 Generating book recommendation for: Genre = ${genre}, Mood = ${mood}`);

//     // ✅ Choose a working model (FLAN-T5)
//     const model = "google/flan-t5-large"; 

//     const response = await axios.post(
//       `https://api-inference.huggingface.co/models/${model}`,
//       {
//         inputs: `Suggest a book for someone who likes ${genre} and wants to feel ${mood}. Provide the title, author, a brief description, and a popular book cover link if possible.`,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.data || !response.data.length) {
//       throw new Error("Empty response from Hugging Face API.");
//     }

//     const rawRecommendation = response.data[0]?.generated_text || "No recommendation found.";

//     console.log("✅ Raw AI Recommendation:", rawRecommendation);

//     // ✅ Simple Parsing (Assumes AI returns formatted response)
//     const parsedRecommendation = parseAIResponse(rawRecommendation);

//     console.log("📚 Parsed Recommendation:", parsedRecommendation);

//     res.json(parsedRecommendation);

//   } catch (error) {
//     console.error("🚨 AI Recommendation Error:", error.response?.data || error.message);

//     if (error.response?.status === 404) {
//       res.status(500).json({ error: "Hugging Face model not found. Try a different one." });
//     } else if (error.response?.status === 401) {
//       res.status(500).json({ error: "Invalid Hugging Face API key." });
//     } else {
//       res.status(500).json({ error: "AI recommendation failed" });
//     }
//   }
// };

// // ✅ Helper function to format AI response
// const parseAIResponse = (rawText) => {
//   const titleMatch = rawText.match(/Title: (.+)/i);
//   const authorMatch = rawText.match(/Author: (.+)/i);
//   const descriptionMatch = rawText.match(/Description: (.+)/i);
//   const coverMatch = rawText.match(/Cover: (https?:\/\/[^\s]+)/i); // Extracts URL

//   return {
//     title: titleMatch ? titleMatch[1] : "Unknown Title",
//     author: authorMatch ? authorMatch[1] : "Unknown Author",
//     description: descriptionMatch ? descriptionMatch[1] : "No description available.",
//     cover: coverMatch ? coverMatch[1] : "https://books.google.com/googlebooks/images/no_cover_thumb.gif", // Default fallback image
//   };
// };


// import axios from "axios";

// // ✅ AI Book Recommendation Controller
// export const getAIRecommendations = async (req, res) => {
//   try {
//     const { genre, mood } = req.body;

//     if (!genre || !mood) {
//       return res.status(400).json({ error: "Genre and mood are required!" });
//     }

//     console.log(`🔍 Generating book recommendation for: Genre = ${genre}, Mood = ${mood}`);

//     // ✅ AI Model (FLAN-T5 for text generation)
//     const model = "google/flan-t5-large";

//     const aiResponse = await axios.post(
//       `https://api-inference.huggingface.co/models/${model}`,
//       {
//         inputs: `Suggest a book for someone who likes ${genre} and wants to feel ${mood}.`,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!aiResponse.data || !aiResponse.data.length) {
//       throw new Error("Empty response from Hugging Face API.");
//     }

//     const recommendedTitle = aiResponse.data[0]?.generated_text || "No recommendation found.";

//     console.log("✅ AI Recommended Title:", recommendedTitle);

//     // ✅ Fetch book details from Google Books API
//     const googleResponse = await axios.get(
//       `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(recommendedTitle)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
//     );

//     if (!googleResponse.data.items || googleResponse.data.items.length === 0) {
//       return res.status(404).json({ error: "No book found for the recommendation." });
//     }

//     const bookData = googleResponse.data.items[0].volumeInfo;
//     const bookDetails = {
//       title: bookData.title || recommendedTitle,
//       author: bookData.authors ? bookData.authors.join(", ") : "Unknown",
//       cover: bookData.imageLinks?.medium || bookData.imageLinks?.thumbnail || "https://books.google.com/googlebooks/images/no_cover_thumb.gif",
//       description: bookData.description || "No description available.",
//     };

//     console.log("📚 Final Book Recommendation:", bookDetails);
//     res.json(bookDetails);

//   } catch (error) {
//     console.error("🚨 AI Recommendation Error:", error.response?.data || error.message);

//     if (error.response?.status === 404) {
//       res.status(500).json({ error: "Hugging Face model or Google Books data not found." });
//     } else if (error.response?.status === 401) {
//       res.status(500).json({ error: "Invalid API key." });
//     } else {
//       res.status(500).json({ error: "AI recommendation failed." });
//     }
//   }
// };


import axios from 'axios';

export const getAIRecommendations = async (req, res) => {
  try {
    const { genre, mood } = req.body;

    if (!genre || !mood) {
      return res.status(400).json({ error: 'Genre and mood are required!' });
    }

    console.log(`🔍 Generating book recommendation for: Genre = ${genre}, Mood = ${mood}`);

    // GPT-2 Model Endpoint
    const model = 'gpt2';

    // Hugging Face Inference API URL
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

    // Prompt for the model
    const prompt = `Suggest a book for someone who enjoys ${genre} and is feeling ${mood}.`;

    // Request to Hugging Face Inference API
    // const aiResponse = await axios.post(
    //   apiUrl,
    //   { inputs: prompt },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

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
      }
    );

    if (!aiResponse.data || !aiResponse.data.length) {
      throw new Error('Empty response from Hugging Face API.');
    }

    const recommendedTitle = aiResponse.data[0]?.generated_text.trim() || 'No recommendation found.';

    console.log('✅ AI Recommended Title:', recommendedTitle);

    // Fetch book details from Google Books API
    const googleResponse = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(recommendedTitle)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );

    if (!googleResponse.data.items || googleResponse.data.items.length === 0) {
      return res.status(404).json({ error: 'No book found for the recommendation.' });
    }

    const bookData = googleResponse.data.items[0].volumeInfo;
    const bookDetails = {
      title: bookData.title || recommendedTitle,
      author: bookData.authors ? bookData.authors.join(', ') : 'Unknown',
      cover: bookData.imageLinks?.thumbnail || 'https://books.google.com/googlebooks/images/no_cover_thumb.gif',
      description: bookData.description || 'No description available.',
    };

    console.log('📚 Final Book Recommendation:', bookDetails);
    res.json(bookDetails);

  } catch (error) {
    console.error('🚨 AI Recommendation Error:', error.response?.data || error.message);

    if (error.response?.status === 404) {
      res.status(500).json({ error: 'Hugging Face model or Google Books data not found.' });
    } else if (error.response?.status === 401) {
      res.status(500).json({ error: 'Invalid API key.' });
    } else {
      res.status(500).json({ error: 'AI recommendation failed.' });
    }
  }
};