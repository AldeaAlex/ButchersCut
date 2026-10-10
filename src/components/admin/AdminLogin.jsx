import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';
import ButchersCutLogo from '../common/ButchersCutLogo';
import PrimaryButton from '../common/PrimaryButton';
import { checkAdminPassword } from '../../config/security';

export default function AdminLogin({ onLoginSuccess, onBack }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Te rugăm să introduci parola de administrator.');
      return;
    }

    if (checkAdminPassword(password)) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Parolă incorectă! Verifică parola și încearcă din nou.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-[#181818] border border-white/10 rounded-md p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Accent linie aurie sus */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c59d5f]" />

        {/* Buton Înapoi */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400 hover:text-[#c59d5f] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} /> Înapoi la site
        </button>

        <div className="text-center space-y-4 mb-6">
          <div className="w-16 h-16 rounded-full border border-[#c59d5f]/50 bg-[#141414] flex items-center justify-center mx-auto shadow-lg text-[#c59d5f]">
            <ButchersCutLogo size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] text-[#c59d5f] uppercase font-bold">
              BUTCHER'S CUT · ADMIN
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Panou de Administrare
            </h2>
            <p className="text-xs text-gray-400 font-light max-w-xs mx-auto">
              Accesul la programări, prețuri și orar este restricționat pe bază de parolă.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5">
              Parolă de acces
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Introdu parola..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-[#121212] border border-white/10 rounded-sm py-3 px-4 pr-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c59d5f] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer transition-colors"
                title={showPassword ? 'Ascunde parola' : 'Afișează parola'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <PrimaryButton
            type="submit"
            size="md"
            className="w-full justify-center py-3 text-xs tracking-[0.2em]"
          >
            <Lock size={15} className="mr-2" /> AUTENTIFICARE
          </PrimaryButton>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[11px] text-gray-500 font-light">
            Doar personalul autorizat Butcher's Cut are acces la acest panou.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
