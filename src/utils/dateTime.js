// Logica de calcul date și ore extrasă din sistemul original Butcher's Cut

export function parseDateOnly(dateValue) {
  return new Date(`${dateValue}T00:00:00.000Z`);
}

export function getDayOfWeekForApp(date) {
  // JavaScript: 0 = Duminică, 1 = Luni ... 6 = Sâmbătă
  // Butcher's Cut: 0 = Luni, 1 = Marți ... 5 = Sâmbătă, 6 = Duminică
  const jsDay = date.getUTCDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  if (typeof timeStr === 'object' && timeStr.getUTCHours) {
    return timeStr.getUTCHours() * 60 + timeStr.getUTCMinutes();
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTimeString(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

export function addMinutes(timeStr, minutesToAdd) {
  const mins = timeStringToMinutes(timeStr) + Number(minutesToAdd);
  return minutesToTimeString(mins);
}
