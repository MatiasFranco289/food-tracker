import { Response } from "express";
import {
  createDietEntry,
  getDietEntriesByDate,
  Diet,
  DietEntry,
} from "../models/diet.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ApiResponse } from "../types/api";

export const addDietEntry = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { food_id, quantity_g, date } = req.body;
  const user_id = req.user!.id;

  if (food_id === undefined || quantity_g === undefined || date === undefined) {
    const response: ApiResponse = {
      status: 400,
      message: "All fields are required: food_id, quantity_g, date",
      data: [],
    };
    res.status(400).json(response);
    return;
  }

  try {
    const entry = await createDietEntry({ user_id, food_id, quantity_g, date });

    const { user_id: _, ...entryWithoutUserId } = entry;

    const response: ApiResponse<Omit<Diet, "user_id">> = {
      status: 201,
      message: "Diet entry created successfully",
      data: [entryWithoutUserId],
    };
    res.status(201).json(response);
  } catch (error: any) {
    if (error.code === "23503") {
      const response: ApiResponse = {
        status: 404,
        message: `Food with id "${food_id}" does not exist`,
        data: [],
      };
      res.status(404).json(response);
      return;
    }
    throw error;
  }
};

const getLocalDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const listDietEntriesByDate = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const user_id = req.user!.id;
  const date = (req.query.date as string) || getLocalDateString();

  const entries = await getDietEntriesByDate(user_id, date);

  const response: ApiResponse<DietEntry> = {
    status: 200,
    message: "Diet entries retrieved successfully",
    data: entries,
  };
  res.status(200).json(response);
};
