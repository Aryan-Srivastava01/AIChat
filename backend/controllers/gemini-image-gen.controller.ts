import { google } from "@ai-sdk/google";
import { GoogleGenerativeAIImageProviderOptions } from "@ai-sdk/google";
import { experimental_generateImage as generateImage } from "ai";
import { Request, Response } from "express";

export const generateImageWithGeminiHandler = async (
  req: Request,
  res: Response
) => {
  const { prompt } = req.body;
  const { image } = await generateImage({
    model: google.image("gemini-2.0-flash-preview-image-generation"),
    prompt: prompt,
    aspectRatio: "16:9",
  });

  res.status(200).json({ image: image });
};

export default generateImageWithGeminiHandler;
