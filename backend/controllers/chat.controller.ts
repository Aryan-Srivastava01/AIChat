import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText } from "ai";
import "dotenv/config";
import type { Request, Response } from "express";
import gemini from "../helpers/geminiCliProvider.ts";

const streamChat = async (req: Request, res: Response) => {
  const { messages, model, provider } = req.body;

  console.log("model =", model);

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const chatModel =
    provider === "gemini-cli" ? gemini(model) : openrouter.chat(model);

  try {
    console.log("Calling streamText...");
    const result = streamText({
      model: chatModel,
      messages: convertToModelMessages(messages),
    });

    console.log("Piping stream to response...");
    if (provider === "gemini-cli") {
      // Avoid UI message part IDs for gemini-cli; stream plain text
      result.pipeTextStreamToResponse(res);
    } else {
      // Default path for providers compatible with UI message stream
      result.pipeUIMessageStreamToResponse(res);
    }
    console.log("Stream finished and response closed.");
  } catch (error) {
    console.error("Streaming error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate response" });
    }
  }
};

export default streamChat;
