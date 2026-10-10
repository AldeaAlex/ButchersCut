import React from 'react';
import { User, Phone, MessageSquare } from 'lucide-react';
import PrimaryButton from '../common/PrimaryButton';

export default function CustomerForm({
  customerData,
  onChangeCustomer,
  onSubmit,
  selectedService,
  selectedDate,
  selectedTime,
  onBack,
  isSubmitting = false
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Recapitulare serviciu & orar ales */}
      {selectedService && selectedDate && selectedTime && (
        <div className="bg-[#141414] border border-[#c59d5f]/40 p-4 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">
              Rezumat programare:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-base">
                {selectedService.name}
              </span>
              <span className="text-gray-400">({selectedService.dur})</span>
            </div>
          </div>
          <div className="flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
            <span className="text-[#c59d5f] font-mono font-semibold text-sm">
              {selectedDate} · {selectedTime}
            </span>
            <span className="font-serif font-bold text-white text-lg">
              {selectedService.price} lei
            </span>
          </div>
        </div>
      )}

      {/* Câmpuri date client: Nume obligatoriu, Telefon opțional, Observații opționale */}
      <div className="space-y-4">
        {/* Nume client (obligatoriu) */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
            Nume complet <span className="text-[#c59d5f]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c59d5f]">
              <User size={16} />
            </div>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ex: Andrei Popescu"
              autoComplete="name"
              autoCapitalize="words"
              value={customerData.name}
              onChange={(e) => onChangeCustomer({ ...customerData, name: e.target.value })}
              className="w-full bg-[#141414] border border-white/10 rounded-md py-3 pl-10 pr-4 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c59d5f] transition-colors min-h-[48px]"
            />
          </div>
        </div>

        {/* Telefon client (OPȚIONAL) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium">
              Număr de telefon
            </label>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Opțional
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Phone size={16} />
            </div>
            <input
              type="tel"
              placeholder="07xx xxx xxx"
              autoComplete="tel"
              inputMode="tel"
              value={customerData.phone}
              onChange={(e) => onChangeCustomer({ ...customerData, phone: e.target.value })}
              className="w-full bg-[#141414] border border-white/10 rounded-md py-3 pl-10 pr-4 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c59d5f] transition-colors min-h-[48px]"
            />
          </div>
        </div>

        {/* Observații / Mențiuni (OPȚIONAL) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium">
              Observații pentru frizer
            </label>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Opțional
            </span>
          </div>
          <div className="relative">
            <textarea
              rows={2}
              placeholder="Ex: Tuns scurt pe margini, contur barbă..."
              value={customerData.notes}
              onChange={(e) => onChangeCustomer({ ...customerData, notes: e.target.value })}
              className="w-full bg-[#141414] border border-white/10 rounded-md p-3 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c59d5f] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Butoane de navigare pas 3 */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto py-3 px-5 rounded-md border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs uppercase tracking-wider transition-colors cursor-pointer min-h-[48px]"
          >
            &larr; Pasul anterior
          </button>
        )}

        <PrimaryButton
          type="submit"
          size="lg"
          disabled={isSubmitting || !customerData.name.trim()}
          className="w-full sm:flex-1 justify-center min-h-[48px] text-xs sm:text-sm tracking-[0.18em]"
        >
          {isSubmitting ? 'SE CONFIRMĂ...' : 'FINALIZEAZĂ PROGRAMAREA'}
        </PrimaryButton>
      </div>
    </form>
  );
}
