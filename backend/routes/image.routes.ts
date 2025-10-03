import { Router } from "express";
import generateImageHandler from "../controllers/image.controller.ts";
import generateImageWithGeminiHandler from "../controllers/image.controller.ts";

const router = Router();

router.post("/", generateImageHandler);
router.post("/gemini", generateImageWithGeminiHandler);

export default router;