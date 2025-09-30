import React, { useState } from "react";
import axios from "axios";

const ChatGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setChatResponse("");

    try {
      const response = await axios.post("http://localhost:5001/api/chat", {
        prompt,
      });

      setChatResponse(response.data.text);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to generate chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Chat with Grok</h2>
      <div className="chat" style={{ display: "flex", flexDirection: "column"}}>
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your message
        </label>

        <textarea
          id="message"
          rows="4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg 
                     border border-gray-300 focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                     dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
        />
      </div>

      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Send"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {chatResponse && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            maxWidth: "600px",
            margin: "20px auto",
            whiteSpace: "pre-wrap",
            backgroundColor: "#000",
            padding: "10px",
            borderRadius: "8px",
            color: "#fff",
          }}
        >
          <strong>Response:</strong>
          <p>{chatResponse}</p>
        </div>
      )}
    </div>
  );
};

export default ChatGenerator;
