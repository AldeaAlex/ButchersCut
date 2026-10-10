import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  CalendarPlus,
  Scissors,
  Calendar as CalendarIcon,
  UserCheck,
  ChevronRight,
  Check
} from 'lucide-react';
import ButchersCutLogo from '../components/common/ButchersCutLogo';
import ServiceSelector from '../components/booking/ServiceSelector';
import CalendarPicker from '../components/booking/CalendarPicker';
import TimeSelector from '../components/booking/TimeSelector';
import CustomerForm from '../components/booking/CustomerForm';
import { SERVICES } from '../data/services';
import { getAvailableSlotsForDate } from '../services/availabilityService';
import { addMinutes } from '../utils/dateTime';
import { openMobileCalendar } from '../utils/calendar';

export default function BookingPage({
  onBack,
  onAddAppointment,
  existingAppointments = [],
  services = SERVICES,
  workingHours,
  initialServiceId = null
}) {
  // Pasul curent în fluxul SaaS (1: Serviciu, 2: Dată & Oră, 3: Date Client)
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState(() => {
    if (initialServiceId) {
      const found = services.find((s) => s.id === initialServiceId);
      if (found) return found;
    }
    return services[0] || SERVICES[0];
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculează dinamic orele disponibile pe baza serviciului, datei și programărilor deja existente
  const { slots, message: slotsMessage } = useMemo(() => {
    return getAvailableSlotsForDate({
      service: selectedService,
      date: selectedDate,
      existingAppointments,
      workingHours
    });
  }, [selectedService, selectedDate, existingAppointments, workingHours]);

  // Setează primul slot disponibil dacă cel curent nu mai e valid
  React.useEffect(() => {
    if (slots.length > 0) {
      if (!selectedTime || !slots.includes(selectedTime)) {
        setSelectedTime(slots[0]);
      }
    } else {
      setSelectedTime('');
    }
  }, [slots, selectedTime]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customer.name.trim()) {
      alert('Te rugăm să completezi numele pentru a finaliza programarea.');
      return;
    }

    const duration = Number(selectedService.durationMinutes || 30);
    const endTime = addMinutes(selectedTime, duration);

    const newBooking = {
      id: Date.now(),
      serviceId: selectedService.id,
      service: selectedService.name,
      price: selectedService.price,
      duration: selectedService.dur,
      durationMinutes: duration,
      date: selectedDate,
      time: selectedTime,
      startTime: selectedTime,
      endTime: endTime,
      customerName: customer.name.trim(),
      customerPhone: customer.phone.trim() || 'Nespecificat',
      notes: customer.notes.trim() || '',
      status: 'CONFIRMED'
    };

    if (onAddAppointment) {
      onAddAppointment(newBooking);
    }

    setConfirmedBooking(newBooking);
    setIsSuccess(true);
  };

  // Calcul procente bară de progres
  const progressPercent = step === 1 ? 33.3 : step === 2 ? 66.6 : 100;

  const stepsConfig = [
    { num: 1, label: 'Serviciu', icon: Scissors },
    { num: 2, label: 'Dată & Oră', icon: CalendarIcon },
    { num: 3, label: 'Date Client', icon: UserCheck }
  ];

  // Variante de animație slide între pași
  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.25, ease: 'easeInOut' }
  };

  return (
    <div className="py-5 sm:py-10 px-3 sm:px-6 max-w-3xl mx-auto w-full">
      {/* Buton Înapoi */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-400 hover:text-[#c59d5f] mb-4 sm:mb-6 transition-colors cursor-pointer active:scale-95 min-h-[38px]"
      >
        <ArrowLeft size={16} /> Înapoi la salon
      </button>

      {/* Main SaaS Card */}
      <div className="bg-[#181818] border border-white/10 rounded-md shadow-2xl relative overflow-hidden flex flex-col">
        {/* Bara de încărcare / progres sus (Loading Bar stil SaaS) */}
        {!isSuccess && (
          <div className="w-full bg-[#121212] border-b border-white/10">
            {/* Linia de progres animată */}
            <div className="h-1.5 w-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#b08745] via-[#c59d5f] to-[#e4c28d]"
                initial={{ width: '33.3%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>

            {/* Indicatori pași 1, 2, 3 */}
            <div className="px-4 py-3 sm:px-8 flex items-center justify-between text-xs">
              {stepsConfig.map((s) => {
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;
                const IconComponent = s.icon;

                return (
                  <div
                    key={s.num}
                    onClick={() => {
                      // Poți să te întorci la un pas anterior făcând click pe el
                      if (s.num < step) setStep(s.num);
                    }}
                    className={`flex items-center gap-2 transition-all ${
                      s.num < step ? 'cursor-pointer hover:text-white' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-[#c59d5f] text-black shadow'
                          : isCurrent
                          ? 'border-2 border-[#c59d5f] text-[#c59d5f] bg-[#c59d5f]/10'
                          : 'bg-white/5 border border-white/10 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check size={14} /> : s.num}
                    </div>
                    <div className="hidden sm:block text-left">
                      <span
                        className={`block text-[10px] uppercase tracking-wider font-semibold leading-none ${
                          isCurrent ? 'text-[#c59d5f]' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        Pasul {s.num}
                      </span>
                      <span
                        className={`text-xs font-medium leading-tight ${
                          isCurrent ? 'text-white font-bold' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Corpul Principal */}
        <div className="p-4 sm:p-8 md:p-10">
          {isSuccess && confirmedBooking ? (
            /* Ecran de Succes */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-6 sm:py-8 space-y-5 sm:space-y-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className="w-16 h-16 rounded-full bg-[#c59d5f]/20 border-2 border-[#c59d5f] text-[#c59d5f] flex items-center justify-center mx-auto shadow-lg"
              >
                <CheckCircle2 size={36} />
              </motion.div>

              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#c59d5f] font-semibold">
                  Succes
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  Programare Confirmată!
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto font-light">
                  Te așteptăm la Butcher's Cut. Rezervarea ta este salvată în sistem.
                </p>
              </div>

              {/* Card detalii confirmare */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="bg-[#141414] border border-white/10 p-5 rounded-md text-left max-w-md mx-auto space-y-2.5 text-xs sm:text-sm shadow-inner"
              >
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Serviciu:</span>
                  <span className="font-serif font-bold text-white">{confirmedBooking.service}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Dată & Interval:</span>
                  <span className="text-[#c59d5f] font-semibold font-mono">
                    {confirmedBooking.date} · {confirmedBooking.startTime} - {confirmedBooking.endTime}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Client:</span>
                  <span className="text-white font-medium">{confirmedBooking.customerName}</span>
                </div>
                {confirmedBooking.customerPhone !== 'Nespecificat' && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Telefon:</span>
                    <span className="text-gray-200">{confirmedBooking.customerPhone}</span>
                  </div>
                )}
                {confirmedBooking.notes && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Mențiuni:</span>
                    <span className="text-gray-300 italic">{confirmedBooking.notes}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400">Preț total:</span>
                  <span className="font-serif font-bold text-lg sm:text-xl text-[#c59d5f]">
                    {confirmedBooking.price} lei
                  </span>
                </div>
              </motion.div>

              {/* Butonul Unic dedicat pentru Calendar pe Mobil */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="max-w-md mx-auto space-y-2.5 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  type="button"
                  onClick={() => openMobileCalendar(confirmedBooking)}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-md bg-[#c59d5f] hover:bg-[#b08745] text-black font-bold text-xs sm:text-sm uppercase tracking-[0.16em] transition-colors shadow-xl cursor-pointer min-h-[50px]"
                >
                  <CalendarPlus size={18} className="shrink-0" />
                  <span>Adaugă în Calendar</span>
                </motion.button>
                <p className="text-[11px] text-gray-400 text-center font-light">
                  Deschide automat evenimentul în aplicația de calendar a telefonului tău.
                </p>
              </motion.div>

              <div className="pt-3 flex justify-center">
                <button
                  onClick={onBack}
                  className="inline-flex items-center justify-center text-xs uppercase tracking-[0.18em] text-gray-400 hover:text-white transition-colors py-2 px-4 cursor-pointer"
                >
                  Înapoi la Salon
                </button>
              </div>
            </motion.div>
          ) : (
            /* Flux SaaS în 3 Pași Separați */
            <div>
              <AnimatePresence mode="wait">
                {/* PASUL 1: ALEGERE SERVICIU */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#c59d5f] font-bold block mb-1">
                        Pasul 1 din 3
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                        Alege serviciul dorit
                      </h2>
                      <p className="text-gray-400 text-xs sm:text-sm font-light mt-1">
                        Selectează pachetul de frizerie sau aranjat barbă potrivit stilului tău.
                      </p>
                    </div>

                    <ServiceSelector
                      services={services}
                      selectedServiceId={selectedService?.id}
                      onSelectService={setSelectedService}
                    />

                    {/* Bara de acțiuni Pas 1 */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {selectedService ? (
                        <div className="text-left w-full sm:w-auto">
                          <span className="text-[11px] text-gray-400 block">Selectat:</span>
                          <span className="font-serif font-bold text-white text-sm">
                            {selectedService.name} · {selectedService.price} lei
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!selectedService}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-md bg-[#c59d5f] hover:bg-[#b08745] disabled:opacity-40 text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg cursor-pointer active:scale-95 min-h-[48px]"
                      >
                        <span>Pasul următor: Dată & Oră</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PASUL 2: ALEGERE DATĂ & INTERVAL ORAR */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#c59d5f] font-bold block mb-1">
                        Pasul 2 din 3
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                        Alege data și ora
                      </h2>
                      <p className="text-gray-400 text-xs sm:text-sm font-light mt-1">
                        Intervalele orare libere sunt calculate automat în funcție de durata serviciului ({selectedService?.dur}).
                      </p>
                    </div>

                    <div className="space-y-6">
                      <CalendarPicker
                        selectedDate={selectedDate}
                        onChangeDate={setSelectedDate}
                      />
                      <TimeSelector
                        slots={slots}
                        selectedTime={selectedTime}
                        onSelectTime={setSelectedTime}
                        message={slotsMessage}
                      />
                    </div>

                    {/* Bara de acțiuni Pas 2 */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full sm:w-auto py-3 px-5 rounded-md border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs uppercase tracking-wider transition-colors cursor-pointer min-h-[48px]"
                      >
                        &larr; Înapoi la Servicii
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!selectedTime}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-md bg-[#c59d5f] hover:bg-[#b08745] disabled:opacity-40 text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg cursor-pointer active:scale-95 min-h-[48px]"
                      >
                        <span>Pasul următor: Datele Tale</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PASUL 3: DATE CLIENT & CONFIRMARE */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#c59d5f] font-bold block mb-1">
                        Pasul 3 din 3
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                        Datele tale de contact
                      </h2>
                      <p className="text-gray-400 text-xs sm:text-sm font-light mt-1">
                        Numele este suficient pentru a-ți rezerva locul la frizerie. Telefonul și notițele sunt opționale.
                      </p>
                    </div>

                    <CustomerForm
                      customerData={customer}
                      onChangeCustomer={setCustomer}
                      onSubmit={handleSubmit}
                      selectedService={selectedService}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onBack={() => setStep(2)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
