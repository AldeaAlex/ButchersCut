import { Router } from "express";
import {
  showHomePage,
  showBookingPage,
  createBooking,
} from "../controllers/public.controller.js";

const router = Router();

router.get("/", showHomePage);
router.get("/programare", showBookingPage);
router.post("/programare", createBooking);

export default router;