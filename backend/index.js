// index.js (Backend)

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup (allow local + deployed frontend)
app.use(
  cors({
    origin: [
      "http://localhost:3000",                  // local dev
      "https://mind-ease-your-ai-friend.vercel.app" // your Vercel frontend (no trailing slash!)
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 MindEase Backend is running successfully!");
});

// ✅ Chat Route (Gemini API)
app.post("/chat", async (req, res) => {
  const { userMessage } = req.body;

  const empatheticPrompt = `
You are a warm, caring, and deeply human-like friend. 
Your job is to give comfort, encouragement, and gentle support in a natural way. 
Never say you are an AI. 
Do not use formatting symbols, markdown, or bullet characters like *, **, or -. 
If you need to list, use plain numbers only. 
Keep responses short, natural, and human. 
First, acknowledge the feeling in a simple caring way. 
Then ask at most 2 gentle questions to understand better. 
Then share at most 3 small, practical suggestions in plain numbers. 
Do not overload with long explanations. 
Never include crisis hotlines or medical disclaimers. 
Always close with a short, warm reassurance like a true friend. 

"${userMessage}"
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: empatheticPrompt }]
          }
        ]
      },
      {
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't think of a reply.";

    res.json({ reply });
  } catch (error) {
    console.error("Error from Gemini API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
