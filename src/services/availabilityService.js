import { WEEK_DAYS } from '../data/workingHours';
import {
  parseDateOnly,
  getDayOfWeekForApp,
  timeStringToMinutes,
  minutesToTimeString,
  intervalsOverlap
} from '../utils/dateTime';

/**
 * Calculează orele disponibile pentru o dată și un serviciu, 
 * verificând programul de lucru și suprapunerea cu programările existente.
 */
export function getAvailableSlotsForDate({
  service,
  date,
  existingAppointments = [],
  workingHours = WEEK_DAYS,
  slotStep = 15
}) {
  if (!service) {
    return {
      service: null,
      slots: [],
      message: "Alege mai întâi un serviciu."
    };
  }

  if (!date) {
    return {
      service,
      slots: [],
      message: "Alege o dată pentru a vedea orele disponibile."
    };
  }

  const selectedDate = parseDateOnly(date);
  const dayOfWeek = getDayOfWeekForApp(selectedDate);

  const workingHour = workingHours.find(w => w.dayOfWeek === dayOfWeek);

  if (!workingHour || !workingHour.isWorkingDay || !workingHour.startTime || !workingHour.endTime) {
    return {
      service,
      slots: [],
      message: "Salonul este închis în această zi (nu este zi lucrătoare)."
    };
  }

  const workStart = timeStringToMinutes(workingHour.startTime);
  const workEnd = timeStringToMinutes(workingHour.endTime);
  const serviceDuration = Number(service.durationMinutes || 30);
  const breaks = workingHour.breaks || [];

  // Filtrează programările active din acea zi (care nu sunt anulate)
  const activeAppointmentsOnDate = existingAppointments.filter(app => {
    return app.date === date && app.status !== 'Anulat' && app.status !== 'CANCELLED';
  });

  const slots = [];

  for (let slotStart = workStart; slotStart + serviceDuration <= workEnd; slotStart += slotStep) {
    const slotEnd = slotStart + serviceDuration;

    // 1. Verifică suprapunerea cu pauzele de lucru stabilite de frizer
    const hasBreakOverlap = breaks.some(b => {
      if (!b.startTime || !b.endTime) return false;
      const bStart = timeStringToMinutes(b.startTime);
      const bEnd = timeStringToMinutes(b.endTime);
      return intervalsOverlap(slotStart, slotEnd, bStart, bEnd);
    });

    if (hasBreakOverlap) {
      continue;
    }

    // 2. Verifică suprapunerea cu programările existente
    const hasOverlap = activeAppointmentsOnDate.some(app => {
      const appStart = timeStringToMinutes(app.time || app.startTime);
      const appDuration = Number(app.durationMinutes || (app.service?.includes('barbă') && app.service?.includes('Tuns') ? 45 : 30));
      const appEnd = appStart + appDuration;

      return intervalsOverlap(slotStart, slotEnd, appStart, appEnd);
    });

    if (!hasOverlap) {
      slots.push(minutesToTimeString(slotStart));
    }
  }

  return {
    service,
    slots,
    message: slots.length > 0
      ? "Ore disponibile calculate cu succes."
      : "Nu mai există ore disponibile pentru ziua selectată."
  };
}

export function validateAppointmentSlot({ service, date, startTime, existingAppointments, workingHours }) {
  const result = getAvailableSlotsForDate({
    service,
    date,
    existingAppointments,
    workingHours
  });

  const isAvailable = result.slots.includes(startTime);

  return {
    isAvailable,
    message: isAvailable
      ? "Ora este disponibilă."
      : "Ora selectată se suprapune cu o pauză, cu o altă programare sau este în afara programului."
  };
}
