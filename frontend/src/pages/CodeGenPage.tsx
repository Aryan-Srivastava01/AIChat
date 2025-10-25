import * as Babel from "@babel/standalone";
import Editor from "@monaco-editor/react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { FileCode, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Extend Window interface for Babel
declare global {
  interface Window {
    Babel: typeof Babel;
  }
}

// Type definition for timeout
type TimeoutId = ReturnType<typeof setTimeout>;

// File structure type
interface FileData {
  name: string;
  language: string;
  value: string;
}

type Files = Record<string, FileData>;

export default function CodeGenPage() {
  const [prompt, setPrompt] = useState(
    'A simple "Hello World" React component in a card with a button.'
  );

  // Multi-file state
  const [files, setFiles] = useState<Files>({
    "App.jsx": {
      name: "App.jsx",
      language: "javascript",
      value: `function MyComponent() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      textAlign: 'center',
      border: '1px solid #ddd',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>Hello, World!</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>This is a sample component.</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{ 
          padding: '10px 20px', 
          fontSize: '1rem', 
          borderRadius: '5px', 
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0051cc'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
      >
        Click Me
      </button>
    </div>
  );
}`,
    },
    "styles.css": {
      name: "styles.css",
      language: "css",
      value: `/* Add your styles here */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}`,
    },
  });

  const [currentFileName, setCurrentFileName] = useState("App.jsx");

  const [isLoading, setIsLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const debounceTimeout = useRef<TimeoutId | null>(null);

  // Get current file
  const currentFile = files[currentFileName];

  // Make Babel available globally
  useEffect(() => {
    window.Babel = Babel;
  }, []);

  // Combine all JS/JSX files for preview
  const getCombinedCode = () => {
    return Object.values(files)
      .filter((f) => f.language === "javascript" || f.language === "typescript")
      .map((f) => f.value)
      .join("\n\n");
  };

  // This function transpiles JSX to JS and creates the HTML for the iframe
  const updatePreview = (combinedCode: string) => {
    if (!window.Babel) return;

    try {
      // Use Babel to transpile the JSX code
      const transpiledCode = window.Babel.transform(combinedCode, {
        presets: ["react"],
      }).code;

      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        display: flex; 
        justify-content: center; 
        align-items: center; 
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-sizing: border-box;
      }
      #root {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .error-display {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        color: #e53e3e;
        max-width: 600px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .error-display h3 {
        margin: 0 0 1rem 0;
      }
      .error-display pre {
        background: #fff5f5;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 0.875rem;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script type="text/javascript">
      try {
        const { createElement: h, Fragment } = React;
        const { createRoot } = ReactDOM;
        
        ${transpiledCode}
        
        // Find the component to render (assumes last defined function starting with capital letter)
        const componentNames = Object.keys(window).filter(key => 
          typeof window[key] === 'function' && 
          /^[A-Z]/.test(key) &&
          key !== 'React' &&
          key !== 'ReactDOM' &&
          key !== 'Fragment'
        );
        
        const ComponentToRender = window[componentNames[componentNames.length - 1]] || function() {
          return h('div', { className: 'error-display' }, 
            h('h3', null, 'No Component Found'),
            h('p', null, 'Please define a React component (function starting with capital letter)')
          );
        };
        
        const root = createRoot(document.getElementById('root'));
        root.render(h(ComponentToRender));
      } catch (err) {
        document.getElementById('root').innerHTML = 
          '<div class="error-display">' +
          '<h3>Runtime Error</h3>' +
          '<pre>' + (err.message || String(err)) + '</pre>' +
          '</div>';
      }
    </script>
  </body>
</html>`;
      setPreviewContent(html);
    } catch (err: any) {
      // Handle transpilation errors
      const errorHtml = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        background: #f7fafc;
      }
      .error-display {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        color: #e53e3e;
        max-width: 600px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .error-display h3 {
        margin: 0 0 1rem 0;
      }
      .error-display pre {
        background: #fff5f5;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 0.875rem;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    </style>
  </head>
  <body>
    <div class="error-display">
      <h3>Build Error</h3>
      <pre>${err.message || String(err)}</pre>
    </div>
  </body>
</html>`;
      setPreviewContent(errorHtml);
    }
  };

  // Debounce the preview update to avoid re-rendering on every keystroke
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const combinedCode = getCombinedCode();
      updatePreview(combinedCode);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [files]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${apiBase}/api/generate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate code. Please check your backend.");
      }

      const data = await response.json();

      // Update current file with generated code
      setFiles((prev) => ({
        ...prev,
        [currentFileName]: {
          ...prev[currentFileName],
          value: data.code,
        },
      }));
    } catch (error) {
      console.error("Error generating code:", error);
      alert("Failed to generate code. Make sure your backend API is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // File management functions
  const handleCreateFile = () => {
    const fileName = window.prompt(
      "Enter file name (e.g., Component.jsx, styles.css):"
    );
    if (!fileName) return;

    if (files[fileName]) {
      alert("File already exists!");
      return;
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    let language = "javascript";
    let defaultValue = "";

    if (extension === "css") {
      language = "css";
      defaultValue = "/* Add your styles here */\n";
    } else if (extension === "html") {
      language = "html";
      defaultValue =
        "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page</title>\n  </head>\n  <body>\n    \n  </body>\n</html>";
    } else if (extension === "json") {
      language = "json";
      defaultValue = "{\n  \n}";
    } else if (extension === "ts" || extension === "tsx") {
      language = "typescript";
      defaultValue = "// TypeScript file\n";
    } else {
      defaultValue = "// JavaScript file\n";
    }

    setFiles((prev) => ({
      ...prev,
      [fileName]: {
        name: fileName,
        language,
        value: defaultValue,
      },
    }));
    setCurrentFileName(fileName);
  };

  const handleDeleteFile = (fileName: string) => {
    if (Object.keys(files).length === 1) {
      alert("Cannot delete the last file!");
      return;
    }

    if (!confirm(`Delete ${fileName}?`)) return;

    const newFiles = { ...files };
    delete newFiles[fileName];
    setFiles(newFiles);

    // Switch to first available file if current file is deleted
    if (currentFileName === fileName) {
      setCurrentFileName(Object.keys(newFiles)[0]);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;

    setFiles((prev) => ({
      ...prev,
      [currentFileName]: {
        ...prev[currentFileName],
        value,
      },
    }));
  };

  return (
    <div className="flex flex-col w-full max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl h-screen bg-gray-900 border-border border-2 rounded-lg">
      <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center z-10 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">🚀 AI UI Generator</h1>
        <div className="flex items-center gap-4 w-full max-w-3xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleGenerate();
              }
            }}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            placeholder="Describe the UI you want to build... (Press Enter to generate)"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </header>

      <main className="flex-grow overflow-hidden">
        <Allotment defaultSizes={[50, 50]}>
          <Allotment.Pane minSize={300}>
            <div className="h-full flex flex-col">
              {/* File Tabs */}
              <div className="bg-gray-800 px-2 py-1 border-b border-gray-700 flex items-center gap-1 overflow-x-auto">
                {Object.keys(files).map((fileName) => (
                  <div
                    key={fileName}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-sm transition-colors cursor-pointer ${
                      currentFileName === fileName
                        ? "bg-gray-900 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => setCurrentFileName(fileName)}
                  >
                    <FileCode size={14} />
                    <span>{fileName}</span>
                    {Object.keys(files).length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(fileName);
                        }}
                        className="hover:text-red-400 transition-colors"
                        title="Delete file"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleCreateFile}
                  className="flex items-center gap-1 px-2 py-1.5 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                  title="New file"
                >
                  <Plus size={14} />
                  <span>New</span>
                </button>
              </div>

              {/* Editor Header */}
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-sm text-gray-300 font-medium">
                  Code Editor - {currentFile.name}
                </span>
              </div>

              {/* Monaco Editor with multi-model support */}
              <Editor
                height="100%"
                theme="vs-dark"
                path={currentFile.name}
                defaultLanguage={currentFile.language}
                defaultValue={currentFile.value}
                value={currentFile.value}
                language={currentFile.language}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  wordWrap: "on",
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
                saveViewState={true}
              />
            </div>
          </Allotment.Pane>
          <Allotment.Pane minSize={300}>
            <div className="h-full flex flex-col bg-white">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-300 font-medium">
                  Preview
                </span>
                <button
                  onClick={() => {
                    const combinedCode = getCombinedCode();
                    updatePreview(combinedCode);
                  }}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded transition-colors"
                  title="Refresh preview"
                >
                  🔄 Refresh
                </button>
              </div>
              <iframe
                srcDoc={previewContent}
                title="preview"
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0"
              />
            </div>
          </Allotment.Pane>
        </Allotment>
      </main>
    </div>
  );
}
