export interface ApiDietEntry {
  id: number;
  food_id: number;
  name: string;
  quantity_g: string;
  calories: string;
  carbos: string;
  protein: string;
  fat: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface FoodResult {
  id: number;
  name: string;
  calories: string;
  carbos: string;
  protein: string;
  fat: string;
  created_at: string;
  updated_at: string;
}
