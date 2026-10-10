import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Plus, Scissors, Clock, KeyRound, LogOut } from 'lucide-react';
import ButchersCutLogo from '../components/common/ButchersCutLogo';
import StatsCards from '../components/admin/StatsCards';
import AppointmentsList from '../components/admin/AppointmentsList';
import NewAppointmentForm from '../components/admin/NewAppointmentForm';
import ServicesManager from '../components/admin/ServicesManager';
import WorkingHoursManager from '../components/admin/WorkingHoursManager';
import SecurityManager from '../components/admin/SecurityManager';
import AdminLogin from '../components/admin/AdminLogin';
import { isSupabaseConfigured } from '../services/supabaseClient';

const AUTH_STORAGE_KEY = 'butchers_admin_authenticated';

export default function AdminPage({
  onBack,
  appointments = [],
  services = [],
  workingHours = [],
  onUpdateStatus,
  onDeleteAppointment,
  onAddAppointment,
  onAddService,
  onUpdateService,
  onDeleteService,
  onSaveWorkingHours
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [activeTab, setActiveTab] = useState('appointments');

  const handleLoginSuccess = () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  // Dacă nu este autentificat, afișează ecranul de login securizat
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={onBack} />;
  }

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 max-w-6xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#c59d5f] hover:bg-[#c59d5f]/10 transition-all cursor-pointer"
            title="Înapoi la Site"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <ButchersCutLogo size={18} />
              <span className="text-[10px] tracking-[0.25em] text-[#c59d5f] uppercase font-bold">
                BUTCHER'S CUT
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Dashboard Administrativ
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40'
                  : 'bg-amber-950/80 text-amber-400 border-amber-800/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {isSupabaseConfigured ? 'Supabase Conectat (Cloud)' : 'Mod Local'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Logout */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('new-appointment')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c59d5f] hover:bg-[#b08745] text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            <Plus size={15} /> Programează Client
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/20 hover:border-red-500/50 hover:bg-red-950/30 text-gray-300 hover:text-red-300 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
            title="Deconectare din Panou"
          >
            <LogOut size={14} /> Deconectare
          </button>
        </div>
      </div>

      {/* Stats Cards Overview */}
      <StatsCards appointments={appointments} />

      {/* Navigation Tabs for All Initial Admin Sections */}
      <div className="flex border-b border-white/10 bg-[#161616] p-1 rounded-sm text-xs uppercase tracking-wider overflow-x-auto gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`py-2 px-3 sm:py-2.5 sm:px-5 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 active:scale-95 text-[11px] sm:text-xs ${
            activeTab === 'appointments'
              ? 'bg-[#c59d5f] text-black shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar size={14} className="shrink-0" /> Programări
        </button>

        <button
          onClick={() => setActiveTab('new-appointment')}
          className={`py-2 px-3 sm:py-2.5 sm:px-5 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 active:scale-95 text-[11px] sm:text-xs ${
            activeTab === 'new-appointment'
              ? 'bg-[#c59d5f] text-black shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus size={14} className="shrink-0" /> Programează Client
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`py-2 px-3 sm:py-2.5 sm:px-5 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 active:scale-95 text-[11px] sm:text-xs ${
            activeTab === 'services'
              ? 'bg-[#c59d5f] text-black shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Scissors size={14} className="shrink-0" /> Servicii
        </button>

        <button
          onClick={() => setActiveTab('hours')}
          className={`py-2 px-3 sm:py-2.5 sm:px-5 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 active:scale-95 text-[11px] sm:text-xs ${
            activeTab === 'hours'
              ? 'bg-[#c59d5f] text-black shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock size={14} className="shrink-0" /> Program de Lucru
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-3 sm:py-2.5 sm:px-5 rounded-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 active:scale-95 text-[11px] sm:text-xs ${
            activeTab === 'security'
              ? 'bg-[#c59d5f] text-black shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <KeyRound size={14} className="shrink-0" /> Securitate & Parolă
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {activeTab === 'appointments' && (
          <AppointmentsList
            appointments={appointments}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDeleteAppointment}
          />
        )}

        {activeTab === 'new-appointment' && (
          <NewAppointmentForm
            services={services}
            workingHours={workingHours}
            existingAppointments={appointments}
            onSaveAppointment={onAddAppointment}
            onSuccess={() => setActiveTab('appointments')}
          />
        )}

        {activeTab === 'services' && (
          <ServicesManager
            services={services}
            onAddService={onAddService}
            onUpdateService={onUpdateService}
            onDeleteService={onDeleteService}
          />
        )}

        {activeTab === 'hours' && (
          <WorkingHoursManager
            workingHours={workingHours}
            onSaveWorkingHours={onSaveWorkingHours}
          />
        )}

        {activeTab === 'security' && (
          <SecurityManager />
        )}
      </div>
    </div>
  );
}
