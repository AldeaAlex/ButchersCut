import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  X,
  WifiOff,
  Wifi,
  Share,
  PlusSquare
} from 'lucide-react';
import ButchersCutLogo from '../common/ButchersCutLogo';

export default function PwaInstallPrompt() {
  // Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  // Online / Offline State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineRestored, setShowOnlineRestored] = useState(false);

  // Periodic Service Worker update check every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.update();
        }).catch(() => {});
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 1. Check if already installed / standalone
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // 2. Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Listen for beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user previously dismissed banner in this session
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed && !standalone) {
        setShowInstallBanner(true);
      }
    };

    // 4. Online/Offline Listeners
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineRestored(true);
      setTimeout(() => setShowOnlineRestored(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // If on iOS and not standalone, show prompt after a short delay
    if (isIosDevice && !standalone) {
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowInstallBanner(true), 2500);
        return () => clearTimeout(timer);
      }
    }

    // Custom trigger from any button in UI
    const handleOpenInstall = () => {
      if (isIosDevice) {
        setShowIosGuide(true);
      } else {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('open-pwa-install', handleOpenInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('open-pwa-install', handleOpenInstall);
    };
  }, []);

  // Trigger Native PWA Install
  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      alert('Pentru instalare, folosește opțiunea "Instalează aplicația" din meniul browserului tău.');
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowInstallBanner(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('PWA Install Error:', err);
    }
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <>
      {/* 1. Offline Mode Alert Badge */}
      {!isOnline && (
        <div className="fixed top-0 inset-x-0 z-50 bg-rose-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg safe-pt">
          <WifiOff className="w-4 h-4" />
          <span>Ești offline. Butcher's Cut rulează din memoria cache locală.</span>
        </div>
      )}

      {/* 2. Online Restored Notification */}
      {isOnline && showOnlineRestored && (
        <div className="fixed top-0 inset-x-0 z-50 bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg safe-pt">
          <Wifi className="w-4 h-4" />
          <span>Conexiunea la internet a fost restabilită! Datele sunt sincronizate.</span>
        </div>
      )}

      {/* 3. Install PWA Floating Banner (Desktop & Mobile) identic ca în A Squared Studio Hub */}
      {!isStandalone && showInstallBanner && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-[420px] z-40 p-4 rounded-2xl bg-[#171b27]/95 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black/40 border border-[#c59d5f]/40 flex items-center justify-center text-[#c59d5f] shrink-0 p-1">
                <ButchersCutLogo size={28} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-white">Butcher's Cut</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#c59d5f]/25 text-[#c59d5f] border border-[#c59d5f]/40">
                    PWA
                  </span>
                </div>
                <p className="text-[11px] text-[#8491ab] leading-snug">
                  Instalează aplicația direct pe ecranul principal pentru acces rapid și autonomie offline.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismissBanner}
              className="text-[#8491ab] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Închide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-black bg-[#c59d5f] hover:bg-[#b08745] shadow-md shadow-[#c59d5f]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalează Aplicația</span>
            </button>

            <button
              onClick={handleDismissBanner}
              className="py-2 px-3 rounded-xl text-xs font-medium text-[#8491ab] hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Mai târziu
            </button>
          </div>
        </div>
      )}

      {/* 4. iOS Safari Install Guide Modal identic ca în A Squared Studio Hub */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#171b27] border border-white/15 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#c59d5f]" />
                <h3 className="text-sm font-bold text-white">Instalare pe iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-[#8491ab] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#a3aabf]">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-[#c59d5f]/20 flex items-center justify-center text-[#c59d5f] font-bold shrink-0">
                  1
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-white">Apasă butonul de Partajare:</span>
                  <p className="text-[11px] text-[#8491ab]">
                    În Safari, apasă iconița de partajare <Share className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> din bara de jos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-[#c59d5f]/20 flex items-center justify-center text-[#c59d5f] font-bold shrink-0">
                  2
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-white">Alege "Adaugă pe ecranul principal":</span>
                  <p className="text-[11px] text-[#8491ab]">
                    Derulează în jos în meniu și selectează <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 mx-1" /> <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-[#c59d5f]/20 flex items-center justify-center text-[#c59d5f] font-bold shrink-0">
                  3
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-white">Confirmă adăugarea:</span>
                  <p className="text-[11px] text-[#8491ab]">
                    Apasă „Add” în colțul din dreapta sus. Butcher's Cut va apărea ca aplicație nativă!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-black bg-[#c59d5f] hover:bg-[#b08745] transition-colors cursor-pointer"
            >
              Am înțeles
            </button>
          </div>
        </div>
      )}
    </>
  );
}
