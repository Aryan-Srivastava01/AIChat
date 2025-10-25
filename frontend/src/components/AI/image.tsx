import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
import ModelSelect from "../form-elements/ModelSelect";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const models = [
  {
    name: "Hugging Face (Stable Diffusion XL)",
    value: "hugging-face",
    provider: "hugging-face",
  },
  // Paid models
  // {
  //   name: "Gemini 2.0 Flash Image (Image Generation)",
  //   value: "gemini-2.0-flash-preview-image-generation",
  //   provider: "gemini",
  // },
];

const Image = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(models[0]);
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setIsInputVisible(false);
      if (!prompt) {
        return;
      }
      const apiUrl =
        model.provider === "hugging-face"
          ? `${import.meta.env.VITE_API_BASE_URL}/api/image`
          : `${import.meta.env.VITE_API_BASE_URL}/api/image/gemini`;
      const res = await axios.post(apiUrl, {
        prompt,
      });
      setImageUrl(res.data.image);
      setPrompt("");
    } catch (err) {
      console.error("Error fetching image:", err);
      setIsInputVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (prompt.trim()) fetchImages();
  };

  const downloadImageFromDataUrl = (dataUrl: string) => {
    try {
      const filename = `image-${Date.now()}.png`;
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  const copyImageToClipboard = async (dataUrl: string) => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ [blob.type]: blob }),
        ]);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        // fallback: copy data URL as text
        await navigator.clipboard.writeText(dataUrl);
      } else {
        throw new Error("Clipboard API not supported");
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
    }
  };

  return (
    <div className="w-screen min-h-screen relative rounded-lg flex flex-col items-center justify-start px-2 sm:px-0">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          AI Image Generator
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto">
          Transform your ideas into stunning visuals with our advanced
          AI-powered image generation
        </p>
      </div>

      {/* Content Section (AI Image Generator) */}
      <div
        className={cn(
          "max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl w-full bg-popover rounded-lg pt-16 p-8 h-full overflow-y-auto",
          isInputVisible ? "pb-36" : "pb-22"
        )}
      >
        {/* Main Content Area */}
        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden mb-8 w-full h-full">
          <div className="p-8">
            {/* Image Display Area */}
            <div className="w-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border mb-6 h-full">
              {/* Aspect-ratio container for 16:9 images */}
              <div className="w-full flex items-center justify-center">
                {loading ? (
                  <div className="w-full space-y-4 p-4">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                    <Skeleton className="h-48 w-full bg-muted rounded-lg" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-4 w-1/4 bg-muted" />
                      <Skeleton className="h-4 w-1/3 bg-muted" />
                    </div>
                  </div>
                ) : imageUrl ? (
                  <div className="relative group w-full h-full">
                    <img
                      src={imageUrl}
                      alt="Generated"
                      className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute z-1 bottom-4 left-4 flex space-x-2">
                      {/* For Copying the image (by creating a function) */}
                      <Button
                        onClick={() => copyImageToClipboard(imageUrl)}
                        variant="outline"
                        size="icon"
                        className="bg-background hover:bg-muted/50 text-muted-foreground rounded-full p-2 cursor-pointer"
                      >
                        <Copy className="w-5 h-5" />
                      </Button>

                      {/* For Downloading the image (by creating a function) */}
                      {/* <Button
                        onClick={() => downloadImageFromDataUrl(imageUrl)}
                        variant="outline"
                        size="icon"
                        className="bg-background hover:bg-muted/50 text-muted-foreground rounded-full p-2 cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                      </Button> */}

                      {/* For Downloading the image (by creating a button) */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background hover:bg-muted/50 text-muted-foreground rounded-full p-2 cursor-pointer"
                      >
                        <a
                          href={imageUrl}
                          // target="_blank"
                          download={`image-${Date.now()}.png`}
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-lg font-medium">
                      Your generated image will appear here
                    </p>
                    <p className="text-muted-foreground/70 text-sm mt-1">
                      Enter a prompt below to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-muted-foreground/70 text-sm">
            Powered by Gemini AI • Generate high-quality images from text
            descriptions
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="fixed bottom-0 w-full max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl px-2 sm:px-0">
        <div
          className={`w-full  ${
            isInputVisible ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 ease-in-out border-1 rounded-lg border-border`}
        >
          <div className="space-y-2 bg-sidebar rounded-lg p-4">
            <label
              htmlFor="prompt"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Prompt
            </label>
            <div className="flex flex-col gap-2 max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl">
              {/* Input Textarea */}
              <Textarea
                id="prompt"
                inputMode="text"
                className="bg-background border-border focus:border-ring focus:ring-ring resize-none placeholder:text-muted-foreground/30!"
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                value={prompt}
                placeholder="Describe the image you want to generate... e.g., 'A serene mountain landscape at sunset with vibrant colors'"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-2 sm:gap-0">
                {/* Model Select */}
                <ModelSelect models={models} setModel={setModel} />
                {/* Generate Image Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Generate Image
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Visibility Toggle */}
      <Button
        onClick={() => setIsInputVisible((current) => !current)}
        className="fixed bottom-0 right-0 lg:right-auto cursor-pointer"
        variant="default"
      >
        {isInputVisible ? "Hide Input" : "Show Input"}
      </Button>
    </div>
  );
};

export default Image;
