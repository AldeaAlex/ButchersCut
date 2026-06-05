import { Router } from "express";
import {
  showLoginPage,
  loginAdmin,
  logoutAdmin,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", showLoginPage);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

export default router;