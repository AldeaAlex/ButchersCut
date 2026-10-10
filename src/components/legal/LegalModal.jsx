import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Cookie, Phone } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sincronizează tab-ul inițial când se deschide modalul
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#181818] border border-white/10 rounded-sm w-full max-w-3xl max-h-[85vh] text-white shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-[#c59d5f]" />
            <h3 className="font-serif text-lg font-bold text-white">
              Informații Legale & Conformitate Butcher's Cut
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Închide"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#151515] px-6 text-xs uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'border-[#c59d5f] text-[#c59d5f]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={14} /> Termeni și Condiții
          </button>

          <button
            onClick={() => setActiveTab('gdpr')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'gdpr'
                ? 'border-[#c59d5f] text-[#c59d5f]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} /> Politica de Confidențialitate (GDPR)
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'cookies'
                ? 'border-[#c59d5f] text-[#c59d5f]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Cookie size={14} /> Politica Cookies
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto text-sm text-gray-300 space-y-6 leading-relaxed">
          
          {/* TAB 1: TERMENI ȘI CONDIȚII */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h4 className="font-serif text-xl font-bold text-white mb-1">
                  Termeni și Condiții de Utilizare
                </h4>
                <p className="text-xs text-gray-400">
                  Conform Legii nr. 365/2002 privind comerțul electronic și OUG nr. 34/2014 privind drepturile consumatorilor.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  1. Dispoziții Generale
                </h5>
                <p>
                  Platforma web Butcher's Cut este destinată exclusiv rezervării online a serviciilor de frizerie, tuns și îngrijire bărbătească prestate în cadrul salonului nostru. Prin efectuarea unei programări, clientul declară că are cel puțin 16 ani și este de acord cu prezenții Termeni și Condiții.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  2. Procedura de Programare Online
                </h5>
                <p>
                  Programarea se realizează prin parcurgerea celor 3 pași: alegerea serviciului dorit, selectarea datei și intervalului orar disponibil, urmată de furnizarea datelor reale de contact (nume, număr de telefon). Programarea devine activă imediat și este salvată în agenda electronică a salonului.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  3. Tarife și Modalități de Plată
                </h5>
                <p>
                  Tarifele afișate pe site (ex: 50 lei pentru tuns bărbați, 80 lei pentru tuns + barbă, 35 lei pentru aranjat barbă) sunt exprimate în LEI (RON) și includ toate taxele aplicabile conform legislației din România. Plata serviciilor NU se efectuează online, ci direct în salon (numerar sau card bancar prin POS) după finalizarea prestării serviciului.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  4. Politica de Întârzieri și Anulări
                </h5>
                <p>
                  Vă rugăm să ajungeți cu 5 minute înainte de ora programată. În cazul în care intervine o întârziere mai mare de 15 minute, frizerul își rezervă dreptul de a adapta sau reprograma serviciul pentru a nu decala clienții programați ulterior.
                </p>
                <p className="mt-1">
                  Dacă nu mai puteți ajunge la programare, vă rugăm să anunțați cu cel puțin 2 ore înainte, apelând numărul de telefon al salonului: <a href="tel:0785960301" className="text-[#c59d5f] underline font-bold">0785 960 301</a>.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  5. Reclamații și Soluționarea Litigiilor
                </h5>
                <p>
                  Eventualele neînțelegeri se vor rezolva pe cale amiabilă. Consumatorii au dreptul de a se adresa Autorității Naționale pentru Protecția Consumatorilor (ANPC - <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="text-[#c59d5f] underline">anpc.ro</a>) sau de a utiliza platforma europeană de Soluționare Online a Litigiilor (SOL).
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: POLITICA DE CONFIDENȚIALITATE & GDPR */}
          {activeTab === 'gdpr' && (
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h4 className="font-serif text-xl font-bold text-white mb-1">
                  Politica de Confidențialitate și Protecția Datelor (GDPR)
                </h4>
                <p className="text-xs text-gray-400">
                  Conform Regulamentului (UE) 2016/679 (GDPR) și Legii nr. 190/2018 privind măsuri de punere în aplicare a GDPR în România.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  1. Operatorul Datelor cu Caracter Personal
                </h5>
                <p>
                  Operatorul este salonul de frizerie <strong>Butcher's Cut</strong>. Pentru orice solicitare privind datele dumneavoastră personale, ne puteți contacta telefonic la numărul <a href="tel:0785960301" className="text-[#c59d5f] underline font-bold">0785 960 301</a>.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  2. Ce Date Colectăm și de Ce?
                </h5>
                <p>Colectăm strict datele necesare onorării programării dumneavoastră:</p>
                <ul className="list-disc list-inside space-y-1 mt-1 text-gray-300">
                  <li><strong>Nume și prenume:</strong> pentru identificarea clientului la sosirea în salon;</li>
                  <li><strong>Număr de telefon:</strong> pentru confirmarea rezervării și eventuale notificări urgente de modificare sau reprogramare;</li>
                  <li><strong>Adresă de email (opțional):</strong> pentru transmiterea confirmării electronice;</li>
                  <li><strong>Data, ora și serviciul ales:</strong> pentru alocarea timpului necesar în agenda frizerului.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  3. Temeiul Legal al Prelucrării
                </h5>
                <p>
                  Prelucrarea este fundamentată pe <strong>Art. 6 alin. (1) lit. (b) din GDPR</strong> – prelucrare necesară pentru executarea unui contract de prestări servicii sau pentru demersuri la cererea persoanei vizate înainte de încheierea contractului.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  4. Perioada de Păstrare a Datelor
                </h5>
                <p>
                  Datele sunt stocate în mod securizat pe o perioadă de maxim 6 luni de la data ultimei programări, după care sunt șterse automat sau anonimizate, cu excepția cazului în care legislația fiscală impune o durată mai îndelungată.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  5. Drepturile Dumneavoastră (GDPR)
                </h5>
                <p>
                  Beneficiați de toate drepturile conferite de legislația europeană: dreptul de acces la date, dreptul la rectificare, dreptul la ștergere („dreptul de a fi uitat”), dreptul la restricționarea prelucrării și dreptul de a depune plângere în fața Autorității Naționale de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP - <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-[#c59d5f] underline">dataprotection.ro</a>).
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: POLITICA COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h4 className="font-serif text-xl font-bold text-white mb-1">
                  Politica de Utilizare a Cookie-urilor
                </h4>
                <p className="text-xs text-gray-400">
                  Conform Directivei 2002/58/CE (Directiva ePrivacy) și OUG nr. 13/2012.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  1. Ce sunt Cookie-urile?
                </h5>
                <p>
                  Cookie-urile sunt fișiere text de mici dimensiuni, stocate în memoria navigatorului dumneavoastră web la accesarea paginilor noastre, având rolul de a asigura funcționarea corectă a aplicației de programare.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  2. Ce Cookie-uri Folosim?
                </h5>
                <p>
                  Aplicația web Butcher's Cut folosește <strong>exclusiv cookie-uri tehnice strict necesare</strong> funcționării platformei (salvarea sesiunii curente, memorarea pasului la programare și protecția împotriva atacurilor de tip CSRF).
                </p>
                <div className="p-3 bg-[#141414] border border-[#c59d5f]/20 rounded-sm mt-2">
                  <p className="text-xs text-[#c59d5f] font-semibold">
                    ✓ Transparență totală: Nu folosim cookie-uri de urmărire publicitară (trackere terțe sau reclame).
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[#c59d5f] text-xs uppercase tracking-wider mb-1">
                  3. Cum puteți controla sau șterge cookie-urile?
                </h5>
                <p>
                  Puteți configura în orice moment navigatorul web (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge) să blocheze sau să șteargă fișierele cookie din secțiunea de setări de confidențialitate a browserului dumneavoastră.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Call Button & Close */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <a
            href="tel:0785960301"
            className="flex items-center gap-2 text-[#c59d5f] hover:text-white font-semibold transition-colors"
          >
            <Phone size={14} /> Asistență & Programări: 0785 960 301
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#c59d5f] hover:bg-[#b08745] text-black font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
          >
            Am Înțeles
          </button>
        </div>

      </div>
    </div>
  );
}
