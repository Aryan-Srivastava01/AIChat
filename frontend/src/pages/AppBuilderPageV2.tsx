import FilesWithCode from "@/components/file-systems/FilesWithCode";
import { Button } from "@/components/ui/button";
import { initialFiles } from "@/lib/constants/files.constants";
import { FileItem } from "@/lib/types/stepsTypes";
import type { FileSystemTree, WebContainer } from "@webcontainer/api";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/loaders/Loader";
import { cn } from "../lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const model = "gemini-2.5-flash";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AppBuilderPageV2 = ({
  webContainer,
}: {
  webContainer: WebContainer | null;
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [animatedPlaceholder, setAnimatedPlaceholder] =
    useState<string>("Build app with AI");
  const [isInitialProjectGenerated, setIsInitialProjectGenerated] =
    useState<boolean>(false);
  const [iFrameSrc, setIFrameSrc] = useState<string>("");
  const [viewMode, setViewMode] = useState<"files" | "preview">("files");
  const [llmMessages, setLlmMessages] = useState<Message[]>([]);
  const [isWebContainerServerStarted, setIsWebContainerServerStarted] = useState<boolean>(false);

  // Listening for web container server to start
  webContainer?.on("server-ready", (port: number, url: string) => {
    console.log("server ready on port =", port, " and url =", url);
    setIFrameSrc(url);
    setViewMode("preview");
    setIsWebContainerServerStarted(true);
  });

  // Helper function to merge updated files with existing files
  const mergeFiles = (
    existingFiles: FileItem[],
    updatedFiles: FileItem[]
  ): FileItem[] => {
    // Create a map of existing files by path for quick lookup
    const fileMap = new Map<string, FileItem>();
    existingFiles.forEach((file) => fileMap.set(file.path, file));

    // Update or add new files
    updatedFiles.forEach((file) => fileMap.set(file.path, file));

    // Convert map back to array
    return Array.from(fileMap.values());
  };

  // Helper function to mount files to the web container
  async function mountFilesToWebContainer(
    webContainer: WebContainer | null,
    files: { path: string; content: string; language?: string }[]
  ) {
    if (!webContainer || files.length === 0 || !isInitialProjectGenerated) return;

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
    if (!webContainer || files.length === 0 || !isInitialProjectGenerated) return;
    (async () => {
      try {
        await mountFilesToWebContainer(webContainer, files);
        if (isWebContainerServerStarted) return;
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
    if (!prompt.trim() || isInitialProjectGenerated) return;
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/generate-code/generate-project-files`,
        {
          messages: [...llmMessages, { role: "user", content: prompt.trim() }],
          initialFiles: initialFiles, // Send initial project structure
          model,
        }
      );

      // Merge generated files with initial files
      const mergedFiles = mergeFiles(initialFiles, response.data.files);
      setFiles(mergedFiles);

      setLlmMessages([
        ...llmMessages,
        { role: "user", content: prompt },
        { role: "assistant", content: JSON.stringify(response.data.files) },
      ]);
      setPrompt(""); // Clear prompt after successful generation
      setIsInitialProjectGenerated(true);
    } catch (error: any) {
      console.error("Error generating code:", error.message);
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
    if (!prompt.trim() || !isInitialProjectGenerated) return;
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/generate-code/generate-project-files`,
        {
          messages: [...llmMessages, { role: "user", content: prompt.trim() }],
          currentFiles: files, // Send current file state for context
          model,
        }
      );

      // Merge updated files with existing files
      const mergedFiles = mergeFiles(files, response.data.files);
      setFiles(mergedFiles);

      setLlmMessages([
        ...llmMessages,
        { role: "user", content: prompt },
        { role: "assistant", content: JSON.stringify(response.data.files) },
      ]);
      setPrompt(""); // Clear prompt after successful update
    } catch (error: any) {
      console.error("Error updating project:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!webContainer)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen flex w-full max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl h-full pb-10">
      <main className="flex flex-col gap-4 w-full h-full p-6 bg-sidebar rounded-lg">
        <form
          className="flex items-center justify-center h-max"
          onSubmit={(e) => {
            e.preventDefault();
            if (isInitialProjectGenerated) {
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
                    if (isInitialProjectGenerated) {
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
          ) : (
            <FilesWithCode files={files} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AppBuilderPageV2;
