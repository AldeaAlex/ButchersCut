import React from 'react';
import { motion } from 'framer-motion';
import PrimaryButton from '../components/common/PrimaryButton';
import ButchersCutLogo from '../components/common/ButchersCutLogo';
import { Calendar, Clock, Scissors, ChevronDown, Phone } from 'lucide-react';

export default function HeroPage({ onBook, services = [] }) {
  const scrollToPricing = () => {
    const el = document.getElementById('lista-preturi');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeServices = services.filter((s) => s.isActive !== false);

  // Framer-motion variants pentru staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1]
      }
    })
  };

  return (
    <div className="w-full">
      {/* Secțiunea Hero Principală */}
      <section className="relative min-h-[calc(100svh-70px)] sm:min-h-[calc(100vh-80px)] py-8 sm:py-20 px-4 sm:px-6 flex items-center justify-center">
        {/* Subtle luxury background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,157,95,0.09)_0%,transparent_70%)] pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-md sm:max-w-xl mx-auto text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8 w-full"
        >
          {/* Emblema Logo Line Art - cap de porc cu foarfecă cu micro-animație la intrare */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, borderColor: '#c59d5f' }}
            whileTap={{ scale: 0.95 }}
            className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-[#c59d5f]/50 bg-[#151515] flex items-center justify-center shadow-2xl transition-colors duration-300 group cursor-pointer"
          >
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <ButchersCutLogo size={80} className="text-[#c59d5f] sm:hidden group-hover:scale-105 transition-transform" />
              <ButchersCutLogo size={105} className="text-[#c59d5f] hidden sm:block group-hover:scale-105 transition-transform" />
            </motion.div>
          </motion.div>

          {/* Numele Brandului sub Logo */}
          <motion.div variants={itemVariants} className="space-y-2.5 sm:space-y-3">
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.22em] text-white uppercase drop-shadow-md">
              BUTCHERS CUT
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 tracking-[0.18em] uppercase font-light">
              Barbershop Tradițional & Măiestrie Modernă
            </p>
            <div className="w-12 h-[2px] bg-[#c59d5f] mx-auto opacity-75" />
          </motion.div>

          {/* Butoane Call to Action */}
          <motion.div variants={itemVariants} className="pt-2 w-full flex flex-col items-center gap-3">
            <PrimaryButton
              onClick={() => onBook()}
              size="lg"
              className="w-full max-w-xs sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm tracking-[0.22em] shadow-2xl justify-center"
            >
              <Calendar size={18} className="mr-2.5 sm:mr-3 shrink-0" /> FĂ O PROGRAMARE
            </PrimaryButton>

            <motion.button
              onClick={scrollToPricing}
              whileHover={{ y: 2 }}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-[#c59d5f] transition-colors py-2 px-4 cursor-pointer"
            >
              <span>Vezi Lista de Prețuri</span>
              <ChevronDown size={14} className="animate-bounce" />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Secțiunea Listă de Prețuri & Servicii */}
      <section
        id="lista-preturi"
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-t border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c59d5f]/10 border border-[#c59d5f]/30 text-[#c59d5f] text-[11px] font-semibold uppercase tracking-[0.2em]">
            <Scissors size={13} /> Tarife & Servicii
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-wide">
            Listă de Prețuri
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
            Fiecare tunsoare și îngrijire de barbă include consultanță personalizată, spălare și produse de styling premium.
          </p>
          <div className="w-16 h-[2px] bg-[#c59d5f] mx-auto opacity-75 mt-3" />
        </motion.div>

        {/* Grid Servicii animate cu framer-motion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {activeServices.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6, borderColor: 'rgba(197, 157, 95, 0.7)' }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-[#181818] border border-white/10 rounded-md p-6 sm:p-7 flex flex-col justify-between transition-colors duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#c59d5f]/5 group relative overflow-hidden"
            >
              {/* Linie aurie subtilă sus */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c59d5f] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#c59d5f] transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-mono shrink-0 bg-[#222222] px-2.5 py-1 rounded border border-white/5">
                    <Clock size={12} className="text-[#c59d5f]" />
                    <span>{service.dur || `${service.durationMinutes} min`}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {service.description || 'Serviciu profesional realizat de bărbier cu atenție desăvârșită la detalii.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 block leading-none mb-1">
                    Tarif
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#c59d5f] leading-none">
                    {service.price} <span className="text-xs font-sans text-gray-300 font-normal">lei</span>
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onBook(service.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-[#c59d5f] hover:bg-[#b08745] text-black font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shrink-0"
                >
                  <Calendar size={13} /> Programează
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notă de contact cu micro-animație la scroll */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 sm:mt-12 p-5 rounded-md bg-[#141414] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="space-y-1">
            <span className="text-white font-medium text-xs sm:text-sm block">
              Ai nevoie de un serviciu special sau programare urgentă?
            </span>
            <span className="text-gray-400 text-xs font-light block">
              Suntem bucuroși să te ajutăm telefonic oricând în timpul programului.
            </span>
          </div>
          <motion.a
            href="tel:0785960301"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c59d5f]/50 hover:bg-[#c59d5f] hover:text-black text-[#c59d5f] text-xs uppercase tracking-wider font-semibold transition-all shrink-0 cursor-pointer"
          >
            <Phone size={13} /> 0785 960 301
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
