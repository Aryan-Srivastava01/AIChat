import { useState } from "react";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const Image = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // store returned image

  const fetchImages = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/image", {
        prompt, // send prompt in body
      });
      setImageUrl(res.data.image); // base64 string
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      fetchImages();
    }
  };

  return (
    <div className="w-full">
        <div>
            <h1>Image Generator</h1>
        </div>
         {/* Show image if available */}
         {imageUrl && (
        <div className="p-4">
          <img src={imageUrl} alt="Generated" className="max-w-full rounded max-h-100" />
        </div>
      )}
      <Textarea
        inputMode="text"
        className="mt-4"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        placeholder="Enter the prompt here"
      />
      <Button onClick={handleGenerate} className="mt-2">Generate</Button>

     
     
    </div>
  );
};

export default Image;
