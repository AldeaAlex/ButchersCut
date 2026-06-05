import { prisma } from "../db/prisma.js";
import {
  addMinutesToTime,
  formatDateInput,
  formatTime,
  parseDateOnly,
  parseTimeOnly,
} from "../utils/dateTime.js";
import { validateAppointmentSlot } from "../services/availability.service.js";

const WEEK_DAYS = [
  { dayOfWeek: 0, label: "Luni" },
  { dayOfWeek: 1, label: "Marți" },
  { dayOfWeek: 2, label: "Miercuri" },
  { dayOfWeek: 3, label: "Joi" },
  { dayOfWeek: 4, label: "Vineri" },
  { dayOfWeek: 5, label: "Sâmbătă" },
  { dayOfWeek: 6, label: "Duminică" },
];

export async function showDashboard(req, res) {
  const selectedDate = req.query.date || formatDateInput(new Date());
  const parsedDate = parseDateOnly(selectedDate);

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentDate: parsedDate,
    },
    include: {
      service: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const statusLabels = {
    CONFIRMED: "Confirmată",
    CANCELLED: "Anulată",
    COMPLETED: "Finalizată",
    NO_SHOW: "Neprezentat",
  };

  const formattedAppointments = appointments.map((appointment) => ({
    ...appointment,
    displayStartTime: formatTime(appointment.startTime),
    displayEndTime: formatTime(appointment.endTime),
    displayStatus: statusLabels[appointment.status] || appointment.status,
  }));

  return res.render("admin/dashboard", {
    title: "Dashboard",
    selectedDate,
    appointments: formattedAppointments,
  });
}

export async function updateAppointmentStatus(req, res) {
  try {
    const appointmentId = Number(req.params.id);
    const { status, selectedDate } = req.body;

    const allowedStatuses = ["CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"];

    if (!allowedStatuses.includes(status)) {
      req.flash("error", "Statusul selectat nu este valid.");
      return res.redirect(`/admin/dashboard?date=${selectedDate}`);
    }

    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status,
      },
    });

    req.flash("success", "Statusul programării a fost actualizat.");
    return res.redirect(`/admin/dashboard?date=${selectedDate}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "A apărut o eroare la actualizarea statusului.");
    return res.redirect("/admin/dashboard");
  }
}

export async function showNewAppointmentPage(req, res) {
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return res.render("admin/new-appointment", {
    title: "Programare nouă",
    services,
  });
}

export async function createManualAppointment(req, res) {
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
      return res.redirect("/admin/programare-noua");
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

    req.flash("success", "Programarea clientului a fost creată.");
    return res.redirect(`/admin/dashboard?date=${appointmentDate}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "A apărut o eroare la crearea programării.");
    return res.redirect("/admin/programare-noua");
  }
}

export async function showWorkingHoursPage(req, res) {
  const savedWorkingHours = await prisma.workingHour.findMany({
    orderBy: {
      dayOfWeek: "asc",
    },
  });

  const savedWorkingHoursMap = new Map(
    savedWorkingHours.map((item) => [item.dayOfWeek, item])
  );

  const days = WEEK_DAYS.map((day) => {
    const savedDay = savedWorkingHoursMap.get(day.dayOfWeek);

    return {
      dayOfWeek: day.dayOfWeek,
      label: day.label,
      isWorkingDay: savedDay?.isWorkingDay ?? false,
      startTime: savedDay?.startTime ? formatTime(savedDay.startTime) : "09:00",
      endTime: savedDay?.endTime ? formatTime(savedDay.endTime) : "18:00",
    };
  });

  return res.render("admin/working-hours", {
    title: "Program de lucru",
    days,
  });
}

export async function updateWorkingHours(req, res) {
  try {
    const submittedDays = req.body.workingDays || [];

    const workingDays = Array.isArray(submittedDays)
      ? submittedDays
      : Object.values(submittedDays);

    for (const day of workingDays) {
      const dayOfWeek = Number(day.dayOfWeek);
      const isWorkingDay = day.isWorkingDay === "true";

      const startTime = isWorkingDay ? parseTimeOnly(day.startTime) : null;
      const endTime = isWorkingDay ? parseTimeOnly(day.endTime) : null;

      if (isWorkingDay && (!day.startTime || !day.endTime)) {
        req.flash(
          "error",
          "Zilele active trebuie să aibă oră de început și oră de final."
        );
        return res.redirect("/admin/program");
      }

      if (isWorkingDay && startTime >= endTime) {
        req.flash(
          "error",
          "Ora de început trebuie să fie înainte de ora de final."
        );
        return res.redirect("/admin/program");
      }

      await prisma.workingHour.upsert({
        where: {
          dayOfWeek,
        },
        update: {
          isWorkingDay,
          startTime,
          endTime,
        },
        create: {
          dayOfWeek,
          isWorkingDay,
          startTime,
          endTime,
        },
      });
    }

    req.flash("success", "Programul de lucru a fost salvat.");
    return res.redirect("/admin/program");
  } catch (error) {
    console.error(error);
    req.flash("error", "A apărut o eroare la salvarea programului.");
    return res.redirect("/admin/program");
  }
}

export async function showServicesPage(req, res) {
  const services = await prisma.service.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return res.render("admin/services", {
    title: "Servicii",
    services,
  });
}

export async function createService(req, res) {
  try {
    const { name, description, durationMinutes, price } = req.body;

    if (!name || !durationMinutes || !price) {
      req.flash("error", "Numele, durata și prețul sunt obligatorii.");
      return res.redirect("/admin/servicii");
    }

    if (Number(durationMinutes) <= 0 || Number(price) < 0) {
      req.flash("error", "Durata și prețul trebuie să fie valori valide.");
      return res.redirect("/admin/servicii");
    }

    await prisma.service.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
        isActive: true,
      },
    });

    req.flash("success", "Serviciul a fost adăugat.");
    return res.redirect("/admin/servicii");
  } catch (error) {
    console.error(error);
    req.flash("error", "A apărut o eroare la adăugarea serviciului.");
    return res.redirect("/admin/servicii");
  }
}

export async function updateService(req, res) {
  try {
    const serviceId = Number(req.params.id);
    const { name, description, durationMinutes, price } = req.body;

    if (!name || !durationMinutes || !price) {
      req.flash("error", "Numele, durata și prețul sunt obligatorii.");
      return res.redirect("/admin/servicii");
    }

    if (Number(durationMinutes) <= 0 || Number(price) < 0) {
      req.flash("error", "Durata și prețul trebuie să fie valori valide.");
      return res.redirect("/admin/servicii");
    }

    await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        durationMinutes: Number(durationMinutes),
        price: Number(price),
      },
    });

    req.flash("success", "Serviciul a fost actualizat.");
    return res.redirect("/admin/servicii");
  } catch (error) {
    console.error(error);
    req.flash("error", "A apărut o eroare la actualizarea serviciului.");
    return res.redirect("/admin/servicii");
  }
}

export async function toggleServiceStatus(req, res) {
  try {
    const serviceId = Number(req.params.id);

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      req.flash("error", "Serviciul nu există.");
      return res.redirect("/admin/servicii");
    }

    await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        isActive: !service.isActive,
      },
    });

    req.flash(
      "success",
      service.isActive
        ? "Serviciul a fost dezactivat."
        : "Serviciul a fost activat."
    );

    return res.redirect("/admin/servicii");
  } catch (error) {
    console.error(error);
    req.flash("error", "A apărut o eroare la schimbarea statusului.");
    return res.redirect("/admin/servicii");
  }
}