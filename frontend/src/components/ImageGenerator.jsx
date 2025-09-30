import { React, useState } from "react";
import axios from "axios";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/image/generate",
        { prompt }
      );
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <textarea
          rows="4"
          cols="50"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <br />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
        {imageUrl && <img src={imageUrl} alt="Generated" />}
      </div>
    </>
  );
};

export default ImageGenerator;
