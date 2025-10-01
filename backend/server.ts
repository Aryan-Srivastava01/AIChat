// server.js
import "dotenv/config";
import cors from "cors";
import express from "express";
import chatRoutes from "./routes/chat.routes.ts";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/chat", chatRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
