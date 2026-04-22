import { pool } from "../db";

export interface Diet {
  id: number;
  user_id: number;
  food_id: number;
  quantity_g: number;
  date: string;
  created_at: Date;
  updated_at: Date;
}

export interface DietEntry {
  id: number;
  food_id: number;
  name: string;
  quantity_g: number;
  calories: number;
  carbos: number;
  protein: number;
  fat: number;
  date: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDietInput {
  user_id: number;
  food_id: number;
  quantity_g: number;
  date: string;
}

export const createDietEntry = async (
  input: CreateDietInput,
): Promise<Diet> => {
  const { user_id, food_id, quantity_g, date } = input;
  const result = await pool.query<Diet>(
    `INSERT INTO diet (user_id, food_id, quantity_g, date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, food_id, quantity_g, date],
  );
  return result.rows[0];
};

export const getDietEntriesByDate = async (
  user_id: number,
  date: string,
): Promise<DietEntry[]> => {
  const result = await pool.query<DietEntry>(
    `SELECT
       d.id,
       d.food_id,
       f.name,
       d.quantity_g,
       f.calories,
       f.carbos,
       f.protein,
       f.fat,
       d.date,
       d.created_at,
       d.updated_at
     FROM diet d
     JOIN food f ON f.id = d.food_id
     WHERE d.user_id = $1 AND d.date = $2
     ORDER BY d.created_at ASC`,
    [user_id, date],
  );
  return result.rows;
};
