import { pool } from "../db";

export interface Food {
  id: number;
  name: string;
  calories: number;
  carbos: number;
  protein: number;
  fat: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFoodInput {
  name: string;
  calories: number;
  carbos: number;
  protein: number;
  fat: number;
}

export interface GetFoodsInput {
  limit: number;
  offset: number;
  search?: string;
}

export const getFoods = async ({ limit, offset, search }: GetFoodsInput): Promise<Food[]> => {
  const result = await pool.query<Food>(
    `SELECT * FROM food
     WHERE ($1::text IS NULL OR name ILIKE $2)
     ORDER BY name ASC
     LIMIT $3 OFFSET $4`,
    [search ?? null, search ? `%${search}%` : null, limit, offset]
  );
  return result.rows;
};

export const createFood = async (input: CreateFoodInput): Promise<Food> => {
  const { name, calories, carbos, protein, fat } = input;
  const result = await pool.query<Food>(
    `INSERT INTO food (name, calories, carbos, protein, fat)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, calories, carbos, protein, fat]
  );
  return result.rows[0];
};