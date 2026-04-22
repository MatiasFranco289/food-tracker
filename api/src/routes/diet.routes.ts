import { Router } from "express";
import {
  addDietEntry,
  listDietEntriesByDate,
} from "../controllers/diet.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, listDietEntriesByDate);
router.post("/", authenticate, addDietEntry);

export default router;
