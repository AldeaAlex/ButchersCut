import { prisma } from "../db/prisma.js";
import {
  getDayOfWeekForApp,
  intervalsOverlap,
  minutesToTimeString,
  parseDateOnly,
  timeToMinutes,
} from "../utils/dateTime.js";

export async function getAvailableSlotsForDate({ serviceId, date }) {
  const service = await prisma.service.findUnique({
    where: {
      id: Number(serviceId),
    },
  });

  if (!service || !service.isActive) {
    return {
      service: null,
      slots: [],
      message: "Serviciul selectat nu este disponibil.",
    };
  }

  const selectedDate = parseDateOnly(date);
  const dayOfWeek = getDayOfWeekForApp(selectedDate);

  const workingHour = await prisma.workingHour.findUnique({
    where: {
      dayOfWeek,
    },
  });

  if (
    !workingHour ||
    !workingHour.isWorkingDay ||
    !workingHour.startTime ||
    !workingHour.endTime
  ) {
    return {
      service,
      slots: [],
      message: "Frizerul nu lucrează în ziua selectată.",
    };
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentDate: selectedDate,
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      blockedDate: selectedDate,
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  const workStart = timeToMinutes(workingHour.startTime);
  const workEnd = timeToMinutes(workingHour.endTime);
  const serviceDuration = Number(service.durationMinutes);

  const slotStep = 15;
  const slots = [];

  for (
    let slotStart = workStart;
    slotStart + serviceDuration <= workEnd;
    slotStart += slotStep
  ) {
    const slotEnd = slotStart + serviceDuration;

    const overlapsAppointment = appointments.some((appointment) => {
      const appointmentStart = timeToMinutes(appointment.startTime);
      const appointmentEnd = timeToMinutes(appointment.endTime);

      return intervalsOverlap(
        slotStart,
        slotEnd,
        appointmentStart,
        appointmentEnd
      );
    });

    const overlapsBlockedSlot = blockedSlots.some((blockedSlot) => {
      const blockedStart = timeToMinutes(blockedSlot.startTime);
      const blockedEnd = timeToMinutes(blockedSlot.endTime);

      return intervalsOverlap(slotStart, slotEnd, blockedStart, blockedEnd);
    });

    if (!overlapsAppointment && !overlapsBlockedSlot) {
      slots.push(minutesToTimeString(slotStart));
    }
  }

  return {
    service,
    slots,
    message:
      slots.length > 0
        ? "Ore disponibile găsite."
        : "Nu mai există ore disponibile pentru ziua selectată.",
  };
}

export async function validateAppointmentSlot({ serviceId, date, startTime }) {
  const result = await getAvailableSlotsForDate({
    serviceId,
    date,
  });

  const isAvailable = result.slots.includes(startTime);

  return {
    isAvailable,
    service: result.service,
    message: isAvailable
      ? "Ora este disponibilă."
      : "Ora selectată nu mai este disponibilă.",
  };
}