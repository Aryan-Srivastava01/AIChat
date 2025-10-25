import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

interface ErrorWithStatus extends Error {
  status?: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);
    if (!isAuthenticated || !userId) {
      const error: ErrorWithStatus = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
