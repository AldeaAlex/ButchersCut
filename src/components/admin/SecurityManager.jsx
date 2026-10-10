import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Check,
  RefreshCw,
  EyeOff,
  Copy,
  Database,
  Activity,
  AlertTriangle
} from 'lucide-react';
import PrimaryButton from '../common/PrimaryButton';
import {
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_SECRET_ADMIN_SLUG,
  getAdminPassword,
  setAdminPassword,
  resetAdminPasswordToDefault,
  getSecretAdminSlug,
  setSecretAdminSlug,
  resetSecretAdminSlugToDefault
} from '../../config/security';
import {
  isSupabaseConfigured,
  getServicesDb,
  getAppointmentsDb,
  getWorkingHoursDb
} from '../../services/supabaseClient';

export default function SecurityManager() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Secret slug management
  const [secretSlug, setSecretSlug] = useState(getSecretAdminSlug);
  const [slugSuccessMsg, setSlugSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Supabase test state
  const [dbTestStatus, setDbTestStatus] = useState(null);
  const [isTestingDb, setIsTestingDb] = useState(false);

  const handleTestSupabase = async () => {
    setIsTestingDb(true);
    setDbTestStatus(null);
    try {
      if (!isSupabaseConfigured) {
        setDbTestStatus({
          success: false,
          message: 'Supabase nu este configurat. Completează VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY în fișierul .env.'
        });
        setIsTestingDb(false);
        return;
      }
      const [services, apps, hours] = await Promise.all([
        getServicesDb(),
        getAppointmentsDb(),
        getWorkingHoursDb()
      ]);
      setDbTestStatus({
        success: true,
        servicesCount: services ? services.length : 0,
        appsCount: apps ? apps.length : 0,
        hoursCount: hours ? hours.length : 0,
        message: 'Conexiunea la Supabase este 100% activă și funcțională!'
      });
    } catch (e) {
      setDbTestStatus({
        success: false,
        message: 'Eroare conexiune: ' + (e.message || 'Verifică setările Supabase.')
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const currentPass = getAdminPassword();
  const isCustomPass = currentPass !== DEFAULT_ADMIN_PASSWORD;
  const isCustomSlug = secretSlug !== DEFAULT_SECRET_ADMIN_SLUG;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://butcherscut.ro';
  const fullSecretUrl = `${originUrl}/${secretSlug}`;

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setErrorMsg('Te rugăm să introduci o parolă validă.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Parolele introduse nu coincid!');
      return;
    }

    setAdminPassword(newPassword);
    setSuccessMsg('Parola a fost actualizată cu succes!');
    setErrorMsg('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetPassword = () => {
    if (window.confirm('Sigur dorești să resetezi parola la valoarea prestabilită din cod?')) {
      resetAdminPasswordToDefault();
      setSuccessMsg('Parola a fost resetată la valoarea prestabilită din cod.');
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleSaveSlug = (e) => {
    e.preventDefault();
    if (!secretSlug.trim()) {
      return;
    }
    setSecretAdminSlug(secretSlug);
    setSlugSuccessMsg('Linkul secret a fost actualizat cu succes!');
    setTimeout(() => setSlugSuccessMsg(''), 4000);
  };

  const handleResetSlug = () => {
    if (window.confirm('Sigur dorești să resetezi linkul secret la valoarea prestabilită?')) {
      resetSecretAdminSlugToDefault();
      setSecretSlug(DEFAULT_SECRET_ADMIN_SLUG);
      setSlugSuccessMsg('Linkul a fost resetat la valoarea prestabilită.');
      setTimeout(() => setSlugSuccessMsg(''), 4000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullSecretUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Secțiune Link Secret Anti-Detectare */}
      <div className="bg-[#181818] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[#c59d5f] text-xs font-semibold uppercase tracking-wider mb-1">
            <EyeOff size={15} /> Protecție Acces & Ascundere Panou
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Link Secret de Acces (Anti-Clienți)
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-light leading-relaxed">
            Pentru a împiedica clienții să găsească panoul, ruta generică <code className="text-red-400 font-mono">/admin</code> este dezactivată și redirecționează pe prima pagină. Panoul poate fi accesat doar prin linkul tău secret sau gestul discret de pe mobil.
          </p>
        </div>

        {slugSuccessMsg && (
          <div className="mb-5 p-3 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span>{slugSuccessMsg}</span>
          </div>
        )}

        {/* Display Current Secret Link */}
        <div className="p-4 rounded bg-[#141414] border border-white/10 space-y-3 mb-6">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block">
            Adresa secretă a panoului tău:
          </span>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 bg-[#1c1c1c] border border-[#c59d5f]/30 px-3.5 py-2.5 rounded font-mono text-xs sm:text-sm text-[#c59d5f] truncate select-all">
              {fullSecretUrl}
            </div>

            <button
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-[#c59d5f] hover:bg-[#b08745] text-black font-semibold text-xs transition-all cursor-pointer active:scale-95 shrink-0"
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copiat!' : 'Copiază Link'}</span>
            </button>
          </div>
        </div>

        {/* Formular Modificare Slug Secret */}
        <form onSubmit={handleSaveSlug} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
              Personalizează calea secretă
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-mono text-xs select-none">/</span>
              <input
                type="text"
                required
                placeholder="butcher-secret-portal"
                value={secretSlug}
                onChange={(e) => setSecretSlug(e.target.value)}
                className="w-full bg-[#222222] border border-white/10 rounded-sm py-2 px-3 text-sm text-white font-mono focus:outline-none focus:border-[#c59d5f]"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Schimbă acest cuvânt cheie dacă vrei un link doar de tine știut.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PrimaryButton type="submit" size="sm" className="tracking-wider text-xs">
              SALVEAZĂ CALEA SECRETĂ
            </PrimaryButton>

            {isCustomSlug && (
              <button
                type="button"
                onClick={handleResetSlug}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#c59d5f] transition-colors cursor-pointer py-1.5 px-3 rounded bg-white/5"
              >
                <RefreshCw size={13} /> Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. Secțiune Schimbare Parolă */}
      <div className="bg-[#181818] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[#c59d5f] text-xs font-semibold uppercase tracking-wider mb-1">
            <KeyRound size={15} /> Securitate Parolă
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Setări Parolă Administrator
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Doar frizerul sau persoanele autorizate trebuie să cunoască această parolă.
          </p>
        </div>

        {/* Status card */}
        <div className="mb-6 p-4 rounded bg-[#141414] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c59d5f]/10 border border-[#c59d5f]/40 flex items-center justify-center text-[#c59d5f]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-white text-sm font-semibold block">
                Stare Parolă: {isCustomPass ? 'Personalizată' : 'Prestabilită'}
              </span>
              <span className="text-gray-400 text-xs font-light block">
                {isCustomPass
                  ? 'Folosești o parolă personalizată salvată în browser.'
                  : 'Folosești parola prestabilită din codul aplicației (src/config/security.js).'}
              </span>
            </div>
          </div>

          {isCustomPass && (
            <button
              onClick={handleResetPassword}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c59d5f] transition-colors cursor-pointer py-1.5 px-3 rounded bg-white/5"
            >
              <RefreshCw size={13} /> Resetează la prestabilită
            </button>
          )}
        </div>

        {successMsg && (
          <div className="mb-5 p-3 rounded bg-green-950/40 border border-green-800/60 text-green-300 text-xs flex items-center gap-2">
            <Check size={16} className="text-green-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-3 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
              Noua Parolă *
            </label>
            <input
              type="password"
              required
              placeholder="Introdu noua parolă..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
              Confirmă Noua Parolă *
            </label>
            <input
              type="password"
              required
              placeholder="Reintrodu noua parolă..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#222222] border border-white/10 rounded-sm py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c59d5f]"
            />
          </div>

          <PrimaryButton type="submit" size="md" className="tracking-wider text-xs">
            <Lock size={14} className="mr-2" /> SALVEAZĂ PAROLA NOUĂ
          </PrimaryButton>
        </form>

        <div className="mt-8 pt-5 border-t border-white/5 text-xs text-gray-400 space-y-1">
          <p className="font-semibold text-gray-300">💡 Notă tehnică:</p>
          <p>
            Parola și slug-ul secret pot fi configurate direct și în fișierul <code className="text-[#c59d5f]">src/config/security.js</code>.
          </p>
        </div>
      </div>

      {/* 3. Secțiune Stare Bază de Date & Conexiune Supabase */}
      <div className="bg-[#181818] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[#c59d5f] text-xs font-semibold uppercase tracking-wider mb-1">
            <Database size={15} /> Bază de Date & Sincronizare Cloud
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Conexiune Supabase (Cloud)
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-light leading-relaxed">
            Verifică în timp real dacă baza de date cloud este activă și sincronizată cu programările, serviciile și orarul tău.
          </p>
        </div>

        <div className="p-4 rounded bg-[#141414] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-400'
              }`}>
                <Activity size={20} className={isSupabaseConfigured ? 'animate-pulse' : ''} />
              </div>
              <div>
                <span className="text-white text-sm font-semibold block">
                  Stare: {isSupabaseConfigured ? 'Configurat & Activ' : 'Mod Offline / Stocare Locală'}
                </span>
                <span className="text-gray-400 text-xs font-light block font-mono text-[11px] truncate max-w-sm">
                  {isSupabaseConfigured
                    ? 'Proiect: fivxdfzzvoakmpzmbohx.supabase.co'
                    : 'Cheile Supabase nu au fost detectate în mediu.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestSupabase}
              disabled={isTestingDb}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#c59d5f] hover:bg-[#b08745] disabled:opacity-50 text-black font-semibold text-xs transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <RefreshCw size={14} className={isTestingDb ? 'animate-spin' : ''} />
              <span>{isTestingDb ? 'Se testează...' : 'Verifică Conexiunea Acum'}</span>
            </button>
          </div>

          {/* Rezultat Test */}
          {dbTestStatus && (
            <div className={`p-3.5 rounded text-xs border ${
              dbTestStatus.success
                ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-300'
                : 'bg-red-950/50 border-red-800/50 text-red-300'
            }`}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                {dbTestStatus.success ? <Check size={16} className="text-emerald-400" /> : <AlertTriangle size={16} className="text-red-400" />}
                <span>{dbTestStatus.message}</span>
              </div>
              {dbTestStatus.success && (
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-800/30 text-center font-mono">
                  <div className="bg-black/30 p-1.5 rounded">
                    <span className="block text-[10px] text-gray-400 uppercase">Servicii</span>
                    <span className="text-sm font-bold text-white">{dbTestStatus.servicesCount}</span>
                  </div>
                  <div className="bg-black/30 p-1.5 rounded">
                    <span className="block text-[10px] text-gray-400 uppercase">Zile Orar</span>
                    <span className="text-sm font-bold text-white">{dbTestStatus.hoursCount}</span>
                  </div>
                  <div className="bg-black/30 p-1.5 rounded">
                    <span className="block text-[10px] text-gray-400 uppercase">Programări</span>
                    <span className="text-sm font-bold text-white">{dbTestStatus.appsCount}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
