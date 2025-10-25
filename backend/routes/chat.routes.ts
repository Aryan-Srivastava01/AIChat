import { Router } from "express";
import streamChat from "../controllers/chat.controller.ts";

const router = Router();

router.post("/", streamChat);

export default router;
