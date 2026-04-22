import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../types/api";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;

  if (!token) {
    const response: ApiResponse = {
      status: 401,
      message: "Unauthorized — no token provided",
      data: [],
    };
    res.status(401).json(response);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    req.user = decoded;
    next();
  } catch {
    const response: ApiResponse = {
      status: 401,
      message: "Unauthorized — invalid or expired token",
      data: [],
    };
    res.status(401).json(response);
  }
};