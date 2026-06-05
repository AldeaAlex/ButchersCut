import { prisma } from "../db/prisma.js";
import {
  addMinutesToTime,
  parseDateOnly,
  parseTimeOnly,
} from "../utils/dateTime.js";
import { validateAppointmentSlot } from "../services/availability.service.js";

export async function showHomePage(req, res) {
  return res.render("public/home", {
    title: "Acasă",
  });
}

export async function showBookingPage(req, res) {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  return res.render("public/booking", {
    title: "Programare",
    services,
  });
}

export async function createBooking(req, res) {
  try {
    const {
      serviceId,
      appointmentDate,
      startTime,
      clientName,
      clientPhone,
      clientEmail,
      notes,
    } = req.body;

    const validation = await validateAppointmentSlot({
      serviceId,
      date: appointmentDate,
      startTime,
    });

    if (!validation.isAvailable || !validation.service) {
      req.flash("error", validation.message);
      return res.redirect("/programare");
    }

    const parsedStartTime = parseTimeOnly(startTime);
    const parsedEndTime = addMinutesToTime(
      parsedStartTime,
      validation.service.durationMinutes
    );

    await prisma.appointment.create({
      data: {
        serviceId: validation.service.id,
        appointmentDate: parseDateOnly(appointmentDate),
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        notes: notes || null,
        status: "CONFIRMED",
      },
    });

    req.flash("success", "Programarea a fost trimisă cu succes.");
    return res.redirect("/programare");
  } catch (error) {
    console.error(error);
    req.flash("error", "A apărut o eroare la salvarea programării.");
    return res.redirect("/programare");
  }
}