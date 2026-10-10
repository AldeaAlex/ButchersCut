import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

export default function TimeSelector({ slots = [], selectedTime, onSelectTime, message }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#c59d5f]" />
          <h4 className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
            Ore disponibile
          </h4>
        </div>
        {slots.length > 0 && (
          <span className="text-[11px] text-gray-400">
            {slots.length} intervale libere
          </span>
        )}
      </div>

      {slots.length === 0 ? (
        <div className="p-3.5 bg-[#141414] border border-amber-900/30 rounded-md text-xs text-amber-200/80 flex items-center gap-2.5">
          <AlertCircle size={16} className="text-[#c59d5f] shrink-0" />
          <span>{message || 'Nu sunt ore disponibile pentru data selectată.'}</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <motion.button
                key={slot}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                onClick={() => onSelectTime(slot)}
                className={`min-h-[44px] py-2.5 px-2 text-xs sm:text-sm font-mono font-bold rounded-md border transition-colors cursor-pointer text-center flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#c59d5f] text-black border-[#c59d5f] shadow-lg font-black'
                    : 'bg-[#181818] border-white/10 text-gray-200 hover:border-white/30 hover:bg-[#222222] active:bg-[#262626]'
                }`}
              >
                {slot}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
