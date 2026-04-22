
import { pool } from "../db";
 
export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}
 
export const findUserByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] ?? null;
};