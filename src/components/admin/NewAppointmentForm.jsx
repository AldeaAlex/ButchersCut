import React, { useState, useMemo } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { addMinutes } from '../../utils/dateTime';
import { getAvailableSlotsForDate } from '../../services/availabilityService';

export default function NewAppointmentForm({
  services = [],
  workingHours = [],
  existingAppointments = [],
  onSaveAppointment,
  onSuccess
}) {
  const today = new Date().toISOString().split('T')[0];

  const [serviceId, setServiceId] = useState(services[0]?.id || 1);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('10:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedService = services.find(s => s.id === Number(serviceId)) || services[0];

  // Calcul dinamic ore disponibile pe baza serviciului, datei, pauzelor și programărilor existente
  const { slots: availableSlots } = useMemo(() => {
    return getAvailableSlotsForDate({
      service: selectedService,
      date,
      existingAppointments,
      workingHours
    });
  }, [selectedService, date, existingAppointments, workingHours]);

  const isSlotValid = availableSlots.includes(time);
  const calculatedEndTime = selectedService ? addMinutes(time, Number(selectedService.durationMinutes || 30)) : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !date || !time) {
      alert('Te rugăm să completezi câmpurile obligatorii.');
      return;
    }

    if (!isSlotValid) {
      const confirmOverride = window.confirm(
        `Atenție: Ora ${time} se suprapune cu o pauză de lucru sau cu o altă programare.\n\nDorești să continui salvarea programării?`
      );
      if (!confirmOverride) return;
    }

    const duration = Number(selectedService?.durationMinutes || 30);
    const endTime = addMinutes(time, duration);

    const newApp = {
      id: Date.now(),
      serviceId: selectedService.id,
      service: selectedService.name,
      price: selectedService.price,
      duration: selectedService.dur || `${duration} min`,
      durationMinutes: duration,
      date,
      time,
      startTime: time,
      endTime,
      customerName: clientName,
      clientName,
      customerPhone: clientPhone,
      clientPhone,
      customerEmail: clientEmail,
      clientEmail,
      notes,
      status: 'CONFIRMED'
    };

    onSaveAppointment(newApp);
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div className="bg-[#181818] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="font-serif text-2xl font-bold text-white">
          Programează client
        </h3>
        <p className="text-xs text-gray-400 mt-1 font-light">
          Adaugă manual o programare în calendarul frizerului.
        </p>
      </div>

      {savedSuccess ? (
        <div className="p-8 text-center space-y-3 bg-emerald-950/40 border border-emerald-800/50 rounded-sm">
          <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
          <h4 className="font-serif text-lg font-bold text-white">Programare salvată cu succes!</h4>
          <p className="text-xs text-gray-300">Programarea a fost adăugată în calendar.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Serviciu */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
              Serviciu *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f] cursor-pointer"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.dur || `${s.durationMinutes} min`} — {s.price} lei
                </option>
              ))}
            </select>
          </div>

          {/* Data și Ora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                Data programării *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
                Ora programării *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f] cursor-pointer"
              />

              {time && (
                <div className="mt-1.5">
                  {isSlotValid ? (
                    <span className="text-[11px] text-emerald-400 block font-medium">
                      ✓ Interval liber: {time} - {calculatedEndTime}
                    </span>
                  ) : (
                    <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/40 p-2 rounded flex items-center gap-1.5 mt-1">
                      <AlertTriangle size={13} className="shrink-0 text-amber-400" />
                      <span>Ora selectată se suprapune cu o pauză, altă rezervare sau depășește programul.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sugestii ore libere calculate automat */}
          {availableSlots.length > 0 && (
            <div className="p-3 bg-[#161616] border border-white/5 rounded-sm space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                Ore libere calculate pentru această zi ({availableSlots.length} disponibile):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      time === slot
                        ? 'bg-[#c59d5f] text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1">
                Nume client *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Mihai Popa"
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f] min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1">
                Telefon client *
              </label>
              <input
                type="tel"
                required
                placeholder="Ex: 0721 000 000"
                autoComplete="tel"
                inputMode="tel"
                enterKeyHint="next"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f] min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1">
              Email opțional
            </label>
            <input
              type="email"
              placeholder="client@exemplu.ro"
              autoComplete="email"
              inputMode="email"
              enterKeyHint="next"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f] min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1">
              Notițe opționale
            </label>
            <textarea
              rows={2}
              placeholder="Cerințe speciale, preferințe client..."
              enterKeyHint="done"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#222222] border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#c59d5f]"
            />
          </div>

          <div className="pt-2">
            <PrimaryButton type="submit" size="md" className="w-full justify-center min-h-[48px]">
              SALVEAZĂ PROGRAMAREA
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  );
}
