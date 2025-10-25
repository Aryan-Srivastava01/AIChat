import { Router } from "express";
import generateImageHandler from "../controllers/image.controller.js";
import { generateImageWithGeminiHandler } from "../controllers/gemini-image-gen.controller.js";

const router = Router();

router.post("/", generateImageHandler);
router.post("/gemini", generateImageWithGeminiHandler);

export default router;
