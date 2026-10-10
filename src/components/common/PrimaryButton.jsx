import React from 'react';
import { motion } from 'framer-motion';

export default function PrimaryButton({
  children,
  onClick,
  variant = 'gold',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false
}) {
  const base = "inline-flex items-center justify-center font-medium tracking-[0.18em] uppercase rounded-full transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer";
  
  const sizes = {
    sm: "px-5 py-2 text-[11px]",
    md: "px-7 py-3 text-xs",
    lg: "px-9 py-3.5 text-sm tracking-[0.2em]"
  };

  const variants = {
    gold: "bg-[#c59d5f] hover:bg-[#b08745] text-black font-semibold shadow-md hover:shadow-lg hover:shadow-[#c59d5f]/20",
    outline: "border border-[#c59d5f] text-[#c59d5f] hover:bg-[#c59d5f] hover:text-black",
    dark: "bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white border border-white/10"
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.gold} ${className}`}
    >
      {children}
    </motion.button>
  );
}
