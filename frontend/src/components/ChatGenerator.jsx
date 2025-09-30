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
      const response = await axios.post(
        "http://localhost:5001/api/chat",
        { prompt }
      );

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
      <textarea
        rows="4"
        cols="50"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        style={{ marginBottom: "10px" }}
      />
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
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "8px",
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
