import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, UserX, Trash2, Filter } from 'lucide-react';

export default function AppointmentsList({ appointments = [], onUpdateStatus, onDelete }) {
  const [filterDate, setFilterDate] = useState('');

  const filtered = filterDate
    ? appointments.filter(a => a.date === filterDate)
    : appointments;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'Confirmat':
      case 'Confirmată':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2 size={12} /> Confirmată
          </span>
        );
      case 'COMPLETED':
      case 'Finalizat':
      case 'Finalizată':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/70 text-blue-400 border border-blue-800/40">
            <Clock size={12} /> Finalizată
          </span>
        );
      case 'CANCELLED':
      case 'Anulat':
      case 'Anulată':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/70 text-red-400 border border-red-800/40">
            <XCircle size={12} /> Anulată
          </span>
        );
      case 'NO_SHOW':
      case 'Neprezentat':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/70 text-amber-400 border border-amber-800/40">
            <UserX size={12} /> Neprezentat
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#181818] border border-white/10 rounded-sm overflow-hidden shadow-xl">
      {/* Header & Date Filter */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414]">
        <div>
          <h3 className="font-serif text-xl font-bold text-white">
            Programări
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-light">
            Vezi și administrează programările pentru ziua selectată.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#c59d5f]" />
          <span className="text-xs text-gray-400 hidden sm:inline">Selectează ziua:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-[#202020] border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c59d5f] cursor-pointer"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-gray-400 hover:text-white underline ml-1 cursor-pointer"
            >
              Toate zilele
            </button>
          )}
        </div>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="md:hidden divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="py-12 px-4 text-center text-gray-500 font-light text-xs">
            {filterDate
              ? 'Nu există programări pentru ziua selectată.'
              : 'Nu există nicio programare înregistrată.'}
          </div>
        ) : (
          filtered.map((app) => (
            <div key={app.id} className="p-4 space-y-3 bg-[#181818] hover:bg-[#1c1c1c] transition-colors">
              {/* Header Card: Ora + Dată + Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded bg-[#c59d5f]/15 border border-[#c59d5f]/30 text-[#c59d5f] font-mono font-bold text-xs">
                    {app.startTime || app.time} {app.endTime ? `– ${app.endTime}` : ''}
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {app.date}
                  </span>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>

              {/* Informații Client & Serviciu */}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div>
                  <h4 className="font-serif text-base font-bold text-white leading-snug">
                    {app.customerName || app.clientName}
                  </h4>
                  <a
                    href={`tel:${app.customerPhone || app.clientPhone}`}
                    className="inline-flex items-center gap-1 text-xs text-[#c59d5f] hover:underline font-mono mt-0.5"
                  >
                    📞 {app.customerPhone || app.clientPhone}
                  </a>
                  {(app.customerEmail || app.clientEmail) && (
                    <p className="text-[11px] text-gray-400 truncate max-w-[200px]">
                      {app.customerEmail || app.clientEmail}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-serif text-lg font-bold text-[#c59d5f] block leading-none">
                    {app.price} lei
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {app.service?.name || app.service}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {app.duration || (app.durationMinutes ? `${app.durationMinutes} min` : '')}
                  </span>
                </div>
              </div>

              {/* Notițe dacă există */}
              {app.notes && (
                <div className="p-2 bg-[#121212] border border-white/5 rounded text-[11px] text-gray-400 italic">
                  "{app.notes}"
                </div>
              )}

              {/* Acțiuni Mobile: Status Select + Delete Button */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <select
                    value={
                      app.status === 'Confirmat' ? 'CONFIRMED' :
                      app.status === 'Finalizat' ? 'COMPLETED' :
                      app.status === 'Anulat' ? 'CANCELLED' :
                      app.status
                    }
                    onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                    className="w-full bg-[#202020] border border-white/15 rounded text-xs px-2.5 py-2 text-gray-200 focus:outline-none focus:border-[#c59d5f] cursor-pointer"
                  >
                    <option value="CONFIRMED">Confirmată</option>
                    <option value="COMPLETED">Finalizată</option>
                    <option value="CANCELLED">Anulată</option>
                    <option value="NO_SHOW">Neprezentat</option>
                  </select>
                </div>

                <button
                  onClick={() => onDelete(app.id)}
                  className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded transition-colors cursor-pointer shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                  title="Șterge programarea"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-gray-300">
          <thead className="bg-[#121212] text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Interval Orar</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Serviciu</th>
              <th className="py-3.5 px-4">Preț</th>
              <th className="py-3.5 px-4">Status & Modificare</th>
              <th className="py-3.5 px-4 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500 font-light">
                  {filterDate
                    ? 'Nu există programări pentru ziua selectată.'
                    : 'Nu există nicio programare înregistrată.'}
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  {/* Time */}
                  <td className="py-3.5 px-4">
                    <span className="text-white font-bold block text-sm font-mono">
                      {app.startTime || app.time}
                    </span>
                    {app.endTime && (
                      <span className="text-xs text-gray-500 font-mono block">
                        până la {app.endTime}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {app.date}
                    </span>
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{app.customerName || app.clientName}</p>
                    <a
                      href={`tel:${app.customerPhone || app.clientPhone}`}
                      className="text-xs text-[#c59d5f] hover:underline font-mono"
                    >
                      {app.customerPhone || app.clientPhone}
                    </a>
                    {(app.customerEmail || app.clientEmail) && (
                      <p className="text-[11px] text-gray-400 truncate max-w-[180px]">
                        {app.customerEmail || app.clientEmail}
                      </p>
                    )}
                    {app.notes && (
                      <p className="text-[11px] text-gray-400 italic mt-1 bg-white/5 p-1 rounded">
                        "{app.notes}"
                      </p>
                    )}
                  </td>

                  {/* Service */}
                  <td className="py-3.5 px-4">
                    <span className="font-serif font-bold text-white block">
                      {app.service?.name || app.service}
                    </span>
                    <span className="text-xs text-gray-400">
                      {app.duration || (app.durationMinutes ? `${app.durationMinutes} min` : '')}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-serif font-bold text-[#c59d5f] text-base">
                    {app.price} lei
                  </td>

                  {/* Status Dropdown conforming to original schema */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <div>{getStatusBadge(app.status)}</div>
                    <div>
                      <select
                        value={
                          app.status === 'Confirmat' ? 'CONFIRMED' :
                          app.status === 'Finalizat' ? 'COMPLETED' :
                          app.status === 'Anulat' ? 'CANCELLED' :
                          app.status
                        }
                        onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                        className="bg-[#222222] border border-white/15 rounded text-[11px] px-2 py-1 text-gray-200 focus:outline-none focus:border-[#c59d5f] cursor-pointer"
                      >
                        <option value="CONFIRMED">Confirmată</option>
                        <option value="COMPLETED">Finalizată</option>
                        <option value="CANCELLED">Anulată</option>
                        <option value="NO_SHOW">Neprezentat</option>
                      </select>
                    </div>
                  </td>

                  {/* Delete */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onDelete(app.id)}
                      className="text-gray-500 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                      title="Șterge programarea"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
