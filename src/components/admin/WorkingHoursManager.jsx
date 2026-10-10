import React, { useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import { Clock, CheckCircle2, AlertCircle, Sparkles, Plus, Trash2, Coffee } from 'lucide-react';
import { intervalsOverlap, timeStringToMinutes } from '../../utils/dateTime';

export default function WorkingHoursManager({ workingHours = [], onSaveWorkingHours }) {
  const [schedule, setSchedule] = useState(() => {
    return workingHours.map(d => ({
      ...d,
      breaks: Array.isArray(d.breaks) ? d.breaks : []
    }));
  });
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
              endTime: !d.isWorkingDay ? (d.endTime || '19:00') : d.endTime,
              breaks: d.breaks || []
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

  // Adăugare pauză STRICT prin butonul +
  const handleAddBreak = (dayOfWeek) => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        const currentBreaks = d.breaks || [];

        // Sugerăm intervale logice de pauză
        let defaultStart = '13:00';
        let defaultEnd = '14:00';

        if (currentBreaks.length > 0) {
          const lastBreak = currentBreaks[currentBreaks.length - 1];
          const lastEndMins = timeStringToMinutes(lastBreak.endTime);
          const nextStartMins = lastEndMins + 60;
          const nextEndMins = nextStartMins + 30;
          const dayEndMins = timeStringToMinutes(d.endTime || '19:00');

          if (nextEndMins <= dayEndMins) {
            const h1 = String(Math.floor(nextStartMins / 60)).padStart(2, '0');
            const m1 = String(nextStartMins % 60).padStart(2, '0');
            const h2 = String(Math.floor(nextEndMins / 60)).padStart(2, '0');
            const m2 = String(nextEndMins % 60).padStart(2, '0');
            defaultStart = `${h1}:${m1}`;
            defaultEnd = `${h2}:${m2}`;
          }
        }

        const newBreak = {
          id: Date.now() + Math.random().toString(36).substring(2, 6),
          startTime: defaultStart,
          endTime: defaultEnd
        };

        return {
          ...d,
          breaks: [...currentBreaks, newBreak]
        };
      })
    );
  };

  // Modificare ore pauză
  const handleBreakChange = (dayOfWeek, breakId, field, value) => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        return {
          ...d,
          breaks: (d.breaks || []).map(b =>
            b.id === breakId ? { ...b, [field]: value } : b
          )
        };
      })
    );
  };

  // Ștergere pauză
  const handleDeleteBreak = (dayOfWeek, breakId) => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        return {
          ...d,
          breaks: (d.breaks || []).filter(b => b.id !== breakId)
        };
      })
    );
  };

  // Preset rapid: Luni-Vineri 09:00 - 19:00 cu pauză 13:00-14:00, Sâmbătă 09:00 - 16:00, Duminică Închis
  const applyStandardSchedule = () => {
    setSchedule(prev =>
      prev.map(d => {
        if (d.dayOfWeek >= 0 && d.dayOfWeek <= 4) {
          return {
            ...d,
            isWorkingDay: true,
            startTime: '09:00',
            endTime: '19:00',
            breaks: [{ id: `std-${d.dayOfWeek}`, startTime: '13:00', endTime: '14:00' }]
          };
        } else if (d.dayOfWeek === 5) {
          return {
            ...d,
            isWorkingDay: true,
            startTime: '09:00',
            endTime: '16:00',
            breaks: []
          };
        } else {
          return {
            ...d,
            isWorkingDay: false,
            startTime: '',
            endTime: '',
            breaks: []
          };
        }
      })
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMessage('');

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

        const dayStartMins = timeStringToMinutes(d.startTime);
        const dayEndMins = timeStringToMinutes(d.endTime);
        const breaks = d.breaks || [];

        for (let i = 0; i < breaks.length; i++) {
          const b = breaks[i];
          if (!b.startTime || !b.endTime) {
            setErrorMessage(`Completează ambele ore pentru toate pauzele din ${d.label}.`);
            return;
          }
          if (b.startTime >= b.endTime) {
            setErrorMessage(`Pentru ${d.label}, pauza de la ${b.startTime} trebuie să aibă o oră de sfârșit (${b.endTime}) ulterioară.`);
            return;
          }
          const bStartMins = timeStringToMinutes(b.startTime);
          const bEndMins = timeStringToMinutes(b.endTime);

          if (bStartMins < dayStartMins || bEndMins > dayEndMins) {
            setErrorMessage(`Pauza (${b.startTime} - ${b.endTime}) din ${d.label} trebuie să se afle în intervalul de lucru (${d.startTime} - ${d.endTime}).`);
            return;
          }

          // Verifică suprapunerea între pauzele din aceeași zi
          for (let j = i + 1; j < breaks.length; j++) {
            const b2 = breaks[j];
            const b2StartMins = timeStringToMinutes(b2.startTime);
            const b2EndMins = timeStringToMinutes(b2.endTime);
            if (intervalsOverlap(bStartMins, bEndMins, b2StartMins, b2EndMins)) {
              setErrorMessage(`Pauzele (${b.startTime}-${b.endTime}) și (${b2.startTime}-${b2.endTime}) din ${d.label} se suprapun.`);
              return;
            }
          }
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
            Program de lucru & Pauze
          </h3>
          <p className="text-xs text-gray-400 font-light">
            Setează intervalul orar și pauzele de lucru. Sistemul calculează automat disponibilitatea programărilor în funcție de durată.
          </p>
        </div>

        {/* Buton Preset Rapid pentru setare ușoară */}
        <button
          type="button"
          onClick={applyStandardSchedule}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:border-[#c59d5f] text-[11px] text-gray-300 hover:text-[#c59d5f] transition-colors cursor-pointer active:scale-95"
          title="Aplică orar standard L-V 09:00-19:00 (pauză 13-14), Sâm 09:00-16:00"
        >
          <Sparkles size={13} className="text-[#c59d5f]" />
          <span>Orar Standard (L-V 09-19, Pauză 13-14)</span>
        </button>
      </div>

      {/* Mesaj de succes */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-950/70 border border-emerald-800/40 rounded-sm text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>Programul și pauzele au fost salvate cu succes! Intervalele orare disponibile au fost recalculate automat.</span>
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
      <form onSubmit={handleSave} className="space-y-3.5 w-full">
        {schedule.map((day) => (
          <div
            key={day.dayOfWeek}
            className={`p-3 sm:p-4 rounded-md border transition-all space-y-3 w-full ${
              day.isWorkingDay
                ? 'bg-[#1f1f1f] border-white/15 shadow-sm'
                : 'bg-[#141414] border-white/5 opacity-75'
            }`}
          >
            {/* Rând Superior: Switch Toggle + Nume Zi + Badge */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none min-w-0">
                {/* Custom Toggle Switch */}
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

            {/* Rând Ore de Lucru */}
            {day.isWorkingDay ? (
              <div className="space-y-3">
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

                {/* Secțiune Pauze de Lucru - adăugate STRICT prin butonul + */}
                <div className="pt-2.5 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <Coffee size={13} className="text-[#c59d5f]" />
                      <span>Pauze de lucru ({day.breaks?.length || 0})</span>
                    </div>

                    {/* Butonul strict + pentru adăugare pauză */}
                    <button
                      type="button"
                      onClick={() => handleAddBreak(day.dayOfWeek)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#c59d5f]/15 border border-[#c59d5f]/40 hover:bg-[#c59d5f] hover:text-black text-[#c59d5f] text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
                      title="Adaugă perioadă de pauză"
                    >
                      <Plus size={13} />
                      <span>Adaugă pauză</span>
                    </button>
                  </div>

                  {(!day.breaks || day.breaks.length === 0) ? (
                    <p className="text-[11px] text-gray-500 italic pl-0.5">
                      Nicio pauză adăugată. Folosește butonul <strong className="text-gray-400">+ Adaugă pauză</strong> pentru intervale de masă sau repaus.
                    </p>
                  ) : (
                    <div className="space-y-1.5 pt-0.5">
                      {day.breaks.map((b, bIdx) => {
                        const durMins = (b.startTime && b.endTime)
                          ? Math.max(0, timeStringToMinutes(b.endTime) - timeStringToMinutes(b.startTime))
                          : 0;

                        return (
                          <div
                            key={b.id || bIdx}
                            className="flex items-center justify-between gap-2 bg-[#161616] border border-white/10 rounded px-2.5 py-2 text-xs"
                          >
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider shrink-0 font-medium">
                              Pauză #{bIdx + 1}
                            </span>

                            <div className="flex items-center gap-1.5 flex-1 max-w-[220px] justify-center">
                              <input
                                type="time"
                                required
                                value={b.startTime || '13:00'}
                                onChange={(e) => handleBreakChange(day.dayOfWeek, b.id, 'startTime', e.target.value)}
                                className="bg-[#1c1c1c] border border-white/15 rounded px-1.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#c59d5f] text-center w-20"
                              />
                              <span className="text-gray-500 font-bold text-[10px] select-none">➔</span>
                              <input
                                type="time"
                                required
                                value={b.endTime || '14:00'}
                                onChange={(e) => handleBreakChange(day.dayOfWeek, b.id, 'endTime', e.target.value)}
                                className="bg-[#1c1c1c] border border-white/15 rounded px-1.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#c59d5f] text-center w-20"
                              />
                            </div>

                            {durMins > 0 && (
                              <span className="text-[10px] text-[#c59d5f] font-mono shrink-0 hidden sm:inline">
                                {durMins} min
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteBreak(day.dayOfWeek, b.id)}
                              className="text-gray-500 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                              title="Șterge această pauză"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
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

        {/* Buton Salvare */}
        <div className="pt-3">
          <PrimaryButton type="submit" size="md" className="w-full justify-center min-h-[46px] shadow-lg">
            SALVEAZĂ PROGRAMUL & PAUZELE
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
