import { getAvailableSlotsForDate } from "../services/availability.service.js";

export async function getAvailableSlots(req, res) {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.json({
        slots: [],
        message: "Alege serviciul și data programării.",
      });
    }

    const result = await getAvailableSlotsForDate({
      serviceId,
      date,
    });

    return res.json({
      slots: result.slots,
      message: result.message,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      slots: [],
      message: "A apărut o eroare la calcularea orelor disponibile.",
    });
  }
}