import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  showDashboard,
  showNewAppointmentPage,
  createManualAppointment,
  showWorkingHoursPage,
  updateWorkingHours,
  showServicesPage,
  createService,
  updateService,
  toggleServiceStatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/dashboard", requireAdmin, showDashboard);

router.get("/programare-noua", requireAdmin, showNewAppointmentPage);
router.post("/programare-noua", requireAdmin, createManualAppointment);

router.get("/program", requireAdmin, showWorkingHoursPage);
router.post("/program", requireAdmin, updateWorkingHours);

router.get("/servicii", requireAdmin, showServicesPage);
router.post("/servicii", requireAdmin, createService);
router.post("/servicii/:id/update", requireAdmin, updateService);
router.post("/servicii/:id/toggle", requireAdmin, toggleServiceStatus);

export default router;