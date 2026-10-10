import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Check, RefreshCw } from 'lucide-react';
import PrimaryButton from '../common/PrimaryButton';
import {
  DEFAULT_ADMIN_PASSWORD,
  getAdminPassword,
  setAdminPassword,
  resetAdminPasswordToDefault
} from '../../config/security';

export default function SecurityManager() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentPass = getAdminPassword();
  const isCustom = currentPass !== DEFAULT_ADMIN_PASSWORD;

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

  const handleReset = () => {
    if (window.confirm('Sigur dorești să resetezi parola la valoarea prestabilită din cod?')) {
      resetAdminPasswordToDefault();
      setSuccessMsg('Parola a fost resetată la valoarea prestabilită din cod.');
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#181818] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[#c59d5f] text-xs font-semibold uppercase tracking-wider mb-1">
            <KeyRound size={15} /> Securitate Panou
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
                Stare Parolă: {isCustom ? 'Personalizată' : 'Prestabilită'}
              </span>
              <span className="text-gray-400 text-xs font-light block">
                {isCustom
                  ? 'Folosești o parolă personalizată salvată în browser.'
                  : 'Folosești parola prestabilită din codul aplicației (src/config/security.js).'}
              </span>
            </div>
          </div>

          {isCustom && (
            <button
              onClick={handleReset}
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
            Parola poate fi configurată direct și în fișierul <code className="text-[#c59d5f]">src/config/security.js</code> prin modificarea constantei <code className="text-[#c59d5f]">DEFAULT_ADMIN_PASSWORD</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
