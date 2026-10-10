import React from 'react';

export default function ButchersCutLogo({ size = 44, className = 'text-[#c59d5f]' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Butcher's Cut Logo"
    >
      {/* --- Pig Head Outline --- */}
      {/* Left Ear */}
      <path d="M 36 28 L 18 10 C 15 8, 14 16, 22 34 L 26 40" />
      
      {/* Right Ear */}
      <path d="M 64 28 L 82 10 C 85 8, 86 16, 78 34 L 74 40" />
      
      {/* Top Head Crown */}
      <path d="M 36 28 Q 50 24 64 28" />
      
      {/* Cheeks and Jawline */}
      <path d="M 26 40 C 18 52, 20 70, 32 80 C 40 86, 60 86, 68 80 C 80 70, 82 52, 74 40" />

      {/* Pig Snout (Nose) */}
      <ellipse cx="50" cy="68" rx="13" ry="8.5" />
      {/* Nostrils */}
      <ellipse cx="45" cy="68" rx="1.8" ry="3.2" fill="currentColor" />
      <ellipse cx="55" cy="68" rx="1.8" ry="3.2" fill="currentColor" />

      {/* Pig Eyes (minimalist line art) */}
      <path d="M 31 46 Q 36 44 39 47" />
      <path d="M 69 46 Q 64 44 61 47" />

      {/* --- Scissors inside the pig head --- */}
      {/* Left Handle to Right Blade */}
      <path d="M 38 55 L 61 27" />
      {/* Right Handle to Left Blade */}
      <path d="M 62 55 L 39 27" />
      
      {/* Scissor Finger Loops */}
      <circle cx="36" cy="56" r="4" />
      <circle cx="64" cy="56" r="4" />
      
      {/* Center Pivot Screw */}
      <circle cx="50" cy="41" r="2" fill="currentColor" />
    </svg>
  );
}
