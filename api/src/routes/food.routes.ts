import { Router } from "express";
import { addFood, listFoods } from "../controllers/food.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, listFoods);
router.post("/", authenticate, addFood);

export default router;