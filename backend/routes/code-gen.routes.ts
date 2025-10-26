import { Router } from "express";
import {
  generateProject,
  generateProjectFiles,
  generateProjectWithGenerateText,
  generateTemplatePrompts,
} from "../controllers/code-gen.controller.js";

const router = Router();

router.post("/template-prompts", generateTemplatePrompts);
router.post("/generate-project", generateProject);
router.post(
  "/generate-project-with-generate-text",
  generateProjectWithGenerateText
);
router.post("/generate-project-files", generateProjectFiles);

export default router;
