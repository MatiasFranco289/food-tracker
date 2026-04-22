import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "../models/user.model";
import { ApiResponse } from "../types/api";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    const response: ApiResponse = {
      status: 400,
      message: "Username and password are required",
      data: [],
    };
    res.status(400).json(response);
    return;
  }

  const user = await findUserByUsername(username);

  if (!user) {
    const response: ApiResponse = {
      status: 401,
      message: "Invalid credentials",
      data: [],
    };
    res.status(401).json(response);
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const response: ApiResponse = {
      status: 401,
      message: "Invalid credentials",
      data: [],
    };
    res.status(401).json(response);
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  const response: ApiResponse<{ username: string }> = {
    status: 200,
    message: "Login successful",
    data: [{ username: user.username }],
  };
  res.status(200).json(response);
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  const response: ApiResponse = {
    status: 200,
    message: "Logout successful",
    data: [],
  };
  res.status(200).json(response);
};