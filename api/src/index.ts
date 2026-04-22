import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { pool } from "./db";
import authRoutes from "./routes/auth.routes";
import foodRoutes from "./routes/food.routes";
import dietRoutes from "./routes/diet.routes";
import { ApiResponse } from "./types/api";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/food", foodRoutes);
app.use("/diet", dietRoutes);

// Health check
app.get("/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    const response: ApiResponse<{ api: string; database: string }> = {
      status: 200,
      message: "OK",
      data: [{ api: "ok", database: "ok" }],
    };
    res.status(200).json(response);
  } catch {
    const response: ApiResponse<{ api: string; database: string }> = {
      status: 503,
      message: "Database unreachable",
      data: [{ api: "ok", database: "unreachable" }],
    };
    res.status(503).json(response);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Food Tracker API running on port ${PORT}`);
});
