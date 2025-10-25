import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/protected", authMiddleware, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await clerkClient.users.getUser(userId);
    res.json({ message: "Hello World", userId, user });
  } catch (error) {
    console.error("Error in protected route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/responseCheck", (req, res) => {
  return res.json({ message: "Hello World" });
  console.log("responseCheck");
  res.json({ message: "Hello World" });
});

export default router;
