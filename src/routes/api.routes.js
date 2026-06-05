import { Router } from "express";
import { getAvailableSlots } from "../controllers/api.controller.js";

const router = Router();

router.get("/available-slots", getAvailableSlots);

export default router;