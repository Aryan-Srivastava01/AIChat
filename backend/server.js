// server.js
import "dotenv/config";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText } from "ai";
import cors from "cors";
import express from "express";

const app = express();
app.use(express.json());

// Allow requests from React frontend
app.use(cors());

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
// Chat models (recommended)
const chatModel = openrouter.chat("anthropic/claude-3.5-sonnet");

// Completion models
const completionModel = openrouter.chat("x-ai/grok-4-fast:free");

//test route
app.get("/", (req, res) => {
  console.log("OpenRouter API Key:", process.env.OPENROUTER_API_KEY);
  console.log("Port:", PORT);
  res.send("Hello World");
});

//Stream Text through AI SDK - compatible with useChat from @ai-sdk/react
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    const result = streamText({
      model: completionModel,
      messages: convertToModelMessages(messages),
    });

    // This streams the response in the format expected by useChat
    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Streaming error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate response" });
    }
  }
});
