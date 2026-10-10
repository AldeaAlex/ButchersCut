import React, { useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import { Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function WorkingHoursManager({ workingHours = [], onSaveWorkingHours }) {
  const [schedule, setSchedule] = useState(workingHours);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleToggleDay = (dayOfWeek) => {
    setSchedule(prev =>
      prev.map(d =>
        d.dayOfWeek === dayOfWeek
          ? {
              ...d,
              isWorkingDay: !d.isWorkingDay,
              startTime: !d.isWorkingDay ? (d.startTime || '09:00') : d.startTime,
              endTime: !d.isWorkingDay ? (d.endTime || '19:00') : d.endTime
            }
          : d
      )
    );
  };

  const handleTimeChange = (dayOfWeek, field, value) => {
    setSchedule(prev =>
      prev.map(d =>
        d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d
      )
    );
  };

  // Preset rapid: Luni-Vineri 09:00 - 19:00, Sâmbătă 09:00 - 16:00, Duminică Închis
  const applyStandardSchedule = () => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.dayOfWeek >= 1 && d.dayOfWeek <= 5) {
          return { ...d, isWorkingDay: true, startTime: '09:00', endTime: '19:00' };
        } else if (d.dayOfWeek === 6) {
          return { ...d, isWorkingDay: true, startTime: '09:00', endTime: '16:00' };
        } else {
          return { ...d, isWorkingDay: false, startTime: '', endTime: '' };
        }
      })
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validare: startTime < endTime pentru zilele active
    for (const d of schedule) {
      if (d.isWorkingDay) {
        if (!d.startTime || !d.endTime) {
          setErrorMessage(`Completează orele de început și sfârșit pentru ${d.label}.`);
          return;
        }
        if (d.startTime >= d.endTime) {
          setErrorMessage(`Pentru ${d.label}, ora de început (${d.startTime}) trebuie să fie înainte de ora de sfârșit (${d.endTime}).`);
          return;
        }
      }
    }

    onSaveWorkingHours(schedule);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="bg-[#181818] border border-white/10 rounded-sm p-3.5 sm:p-6 md:p-8 shadow-xl max-w-3xl mx-auto space-y-5 sm:space-y-6 w-full overflow-hidden">
      {/* Header cu aspect compact pe telefon */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#c59d5f] font-semibold">
            <Clock size={15} /> Program Săptămânal Frizerie
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Program de lucru
          </h3>
          <p className="text-xs text-gray-400 font-light">
            Setează intervalul orar disponibil pentru fiecare zi.
          </p>
        </div>

        {/* Buton Preset Rapid pentru setare ușoară */}
        <button
          type="button"
          onClick={applyStandardSchedule}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-[#c59d5f] text-[11px] text-gray-300 hover:text-[#c59d5f] transition-colors cursor-pointer active:scale-95"
          title="Aplică orar standard L-V 09:00-19:00, Sâm 09:00-16:00"
        >
          <Sparkles size={13} className="text-[#c59d5f]" />
          <span>Orar Standard (L-V 09-19, S 09-16)</span>
        </button>
      </div>

      {/* Mesaj de succes */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-950/70 border border-emerald-800/40 rounded-sm text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>Programul a fost salvat cu succes! Intervalele orare pentru programările online au fost recalculate.</span>
        </div>
      )}

      {/* Mesaj de eroare */}
      {errorMessage && (
        <div className="p-3.5 bg-red-950/70 border border-red-800/40 rounded-sm text-xs text-red-300 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Listă Zile perfect încadrată pe mobil fără overflow */}
      <form onSubmit={handleSave} className="space-y-3 w-full">
        {schedule.map((day) => (
          <div
            key={day.dayOfWeek}
            className={`p-3 sm:p-4 rounded-md border transition-all space-y-2.5 w-full ${
              day.isWorkingDay
                ? 'bg-[#1f1f1f] border-white/15 shadow-sm'
                : 'bg-[#141414] border-white/5 opacity-75'
            }`}
          >
            {/* Rând Superior: Switch Toggle + Nume Zi + Badge */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none min-w-0">
                {/* Custom Toggle Switch ușor de apăsat cu degetul */}
                <div className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={day.isWorkingDay}
                    onChange={() => handleToggleDay(day.dayOfWeek)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#333333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c59d5f]" />
                </div>

                <span className={`font-serif text-base sm:text-lg font-bold truncate ${day.isWorkingDay ? 'text-white' : 'text-gray-400'}`}>
                  {day.label}
                </span>
              </label>

              {/* Status Badge */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 border ${
                  day.isWorkingDay
                    ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800/40'
                    : 'bg-gray-800/80 text-gray-400 border-white/5'
                }`}
              >
                {day.isWorkingDay ? 'Deschis' : 'Închis'}
              </span>
            </div>

            {/* Rând Inferior: Interval orar fluid, centrat, fără overflow */}
            {day.isWorkingDay ? (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
                {/* De la */}
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 truncate">
                    De la ora
                  </label>
                  <input
                    type="time"
                    required
                    value={day.startTime || '09:00'}
                    onChange={(e) => handleTimeChange(day.dayOfWeek, 'startTime', e.target.value)}
                    className="w-full min-w-0 bg-[#161616] border border-white/20 rounded px-2 py-2 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#c59d5f] text-center"
                  />
                </div>

                {/* Săgeată separator */}
                <div className="text-gray-500 font-bold pt-4 text-xs select-none shrink-0 px-0.5">
                  ➔
                </div>

                {/* Până la */}
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 truncate">
                    Până la ora
                  </label>
                  <input
                    type="time"
                    required
                    value={day.endTime || '19:00'}
                    onChange={(e) => handleTimeChange(day.dayOfWeek, 'endTime', e.target.value)}
                    className="w-full min-w-0 bg-[#161616] border border-white/20 rounded px-2 py-2 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#c59d5f] text-center"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-1.5 border-t border-white/5">
                <p className="text-[11px] text-gray-500 italic">
                  Salonul este închis în această zi (zi liberă).
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Buton Salvare - dimensiune optimă pentru deget */}
        <div className="pt-3">
          <PrimaryButton type="submit" size="md" className="w-full justify-center min-h-[46px] shadow-lg">
            SALVEAZĂ PROGRAMUL
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
