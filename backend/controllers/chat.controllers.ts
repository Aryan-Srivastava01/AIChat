import "dotenv/config";
import { convertToModelMessages, streamText } from "ai";
import type { Request, Response } from "express";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const streamChat = async (req: Request, res: Response) => {
  const { messages, model } = req.body;

  console.log("model =", model);

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const chatModel = openrouter.chat(model);

  try {
    const result = streamText({
      model: chatModel,
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
};

export default streamChat;
