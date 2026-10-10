import React, { useState } from 'react';
import { Phone, ShieldCheck, FileText, Cookie } from 'lucide-react';
import ButchersCutLogo from '../common/ButchersCutLogo';
import LegalModal from '../legal/LegalModal';

export default function Shell({ children, onNavigate }) {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('terms');

  const openLegal = (tab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#f4f1ec] flex flex-col font-sans selection:bg-[#c59d5f] selection:text-black">
      {/* Header cu sigla poziționată perfect pe mijloc: BUTCHER'S CUT */}
      <header className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          {/* Brand Logo Centrat */}
          <button
            onClick={() => onNavigate && onNavigate('hero')}
            className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer text-center active:scale-95 transition-transform"
            title="Acasă - Butcher's Cut"
          >
            {/* Emblema Line Art: Cap de porc cu foarfecă */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#c59d5f]/50 flex items-center justify-center bg-[#181818] group-hover:border-[#c59d5f] group-hover:bg-[#1f1f1f] transition-all shadow-md shrink-0">
              <ButchersCutLogo size={26} className="text-[#c59d5f] sm:hidden" />
              <ButchersCutLogo size={30} className="text-[#c59d5f] hidden sm:block" />
            </div>

            {/* Numele Brandului: Doar BUTCHER'S CUT */}
            <div className="text-left">
              <span className="font-serif text-lg sm:text-2xl tracking-[0.20em] sm:tracking-[0.24em] text-white font-bold uppercase block leading-none">
                BUTCHER'S CUT
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer conform legislației RO & UE cu număr de telefon interactiv și pagini legale */}
      <footer className="bg-[#0c0c0c] border-t border-white/10 pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] text-xs text-gray-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
          
          {/* Secțiunea de contact telefonic responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-6 sm:pb-8 border-b border-white/5 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
                Contact & Asistență Programări
              </h4>
              <p className="text-xs text-gray-400 font-light max-w-sm">
                Ai nevoie de o programare rapidă sau vrei să modifici o rezervare?
              </p>
            </div>

            {/* Buton telefon responsive activ la tap/click pe telefon */}
            <a
              href="tel:0785960301"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-[#181818] border border-[#c59d5f]/60 text-white hover:bg-[#c59d5f] hover:text-black hover:border-[#c59d5f] transition-all duration-200 shadow-lg active:scale-95 group cursor-pointer min-h-[48px]"
              title="Apelează salonul"
            >
              <div className="w-8 h-8 rounded-full bg-[#c59d5f]/20 group-hover:bg-black/10 flex items-center justify-center text-[#c59d5f] group-hover:text-black transition-colors shrink-0">
                <Phone size={16} />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-[#c59d5f] group-hover:text-black font-semibold uppercase tracking-wider block leading-none mb-1">
                  Sună acum (Apel Direct)
                </span>
                <span className="font-mono text-sm sm:text-base font-bold tracking-wider leading-none">
                  0785 960 301
                </span>
              </div>
            </a>
          </div>

          {/* Linkuri Pagini Legale (RO & UE) ergonomice pentru degete pe mobil */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-6 text-xs">
            <button
              onClick={() => openLegal('terms')}
              className="hover:text-[#c59d5f] active:text-[#c59d5f] transition-colors flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-0 min-h-[38px]"
            >
              <FileText size={14} className="text-[#c59d5f] shrink-0" />
              <span>Termeni și Condiții</span>
            </button>

            <button
              onClick={() => openLegal('gdpr')}
              className="hover:text-[#c59d5f] active:text-[#c59d5f] transition-colors flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-0 min-h-[38px]"
            >
              <ShieldCheck size={14} className="text-[#c59d5f] shrink-0" />
              <span>Politica de Confidențialitate (GDPR)</span>
            </button>

            <button
              onClick={() => openLegal('cookies')}
              className="hover:text-[#c59d5f] active:text-[#c59d5f] transition-colors flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-0 min-h-[38px]"
            >
              <Cookie size={14} className="text-[#c59d5f] shrink-0" />
              <span>Politica Cookies</span>
            </button>
          </div>

          {/* Copyright & Disclaimer Legislație */}
          <div className="pt-4 sm:pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-serif text-gray-400 font-bold tracking-wider">BUTCHER'S CUT</span>
            </div>
            <p className="text-center sm:text-right">
              Platformă conformă cu Regulamentul (UE) 2016/679 (GDPR) și legislația din România.
            </p>
          </div>

        </div>
      </footer>

      {/* Modalul Legal (Termeni, GDPR, Cookies) */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
