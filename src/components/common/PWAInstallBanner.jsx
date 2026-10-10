import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import ButchersCutLogo from './ButchersCutLogo';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifică dacă aplicația este deja instalată (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    // Verifică dacă utilizatorul a închis deja banner-ul în această sesiune
    if (sessionStorage.getItem('pwa_dismissed') === 'true') return;

    // Detectează iOS Safari
    const userAgent = window.navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(userAgent);

    if (isIOS && isSafari) {
      // Afișează prompt iOS după 2.5 secunde
      const timer = setTimeout(() => {
        setShowIOSPrompt(true);
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // Android & Chrome beforeinstallprompt handler
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#181818]/95 backdrop-blur-md border border-[#c59d5f]/60 rounded-lg p-3.5 sm:p-4 shadow-2xl text-white"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#c59d5f] flex items-center justify-center shrink-0 text-[#c59d5f]">
                <ButchersCutLogo size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#c59d5f] font-bold block">
                  Aplicație Mobilă
                </span>
                <h4 className="font-serif text-sm font-bold text-white leading-tight">
                  Instalează Butcher's Cut
                </h4>
                <p className="text-[11px] text-gray-300 font-light mt-0.5">
                  Acces instant la programări direct de pe ecranul principal.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Închide"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10">
            {showIOSPrompt ? (
              <div className="text-[11px] text-gray-300 flex items-center gap-2 bg-[#121212] p-2 rounded border border-white/5">
                <Share size={15} className="text-[#c59d5f] shrink-0" />
                <span>
                  Apasă butonul <strong className="text-white">Partajare (Share)</strong> din Safari și apoi <strong className="text-[#c59d5f]">„Adaugă pe ecranul principal”</strong>.
                </span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleInstallClick}
                className="w-full py-2 px-4 rounded bg-[#c59d5f] hover:bg-[#b08745] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download size={14} /> Instalează Aplicația
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
