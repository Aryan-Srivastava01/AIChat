// server.js
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import chatRoutes from "./routes/chat.routes.js";
import codeGenRoutes from "./routes/code-gen.routes.js";
import imageRoutes from "./routes/image.routes.js";
import practiceRoutes from "./routes/practice.routes.js";

const app = express();

// Middlewares
// Enable CORS with credentials before Clerk middleware so Clerk can read cookies
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/practice", practiceRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/generate-code", codeGenRoutes);

// error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.log("error in error handling middleware =", err.message);
  if (res.headersSent) return next(err);
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// Start server (only when running locally / in development)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} by Aryan Srivastava`);
});

export default app;
