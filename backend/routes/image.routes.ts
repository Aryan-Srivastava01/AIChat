import { Router } from "express";
import generateImageHandler from "../controllers/image.controller.ts";

const router = Router();

router.post("/", generateImageHandler);

export default router;