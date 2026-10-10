/**
 * Utilitare pentru exportul programărilor în calendarul nativ al telefonului (iOS / Android)
 */

export function formatDateTimeForCalendar(dateStr, timeStr) {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:mm"
  const cleanDate = dateStr.replace(/-/g, '');
  const cleanTime = timeStr.replace(/:/g, '');
  return `${cleanDate}T${cleanTime}00`;
}

/**
 * Generează URL-ul pentru deschiderea directă în aplicația de Calendar pe Android
 */
export function getGoogleCalendarUrl(booking) {
  const { service, date, startTime, endTime, price, customerName } = booking;
  
  const start = formatDateTimeForCalendar(date, startTime);
  const end = formatDateTimeForCalendar(date, endTime);
  
  const title = encodeURIComponent(`Programare Butcher's Cut - ${service}`);
  const details = encodeURIComponent(
    `Programare la Butcher's Cut\n\n` +
    `Client: ${customerName}\n` +
    `Serviciu: ${service}\n` +
    `Preț: ${price} lei\n` +
    `Interval: ${startTime} - ${endTime}\n` +
    `Telefon salon: 0785 960 301\n` +
    `Locație: Butcher's Cut`
  );
  const location = encodeURIComponent("Butcher's Cut");
  
  // Parametrul ctz=Europe/Bucharest asigură fusul orar corect
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&ctz=Europe/Bucharest`;
}

/**
 * Generează și descarcă evenimentul în formatul nativ .ics (pentru Apple Calendar pe iPhone)
 */
export function downloadIcsCalendarFile(booking) {
  const { service, date, startTime, endTime, price, customerName } = booking;
  
  const start = formatDateTimeForCalendar(date, startTime);
  const end = formatDateTimeForCalendar(date, endTime);
  
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Butchers Cut//RO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:butchers-cut-${booking.id || Date.now()}@butcherscut.ro`,
    `DTSTAMP:${formatDateTimeForCalendar(new Date().toISOString().split('T')[0], '12:00')}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Programare Butcher's Cut - ${service}`,
    `DESCRIPTION:Programare Butcher's Cut pentru ${customerName}\\nServiciu: ${service}\\nPreț: ${price} lei\\nInterval: ${startTime} - ${endTime}\\nTelefon salon: 0785 960 301`,
    `LOCATION:Butcher's Cut`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `programare-butchers-cut.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(url), 2000);
}

/**
 * Funcție inteligentă dedicată pentru mobil (98% utilizatori pe telefon):
 * - Pe iPhone (iOS): lansează calendarul nativ Apple Calendar prin fișierul standard .ics
 * - Pe telefoane Android: lansează direct aplicația nativă Google Calendar / Calendarul telefonului
 * - Pe Desktop: deschide direct calendarul în browser
 */
export function openMobileCalendar(booking) {
  if (!booking) return;

  const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);

  if (isIOS) {
    // Deschide nativ în Apple Calendar pe iPhone
    downloadIcsCalendarFile(booking);
  } else if (isAndroid) {
    // Deschide nativ în aplicația de Calendar a telefonului Android
    const googleUrl = getGoogleCalendarUrl(booking);
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  } else {
    // Desktop / Laptop
    const googleUrl = getGoogleCalendarUrl(booking);
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  }
}
