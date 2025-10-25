import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject, generateText, streamText } from "ai";
import { createGeminiProvider } from "ai-sdk-provider-gemini-cli";
import type { Request, Response } from "express";
import { z } from "zod";
import {
  BASE_PROMPT,
  getSystemPrompt,
  nodeBasePrompt,
  reactBasePrompt,
} from "../lib/prompts.ts";

// OAuth authentication (recommended)
const gemini = createGeminiProvider({
  authType: "oauth-personal",
});

const filesWithCommandsSchema = z.object({
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      language: z.string(),
    })
  ),
  commands: z.array(z.string()),
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateTemplatePrompts = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const model = gemini("gemini-2.5-flash");
    const systemPrompt =
      "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra";
    const { text }: { text: string } = await generateText({
      model,
      prompt,
      system: systemPrompt,
    });

    if (text.trim().toLowerCase() === "react") {
      return res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
        projectType: "react",
      });
    }

    if (text.trim().toLowerCase() === "node") {
      return res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
        projectType: "node",
      });
    }

    return res.status(400).json({
      error: "Invalid project type. Please return either 'node' or 'react'.",
    });
  } catch (error: any) {
    console.error("Error generating template prompts:", error);
    return res.status(500).json({
      error: "Failed to generate template prompts",
      details: error.message,
    });
  }
};

export const generateProject = async (req: Request, res: Response) => {
  try {
    const { messages, model } = req.body;
    const result = streamText({
      model: openrouter.chat(model),
      system: getSystemPrompt(),
      messages,
    });
    console.log(result);
    result.pipeTextStreamToResponse(res);
  } catch (error: any) {
    console.error("Error generating project:", error.message);
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const generateProjectWithGenerateText = async (
  req: Request,
  res: Response
) => {
  try {
    const { messages, model } = req.body;
    const { text }: { text: string } = await generateText({
      // model: openrouter.chat(model),
      model: gemini("gemini-2.5-flash"),
      system: getSystemPrompt(),
      messages,
    });
    return res.json({ steps: text });
  } catch (error: any) {
    console.error("Error generating project:", error.message);
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const generateProjectFiles = async (req: Request, res: Response) => {
  try {
    const {
      initialFiles = [],
      currentFiles = [],
      messages = [],
      model = "gemini-2.5-pro",
    } = req.body;

    // Use currentFiles if provided (for follow-ups), otherwise use initialFiles (first request)
    const projectFiles = currentFiles.length > 0 ? currentFiles : initialFiles;

    // Build context about existing files
    const filesContext =
      projectFiles.length > 0
        ? projectFiles
            .map(
              (file: any) =>
                `File: ${file.path}\n\`\`\`${file.language}\n${file.content}\n\`\`\``
            )
            .join("\n\n")
        : "No files in project yet.";

    // TODO: Figure out how to use shadcn/ui components for styling. then add - "Uses shadcn/ui components with "new-york" style" to PROJECT CONSTRAINTS. and "DO NOT Import shadcn/ui components from @/components/ui/" to RULES.
    const systemPrompt = `You are an expert React developer building modern web applications.

CURRENT PROJECT STATE:
The project currently has the following files:
${filesContext}

PROJECT CONSTRAINTS:
- This is a React + TypeScript + Vite project
- Uses Tailwind CSS v4 with @tailwindcss/vite plugin
- Icons from lucide-react
- Path aliases configured: @/ points to ./src/
- Uses React 19 with modern features
- Donot use shadcn/ui components for styling, use Tailwind CSS instead.

YOUR TASK:
Based on the conversation history and the user's current request, return ONLY the files that need to be:
1. Created (new files)
2. Modified (existing files with updated content)

COMMANDS:
The response schema also supports a 'commands' array (each command is a string). Determine which shell commands need to be executed in the WebContainer to apply this iteration's changes (for example: 'npm install' if package.json changed, or 'npm run dev' when starting the dev server). Return only the commands that are required for this iteration and list them in the exact order they should be run. Do NOT include commands that are not necessary (avoid redundant installs or restarts).

RULES:
- Return complete file content, not diffs or partial code
- Use TypeScript for all .ts and .tsx files
- Follow React best practices and modern patterns
- Use Tailwind CSS classes for styling
- DO NOT Import shadcn/ui components from @/components/ui/
- Use proper TypeScript types
- Keep components modular and reusable
- DO NOT include files that don't need changes
- DO NOT return package.json, tsconfig.json, or vite.config.ts unless explicitly requested
- Use lucide-react for icons
- Ensure all imports are correct with path aliases
- For follow-up requests, understand the context and make incremental changes

FILE STRUCTURE:
- Components go in src/components/
- Pages go in src/pages/
- Utils/helpers in src/lib/
- Types in src/lib/types/
- Hooks in src/hooks/

Return an object with two keys: 'files' (array of file objects with 'path', 'content', 'language') and 'commands' (array of command strings to run in order).`;

    const { object } = await generateObject({
      model: gemini(model),
      schema: filesWithCommandsSchema as z.ZodTypeAny,
      messages: messages,
      system: systemPrompt,
    });

    return res.json({ files: object.files, commands: object.commands });
  } catch (error: any) {
    console.error("Error generating project files:", error.message);
    return res.status(500).json({ errorMessage: error.message });
  }
};
