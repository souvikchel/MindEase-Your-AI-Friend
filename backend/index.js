
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const Message = require("./models/Message");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://mind-ease-your-ai-friend.vercel.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.send("MindEase Backend is running successfully!");
});

// Chat with Gemini and save both messages in MongoDB
app.post("/chat", async (req, res) => {
  const { userMessage } = req.body;
  const conversationId =
    typeof req.body.conversationId === "string" &&
    req.body.conversationId.trim()
      ? req.body.conversationId.trim()
      : crypto.randomUUID();

  if (
    typeof userMessage !== "string" ||
    !userMessage.trim() ||
    userMessage.length > 10000
  ) {
    return res.status(400).json({
      error: "Please provide a valid message.",
    });
  }

  try {
    const empatheticPrompt = `
You are a warm, caring, and supportive friend.
Respond naturally, gently, and concisely.
Avoid unnecessary formatting and long explanations.
Acknowledge the user's feelings and offer practical support.

User message: "${userMessage.trim()}"
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: empatheticPrompt }],
          },
        ],
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't think of a reply.";

    // Save the user message and AI reply
    await Message.insertMany([
      {
        conversationId,
        sender: "user",
        text: userMessage.trim(),
      },
      {
        conversationId,
        sender: "assistant",
        text: reply,
      },
    ]);

    res.json({ reply, conversationId });
  } catch (error) {
    console.error(
      "Chat or database error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to process or save your message.",
    });
  }
});

// Retrieve saved messages for a conversation
app.get("/api/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .sort({ createdAt: 1 })
      .limit(500)
      .lean();

    res.json({ messages });
  } catch (error) {
    console.error("Message retrieval error:", error.message);
    res.status(500).json({
      error: "Failed to retrieve messages.",
    });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
