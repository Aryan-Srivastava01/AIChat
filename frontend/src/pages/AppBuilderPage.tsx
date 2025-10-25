import FilesWithCode from "@/components/file-systems/FilesWithCode";
import Steps from "@/components/steps/Steps";
import { Button } from "@/components/ui/button";
import { getStepsFromResponse } from "@/lib/helpers/getStepsFromResponse";
import { FileItem, Step } from "@/lib/types/stepsTypes";
import type { FileSystemTree, WebContainer } from "@webcontainer/api";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/loaders/Loader";
import languageFromPath from "../lib/helpers/languageFromPath";
import { cn } from "../lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const model = "gemini-2.5-flash";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AppBuilderPage = ({
  webContainer,
}: {
  webContainer: WebContainer | null;
}) => {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [wholeProjectGenerated, setWholeProjectGenerated] = useState(false);
  const [animatedPlaceholder, setAnimatedPlaceholder] =
    useState<string>("Build app with AI");
  const [iFrameSrc, setIFrameSrc] = useState<string>("");
  const [viewMode, setViewMode] = useState<"files" | "preview">("files");
  const [llmMessages, setLlmMessages] = useState<Message[]>([]);

  // Listening for web container server to start
  webContainer?.on("server-ready", (port: number, url: string) =>
    setIFrameSrc(url)
  );

  async function mountFilesToWebContainer(
    webContainer: WebContainer | null,
    files: { path: string; content: string; language?: string }[]
  ) {
    if (!webContainer || files.length === 0) return;

    const tree: FileSystemTree = {};

    for (const f of files) {
      // normalize path and split into parts
      const normalized = f.path.replace(/^\/+/, "");
      const parts = normalized.split("/").filter(Boolean);
      if (parts.length === 0) continue;

      let cursor: any = tree;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;

        if (isFile) {
          // set a file node
          cursor[part] = {
            file: {
              contents: f.content,
            },
          };
        } else {
          // ensure directory node exists, then descend
          cursor[part] = cursor[part] || { directory: {} };
          cursor = cursor[part].directory;
        }
      }
    }

    // Mount the constructed file tree at root
    await webContainer.mount(tree);
  }

  useEffect(() => {
    console.log("files changed");
    console.log("files =", files);
    if (!webContainer || files.length === 0 || !wholeProjectGenerated) return;
    (async () => {
      try {
        await mountFilesToWebContainer(webContainer, files);
        (async function startDevServer() {
          const installProcess = await webContainer.spawn("npm", ["install"]);

          installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                console.log(data);
              },
            })
          );

          const installExitCode = await installProcess.exit;

          if (installExitCode !== 0) {
            throw new Error("Unable to run npm install");
          }

          // `npm run dev`
          await webContainer.spawn("npm", ["run", "dev"]);
        })();
      } catch (err) {
        console.error("Mount error:", err);
      }
    })();
  }, [webContainer, files]);

  const handleGenerate = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    // If the prompt is empty, don't generate the code
    if (!prompt.trim()) return;

    // Generate the code
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/generate-code/template-prompts`,
        {
          prompt,
        }
      );
      const { prompts, uiPrompts, projectType } = response.data;

      setSteps(getStepsFromResponse(uiPrompts[0]));
      setSteps((curr) =>
        curr.map((step) => ({ ...step, status: "completed" }))
      );

      setLlmMessages([
        ...[...prompts, prompt].map((content) => {
          return {
            role: "user" as const,
            content,
          };
        }),
      ]);

      const stepsResponse = await axios.post(
        `${API_BASE_URL}/api/generate-code/generate-project-with-generate-text`,
        {
          messages: [...prompts, prompt].map((content) => {
            return {
              role: "user",
              content,
            };
          }),
          model,
        }
      );

      setSteps((curr) => [
        ...curr,
        ...getStepsFromResponse(stepsResponse.data.steps),
      ]);
      setSteps((curr) =>
        curr.map((step) => ({ ...step, status: "completed" }))
      );
      setLlmMessages([
        ...llmMessages,
        {
          role: "assistant",
          content: stepsResponse.data.steps,
        },
      ]);
      setWholeProjectGenerated(true);
      setPrompt(""); // Clear the prompt after generating the code
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectUpdate = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const stepsResponse = await axios.post(
        `${API_BASE_URL}/api/generate-code/generate-project-with-generate-text`,
        {
          messages: [...llmMessages, { role: "user", content: prompt }],
          model,
        }
      );

      setSteps((curr) => [
        ...curr,
        ...getStepsFromResponse(stepsResponse.data.steps),
      ]);
      setSteps((curr) =>
        curr.map((step) => ({ ...step, status: "completed" }))
      );
      setLlmMessages([
        ...llmMessages,
        {
          role: "assistant",
          content: stepsResponse.data.steps,
        },
      ]);
      setWholeProjectGenerated(true);
      setPrompt(""); // Clear the prompt after generating the code
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Steps changed");
    console.log("steps =", steps);
    // Only build files after the whole project is generated
    if (!wholeProjectGenerated) return;

    // Collect create-file steps and deduplicate by path, keeping the last occurrence
    const createFileSteps = steps.filter(
      (step) => step.type === "CreateFile" && step.path
    );

    const seen = new Set<string>();
    const uniqueFilesReversed: FileItem[] = [];

    // Iterate from end to start so later edits override earlier template files
    for (let i = createFileSteps.length - 1; i >= 0; i--) {
      const s = createFileSteps[i];
      const p = s.path || "";
      if (!seen.has(p)) {
        seen.add(p);
        uniqueFilesReversed.push({
          path: p,
          content: s.code || "",
          language: languageFromPath(p || "index.tsx"),
        });
      }
    }

    // Restore original order (top-to-bottom) after deduplication
    const uniqueFiles = uniqueFilesReversed.reverse();

    setFiles(uniqueFiles);
  }, [steps, wholeProjectGenerated]);

  if (!webContainer)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen flex w-full max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl h-full pb-10">
      {steps.length > 0 && (
        <aside className="w-1/4 border-r border-[color:var(--color-sidebar-border)] p-4 bg-[var(--color-sidebar)] max-h-screen h-full overflow-y-auto rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[color:var(--color-sidebar-foreground)]">
            Steps
          </h2>
          <Steps steps={steps} />
        </aside>
      )}

      <main className="flex flex-col gap-4 w-full h-full p-6 bg-sidebar rounded-lg">
        <form
          className="flex items-center justify-center h-max"
          onSubmit={(e) => {
            e.preventDefault();
            if (wholeProjectGenerated) {
              return handleProjectUpdate(e);
            }
            handleGenerate(e);
          }}
        >
          <div className="relative w-full h-max">
            <div className="relative rounded-2xl p-[2px] shadow-sm bg-[var(--color-popover)] border border-[color:var(--color-border)] h-max">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (wholeProjectGenerated) {
                      return handleProjectUpdate(e);
                    }
                    handleGenerate(e);
                  }
                }}
                placeholder={animatedPlaceholder}
                rows={5}
                className="w-full resize-none rounded-2xl bg-[var(--color-card)] border h-max border-[color:var(--color-input)] text-[color:var(--color-card-foreground)] placeholder:text-[color:var(--color-muted-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)] backdrop-blur-md px-4 py-4 pr-16"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              type="submit"
              aria-label={"Generate code"}
              disabled={isLoading}
              className={cn(
                "absolute right-3 cursor-pointer bottom-3 inline-flex items-center justify-center w-10 h-10 rounded-xl text-[color:var(--color-primary-foreground)] hover:opacity-90 transition-colors",
                isLoading && "flex items-center justify-center w-max px-4"
              )}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              )}
            </Button>
          </div>
        </form>

        {/* View Switcher */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("files")}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer",
                viewMode === "files"
                  ? "bg-[var(--color-primary)] text-[color:var(--color-primary-foreground)]"
                  : "bg-[var(--color-card)] text-[color:var(--color-card-foreground)]"
              )}
            >
              Files
            </button>

            <button
              type="button"
              onClick={() => setViewMode("preview")}
              disabled={iFrameSrc === ""}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer",
                viewMode === "preview"
                  ? "bg-[var(--color-primary)] text-[color:var(--color-primary-foreground)]"
                  : "bg-[var(--color-card)] text-[color:var(--color-card-foreground)]",
                iFrameSrc === "" && "opacity-50 cursor-not-allowed"
              )}
            >
              Preview
            </button>
          </div>
          <div className="text-xs text-[color:var(--color-muted-foreground)]">
            {files.length} files
          </div>
        </div>

        <div className="mt-4 w-full h-full">
          {viewMode === "preview" ? (
            iFrameSrc ? (
              <iframe
                src={iFrameSrc}
                title="Preview"
                className="w-full min-h-[500px] rounded border border-[color:var(--color-border)] bg-[var(--color-card)]"
              />
            ) : (
              <div className="p-4 rounded bg-[var(--color-card)] text-[color:var(--color-muted-foreground)]">
                Preview not available
              </div>
            )
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : wholeProjectGenerated ? (
            <FilesWithCode files={files} />
          ) : (
            <div className="p-4 rounded bg-[var(--color-card)] text-[color:var(--color-muted-foreground)]">
              No project generated yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppBuilderPage;
