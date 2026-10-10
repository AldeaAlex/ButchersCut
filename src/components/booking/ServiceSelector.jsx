import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Check } from 'lucide-react';
import { SERVICES } from '../../data/services';

export default function ServiceSelector({ services = SERVICES, selectedServiceId, onSelectService }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[#c59d5f] text-black font-bold text-xs flex items-center justify-center">
          1
        </span>
        <h3 className="font-serif text-lg font-bold text-white">
          Alege serviciul
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <motion.button
              key={service.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => onSelectService(service)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-md border transition-colors duration-200 flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#c59d5f]/15 border-[#c59d5f] shadow-lg'
                  : 'bg-[#181818] border-white/10 hover:border-white/25 active:bg-[#202020]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-[#c59d5f] text-black shadow'
                      : 'bg-white/5 text-[#c59d5f]'
                  }`}
                >
                  <Scissors size={15} className="-rotate-45" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-white leading-snug truncate">
                    {service.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-light truncate">
                    {service.description || 'Serviciu frizerie profesional'}
                  </p>
                  <span className="inline-block text-[10px] text-gray-300 font-medium bg-white/5 px-1.5 py-0.5 rounded mt-1">
                    ⏱ {service.dur || `${service.durationMinutes} min`}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="font-serif text-base sm:text-lg font-bold text-[#c59d5f] block leading-none">
                  {service.price} lei
                </span>
                {isSelected ? (
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[10px] text-[#c59d5f] uppercase tracking-wider font-bold inline-flex items-center gap-0.5 mt-1"
                  >
                    <Check size={12} /> Ales
                  </motion.span>
                ) : (
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider inline-block mt-1">
                    Selectează
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
