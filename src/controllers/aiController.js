// import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, 
//   });

// // Get AI book recommendations
// export const getAIRecommendations = async (req, res) => {
//     try {
//       const { genre, mood } = req.body;
  
//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: `Suggest a book for someone who likes ${genre} and wants to feel ${mood}.` }],
//         max_tokens: 50,
//       });
  
//       res.json({ recommendation: response.choices[0].message.content });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "AI recommendation failed" });
//     }
//   };


// import axios from "axios";

// export const getAIRecommendations = async (req, res) => {
//   try {
//     const { genre, mood } = req.body;

//     const response = await axios.post(
//       "https://api.deepseek.com/v1/chat/completions", // DeepSeek API URL
//       {
//         model: "deepseek-chat", // Use the free model
//         messages: [
//           { role: "system", content: "You are an AI that recommends books based on mood and genre." },
//           { role: "user", content: `Suggest a book for someone who likes ${genre} and wants to feel ${mood}.` }
//         ],
//         max_tokens: 50
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     res.json({ recommendation: response.data.choices[0].message.content });
//   } catch (error) {
//     console.error("🚨 AI Recommendation Error:", error);
//     res.status(500).json({ error: "AI recommendation failed" });
//   }
// };

import axios from "axios";



export const getAIRecommendations = async (req, res) => {
  try {
    const { genre, mood } = req.body;

    if (!genre || !mood) {
      return res.status(400).json({ error: "Genre and mood are required!" });
    }

    console.log(`🔍 Generating book recommendation for: Genre = ${genre}, Mood = ${mood}`);

    // ✅ Choose a working model (FLAN-T5)
    const model = "google/flan-t5-large"; 

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: `Suggest a book for someone who likes ${genre} and wants to feel ${mood}.`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.length) {
      throw new Error("Empty response from Hugging Face API.");
    }

    const recommendation = response.data[0]?.generated_text || "No recommendation found.";

    console.log("✅ AI Recommendation:", recommendation);
    res.json({ recommendation });

  } catch (error) {
    console.error("🚨 AI Recommendation Error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      res.status(500).json({ error: "Hugging Face model not found. Try a different one." });
    } else if (error.response?.status === 401) {
      res.status(500).json({ error: "Invalid Hugging Face API key." });
    } else {
      res.status(500).json({ error: "AI recommendation failed" });
    }
  }
};