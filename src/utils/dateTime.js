export function parseDateOnly(dateValue) {
  return new Date(`${dateValue}T00:00:00.000Z`);
}

export function parseTimeOnly(timeValue) {
  return new Date(`1970-01-01T${timeValue}:00.000Z`);
}

export function addMinutesToTime(timeDate, minutes) {
  return new Date(timeDate.getTime() + Number(minutes) * 60 * 1000);
}

export function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

export function formatTime(timeDate) {
  return timeDate.toISOString().slice(11, 16);
}

export function getDayOfWeekForApp(date) {
  // JavaScript: 0 = Duminică, 1 = Luni
  // Aplicația noastră: 0 = Luni, 6 = Duminică
  const jsDay = date.getUTCDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function timeToMinutes(timeDate) {
  return timeDate.getUTCHours() * 60 + timeDate.getUTCMinutes();
}

export function minutesToTimeString(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}