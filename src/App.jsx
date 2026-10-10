import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from './components/layout/Shell';
import HeroPage from './pages/HeroPage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import { SERVICES } from './data/services';
import { WEEK_DAYS } from './data/workingHours';
import {
  isSupabaseConfigured,
  getServicesDb,
  getAppointmentsDb,
  getWorkingHoursDb,
  insertAppointmentDb,
  updateAppointmentStatusDb,
  deleteAppointmentDb,
  upsertServiceDb,
  deleteServiceDb,
  saveWorkingHoursDb
} from './services/supabaseClient';

const STORAGE_KEYS = {
  SERVICES: 'butchers_services',
  APPOINTMENTS: 'butchers_appointments',
  WORKING_HOURS: 'butchers_working_hours'
};

const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    customerName: 'Radu Ionescu',
    clientName: 'Radu Ionescu',
    customerPhone: '0722 111 222',
    clientPhone: '0722 111 222',
    serviceId: 2,
    service: 'Tuns + barbă',
    price: 80,
    duration: '45 min',
    durationMinutes: 45,
    date: '2026-09-08',
    time: '11:15',
    startTime: '11:15',
    endTime: '12:00',
    notes: 'Fade scurt pe margini',
    status: 'CONFIRMED'
  },
  {
    id: 2,
    customerName: 'Cristian Dumitrescu',
    clientName: 'Cristian Dumitrescu',
    customerPhone: '0733 444 555',
    clientPhone: '0733 444 555',
    serviceId: 1,
    service: 'Tuns bărbați',
    price: 50,
    duration: '30 min',
    durationMinutes: 30,
    date: '2026-09-08',
    time: '14:15',
    startTime: '14:15',
    endTime: '14:45',
    notes: '',
    status: 'CONFIRMED'
  }
];

export default function App() {
  const getPageFromUrl = () => {
    const path = window.location.pathname.replace(/\/+$/, '');
    const hash = window.location.hash;
    if (path === '/admin' || hash === '#admin') return 'admin';
    if (path === '/programare' || hash === '#booking') return 'booking';
    return 'hero';
  };

  const [page, setPage] = useState(getPageFromUrl);
  const [selectedInitialServiceId, setSelectedInitialServiceId] = useState(null);

  // Sync state with URL history and popstate
  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (newPage, serviceId = null) => {
    setPage(newPage);
    if (serviceId) {
      setSelectedInitialServiceId(serviceId);
    }
    let newPath = '/';
    if (newPage === 'admin') newPath = '/admin';
    if (newPage === 'booking') newPath = '/programare';
    
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  // State pentru Servicii
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : SERVICES;
    } catch {
      return SERVICES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('Nu s-au putut salva serviciile în localStorage:', e);
    }
  }, [services]);

  // State pentru Program de Lucru
  const [workingHours, setWorkingHours] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKING_HOURS);
      return saved ? JSON.parse(saved) : WEEK_DAYS;
    } catch {
      return WEEK_DAYS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKING_HOURS, JSON.stringify(workingHours));
    } catch (e) {
      console.warn('Nu s-a putut salva programul de lucru în localStorage:', e);
    }
  }, [workingHours]);

  // State pentru Programări
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Nu s-au putut salva programările în localStorage:', e);
    }
  }, [appointments]);

  // Încărcare date din Supabase dacă este configurat
  useEffect(() => {
    async function initSupabaseData() {
      if (!isSupabaseConfigured) return;
      try {
        const [dbServices, dbApps, dbHours] = await Promise.all([
          getServicesDb(),
          getAppointmentsDb(),
          getWorkingHoursDb()
        ]);

        if (dbServices && dbServices.length > 0) {
          setServices(
            dbServices.map((s) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              price: Number(s.price),
              dur: s.dur,
              durationMinutes: Number(s.duration_minutes),
              isActive: s.is_active
            }))
          );
        }

        if (dbApps && dbApps.length > 0) {
          setAppointments(
            dbApps.map((a) => ({
              id: a.id,
              customerName: a.customer_name,
              clientName: a.customer_name,
              customerPhone: a.customer_phone,
              clientPhone: a.customer_phone,
              serviceId: a.service_id,
              service: a.service_name,
              price: Number(a.price),
              duration: a.duration,
              durationMinutes: Number(a.duration_minutes),
              date: a.date,
              time: a.time,
              startTime: a.start_time,
              endTime: a.end_time,
              notes: a.notes,
              status: a.status
            }))
          );
        }

        if (dbHours && dbHours.length > 0) {
          setWorkingHours(
            dbHours.map((h) => ({
              dayOfWeek: h.day_of_week,
              label: h.label,
              isWorkingDay: h.is_working_day,
              startTime: h.start_time,
              endTime: h.end_time
            }))
          );
        }
      } catch (err) {
        console.warn('Eroare inițializare Supabase:', err);
      }
    }

    initSupabaseData();
  }, []);

  // Handler-e Programări
  const handleAddAppointment = (newApp) => {
    setAppointments((prev) => [newApp, ...prev]);
    if (isSupabaseConfigured) {
      insertAppointmentDb(newApp).catch(console.warn);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (isSupabaseConfigured) {
      updateAppointmentStatusDb(id, newStatus).catch(console.warn);
    }
  };

  const handleDeleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    if (isSupabaseConfigured) {
      deleteAppointmentDb(id).catch(console.warn);
    }
  };

  // Handler-e Servicii (Admin)
  const handleAddService = (newService) => {
    setServices((prev) => [...prev, newService]);
    if (isSupabaseConfigured) {
      upsertServiceDb(newService).catch(console.warn);
    }
  };

  const handleUpdateService = (id, updatedFields) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    setServices(updated);
    if (isSupabaseConfigured) {
      const target = updated.find((s) => s.id === id);
      if (target) upsertServiceDb(target).catch(console.warn);
    }
  };

  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured) {
      deleteServiceDb(id).catch(console.warn);
    }
  };

  // Handler Program de Lucru (Admin)
  const handleSaveWorkingHours = (newSchedule) => {
    setWorkingHours(newSchedule);
    if (isSupabaseConfigured) {
      saveWorkingHoursDb(newSchedule).catch(console.warn);
    }
  };

  return (
    <Shell activePage={page} onNavigate={navigateTo}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full flex-1 flex flex-col"
        >
          {page === 'booking' && (
            <BookingPage
              onBack={() => navigateTo('hero')}
              onAddAppointment={handleAddAppointment}
              existingAppointments={appointments}
              services={services.filter((s) => s.isActive !== false)}
              workingHours={workingHours}
              initialServiceId={selectedInitialServiceId}
            />
          )}

          {page === 'admin' && (
            <AdminPage
              onBack={() => navigateTo('hero')}
              appointments={appointments}
              services={services}
              workingHours={workingHours}
              onUpdateStatus={handleUpdateStatus}
              onDeleteAppointment={handleDeleteAppointment}
              onAddAppointment={handleAddAppointment}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
              onSaveWorkingHours={handleSaveWorkingHours}
            />
          )}

          {page === 'hero' && (
            <HeroPage
              services={services}
              onBook={(serviceId) => navigateTo('booking', serviceId)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}
