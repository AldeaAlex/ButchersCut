import React from 'react';
import { Calendar, DollarSign, CheckCircle2, Scissors } from 'lucide-react';

export default function StatsCards({ appointments = [] }) {
  const total = appointments.length;
  const revenue = appointments.reduce((sum, item) => sum + (Number(item.price) || 50), 0);
  const confirmed = appointments.filter(a => a.status === 'Confirmat' || a.status === 'CONFIRMED' || a.status === 'Confirmată').length;

  const stats = [
    { label: 'Total Programări', value: total, icon: Calendar, color: 'text-[#c59d5f]' },
    { label: 'Încasări Estimate', value: `${revenue} lei`, icon: DollarSign, color: 'text-[#c59d5f]' },
    { label: 'Confirmate', value: confirmed, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Salon Activ', value: 'Deschis', icon: Scissors, color: 'text-[#c59d5f]' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="bg-[#181818] border border-white/10 p-3 sm:p-5 rounded-sm flex items-center justify-between"
          >
            <div className="min-w-0 pr-1">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 font-medium truncate">{s.label}</p>
              <p className="font-serif text-lg sm:text-2xl font-bold text-white mt-0.5 sm:mt-1 truncate">{s.value}</p>
            </div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 ${s.color}`}>
              <Icon size={16} className="sm:hidden" />
              <Icon size={20} className="hidden sm:block" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
