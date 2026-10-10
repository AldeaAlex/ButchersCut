import React from 'react';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';

export default function CalendarPicker({ selectedDate, onChangeDate }) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Generează următoarele 7 zile pentru selecție rapidă cu 1 tap pe telefon
  const quickDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Azi' : i === 1 ? 'Mâine' : d.toLocaleDateString('ro-RO', { weekday: 'short' });
    const formattedDay = d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
    return {
      dateStr,
      label: dayName,
      subLabel: formattedDay
    };
  });

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#c59d5f] text-black font-bold text-xs flex items-center justify-center shrink-0">
            2
          </span>
          <h3 className="font-serif text-base sm:text-lg font-bold text-white">
            Alege data
          </h3>
        </div>
        <span className="text-[11px] text-[#c59d5f] font-mono">
          {new Date(selectedDate).toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'long' })}
        </span>
      </div>

      {/* Selector rapid de zile pe orizontală (Thumb friendly pe mobil) */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none -mx-1 px-1">
        {quickDays.map((q) => {
          const isSelected = selectedDate === q.dateStr;
          return (
            <button
              key={q.dateStr}
              type="button"
              onClick={() => onChangeDate(q.dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] py-2 px-2.5 rounded-md border transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#c59d5f] text-black border-[#c59d5f] shadow-lg font-bold'
                  : 'bg-[#181818] border-white/10 text-gray-300 hover:border-white/30 hover:bg-[#202020]'
              }`}
            >
              <span className={`text-[11px] uppercase tracking-wider capitalize ${isSelected ? 'text-black font-extrabold' : 'text-[#c59d5f] font-semibold'}`}>
                {q.label}
              </span>
              <span className="text-xs font-mono mt-0.5">
                {q.subLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input nativ de dată pentru selectarea unei alte zile */}
      <div className="relative pt-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 pt-1 flex items-center pointer-events-none text-[#c59d5f]">
          <CalendarIcon size={16} />
        </div>
        <input
          type="date"
          min={todayStr}
          value={selectedDate}
          onChange={(e) => onChangeDate(e.target.value)}
          required
          className="w-full bg-[#181818] border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c59d5f] transition-colors cursor-pointer min-h-[44px]"
        />
      </div>
    </div>
  );
}
