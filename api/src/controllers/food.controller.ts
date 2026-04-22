import { Response } from "express";
import { createFood, getFoods, Food } from "../models/food.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ApiResponse } from "../types/api";

export const listFoods = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const limit = Math.max(1, parseInt(req.query.limit as string) || 20);
  const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
  const search = (req.query.search as string)?.trim() || undefined;

  const foods = await getFoods({ limit, offset, search });

  const response: ApiResponse<Food> = {
    status: 200,
    message: "Foods retrieved successfully",
    data: foods,
  };
  res.status(200).json(response);
};

export const addFood = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, calories, carbos, protein, fat } = req.body;

  if (
    name === undefined ||
    calories === undefined ||
    carbos === undefined ||
    protein === undefined ||
    fat === undefined
  ) {
    const response: ApiResponse = {
      status: 400,
      message: "All fields are required: name, calories, carbos, protein, fat",
      data: [],
    };
    res.status(400).json(response);
    return;
  }

  try {
    const food = await createFood({ name, calories, carbos, protein, fat });
    const response: ApiResponse<Food> = {
      status: 201,
      message: "Food created successfully",
      data: [food],
    };
    res.status(201).json(response);
  } catch (error: any) {
    if (error.code === "23505") {
      const response: ApiResponse = {
        status: 409,
        message: `Food with name "${name}" already exists`,
        data: [],
      };
      res.status(409).json(response);
      return;
    }
    throw error;
  }
};