'use client';

import React from 'react';

interface CatMascotProps {
  variant?:
    | 'logo'
    | 'hero-study'
    | 'header-peek'
    | 'card-peek'
    | 'brand-hero'
    | 'paw'
    | 'login-hero'
    | 'kpi-reading'
    | 'kpi-cards'
    | 'kpi-clipboard'
    | 'kpi-medal'
    | 'kpi-peek';
  className?: string;
  size?: number;
}

export function CatMascot({ variant = 'header-peek', className = '', size }: CatMascotProps) {
  // 1. Logo Cat Head: Circular blue badge with cute white nurse cat holding syringe
  if (variant === 'logo') {
    const s = size || 44;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <defs>
          <clipPath id="circle_logo_clip">
            <circle cx="24" cy="24" r="23" />
          </clipPath>
        </defs>

        {/* Circular Blue Background Badge */}
        <circle cx="24" cy="24" r="23" fill="#1565C0" />

        {/* Content clipped to circular badge */}
        <g clipPath="url(#circle_logo_clip)">
          {/* 3 Yellow Radiant Sparkles (Bursting from syringe needle top-right) */}
          <line x1="36" y1="12" x2="41" y2="7" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="39" y1="17" x2="45" y2="17" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="37" y1="22" x2="42" y2="26" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />

          {/* Cat Left Ear */}
          <polygon points="12,21 16,9 23,19" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" strokeLinejoin="round" />
          <polygon points="14,20 17,12 21,18" fill="#FBCFE8" />

          {/* Cat Right Ear */}
          <polygon points="34,21 30,9 23,19" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" strokeLinejoin="round" />
          <polygon points="32,20 29,12 25,18" fill="#FBCFE8" />

          {/* White Nurse Cap with Blue Cross */}
          <path
            d="M18 14 C18 9, 28 9, 28 14 L29 19 C29 20, 17 20, 17 19 Z"
            fill="#FFFFFF"
            stroke="#17365D"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <rect x="22" y="11.5" width="2" height="6" rx="0.5" fill="#1565C0" />
          <rect x="20" y="13.5" width="6" height="2" rx="0.5" fill="#1565C0" />

          {/* Cat Head Base */}
          <ellipse cx="23" cy="26" rx="14" ry="11.5" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" />

          {/* Eyes: Happy Smiling Curves (^ ^) */}
          <path d="M16 25 C16 22.8, 19.5 22.8, 19.5 25" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M26.5 25 C26.5 22.8, 30 22.8, 30 25" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Soft Pink Blush Cheeks */}
          <ellipse cx="14" cy="27" rx="2.5" ry="1.3" fill="#FB7185" opacity="0.65" />
          <ellipse cx="32" cy="27" rx="2.5" ry="1.3" fill="#FB7185" opacity="0.65" />

          {/* Tiny Navy Nose & Smile Mouth (w) */}
          <polygon points="23,27.5 22,26.5 24,26.5" fill="#17365D" />
          <path d="M23 27.5 C22.4 29, 21.2 29, 20.5 28.5" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M23 27.5 C23.6 29, 24.8 29, 25.5 28.5" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Whiskers */}
          <line x1="9" y1="26" x2="13" y2="26.5" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
          <line x1="9" y1="28" x2="13" y2="28" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
          <line x1="33" y1="26.5" x2="37" y2="26" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
          <line x1="33" y1="28" x2="37" y2="28" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />

          {/* Medical Syringe held by right paw */}
          <g transform="rotate(36 34 27)">
            <rect x="32" y="13" width="4.5" height="1.5" rx="0.5" fill="#17365D" />
            <rect x="33.5" y="14.5" width="1.5" height="3" fill="#17365D" />
            <rect x="32.5" y="17.5" width="3.5" height="1" fill="#17365D" />
            <rect x="32" y="18.5" width="4.5" height="10" rx="1" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.2" />
            <rect x="32.5" y="21.5" width="3.5" height="6.5" fill="#38BDF8" />
            <path d="M33.5 28.5 L35 28.5 L34.5 30 L34 30 Z" fill="#17365D" />
            <line x1="34.2" y1="30" x2="34.2" y2="36" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
          </g>

          {/* Left Paw resting along bottom rim */}
          <ellipse cx="17" cy="37" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.6" />
          <line x1="16" y1="36.5" x2="16" y2="39" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
          <line x1="18" y1="36.5" x2="18" y2="39" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />

          {/* Right Paw holding syringe */}
          <ellipse cx="29" cy="37" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.6" />
          <line x1="28" y1="36.5" x2="28" y2="39" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
          <line x1="30" y1="36.5" x2="30" y2="39" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // 2. Paw Print Decoration
  if (variant === 'paw') {
    const s = size || 24;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={`text-[#3B82C4]/25 pointer-events-none select-none ${className}`}
      >
        {/* Main pad */}
        <ellipse cx="16" cy="20" rx="6.5" ry="5.5" />
        {/* 4 toe beans */}
        <ellipse cx="8.5" cy="12.5" rx="2.5" ry="3.5" transform="rotate(-18 8.5 12.5)" />
        <ellipse cx="13.5" cy="9.5" rx="2.4" ry="3.6" transform="rotate(-6 13.5 9.5)" />
        <ellipse cx="18.5" cy="9.5" rx="2.4" ry="3.6" transform="rotate(6 18.5 9.5)" />
        <ellipse cx="23.5" cy="12.5" rx="2.5" ry="3.5" transform="rotate(18 23.5 12.5)" />
      </svg>
    );
  }

  // 3. Header Peek (Small cute smiling cat next to titles)
  if (variant === 'header-peek') {
    const s = size || 36;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 ${className}`}
      >
        {/* Sparkles */}
        <path d="M6 16 L8 12 L10 16 L8 20 Z" fill="#FBBF24" opacity="0.9" />
        <path d="M40 10 L41.5 7 L43 10 L41.5 13 Z" fill="#FBBF24" opacity="0.9" />
        {/* Left Ear */}
        <polygon points="12,18 19,8 24,19" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="14,17 19,10 22,18" fill="#BAE6FD" />
        {/* Right Ear */}
        <polygon points="36,18 29,8 24,19" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="34,17 29,10 26,18" fill="#BAE6FD" />
        {/* Head */}
        <ellipse cx="24" cy="28" rx="16" ry="13" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" />
        {/* Happy Curved Eyes */}
        <path d="M16 26 C16 23.5, 20 23.5, 20 26" stroke="#142D4E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M28 26 C28 23.5, 32 23.5, 32 26" stroke="#142D4E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Cute blush */}
        <ellipse cx="14" cy="30" rx="2.5" ry="1.2" fill="#F472B6" opacity="0.5" />
        <ellipse cx="34" cy="30" rx="2.5" ry="1.2" fill="#F472B6" opacity="0.5" />
        {/* Nose & Mouth */}
        <polygon points="24,29.5 22.5,27.5 25.5,27.5" fill="#142D4E" />
        <path d="M24 29.5 C23 31.5, 21.5 31.5, 21 31" stroke="#142D4E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M24 29.5 C25 31.5, 26.5 31.5, 27 31" stroke="#142D4E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        {/* Whiskers */}
        <line x1="8" y1="28" x2="13" y2="29" stroke="#142D4E" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="8" y1="31" x2="13" y2="31" stroke="#142D4E" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="35" y1="29" x2="40" y2="28" stroke="#142D4E" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="35" y1="31" x2="40" y2="31" stroke="#142D4E" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Card Peek (Cat peeking over top-right border with paws on card edge)
  if (variant === 'card-peek') {
    return (
      <svg
        width="76"
        height="54"
        viewBox="0 0 76 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Sparkles */}
        <path d="M12 18 L14 13 L16 18 L14 23 Z" fill="#FBBF24" opacity="0.9" />
        <path d="M64 12 L65.5 8 L67 12 L65.5 16 Z" fill="#FBBF24" opacity="0.9" />
        {/* Left Ear */}
        <polygon points="20,24 27,10 33,24" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="22,23 27,13 31,23" fill="#BAE6FD" />
        {/* Right Ear */}
        <polygon points="54,24 47,10 41,24" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="52,23 47,13 43,23" fill="#BAE6FD" />
        {/* Head */}
        <path
          d="M18 36 C18 22, 56 22, 56 36 C56 46, 18 46, 18 36 Z"
          fill="#FFFFFF"
          stroke="#142D4E"
          strokeWidth="2"
        />
        {/* Closed happy eyes */}
        <path d="M26 31 C26 28, 30 28, 30 31" stroke="#142D4E" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M44 31 C44 28, 48 28, 48 31" stroke="#142D4E" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Blush */}
        <ellipse cx="23" cy="35" rx="3" ry="1.5" fill="#F472B6" opacity="0.5" />
        <ellipse cx="51" cy="35" rx="3" ry="1.5" fill="#F472B6" opacity="0.5" />
        {/* Nose & Mouth */}
        <polygon points="37,34 35.5,32 38.5,32" fill="#142D4E" />
        <path d="M37 34 C36 36, 34.5 36, 34 35.5" stroke="#142D4E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M37 34 C38 36, 39.5 36, 40 35.5" stroke="#142D4E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Whiskers */}
        <line x1="16" y1="33" x2="22" y2="34" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="16" y1="36" x2="22" y2="36" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="34" x2="58" y2="33" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="36" x2="58" y2="36" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        {/* Paws resting on bottom line */}
        <ellipse cx="24" cy="46" rx="5" ry="3.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <line x1="22.5" y1="46" x2="22.5" y2="48.5" stroke="#142D4E" strokeWidth="1.2" />
        <line x1="25.5" y1="46" x2="25.5" y2="48.5" stroke="#142D4E" strokeWidth="1.2" />
        <ellipse cx="50" cy="46" rx="5" ry="3.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <line x1="48.5" y1="46" x2="48.5" y2="48.5" stroke="#142D4E" strokeWidth="1.2" />
        <line x1="51.5" y1="46" x2="51.5" y2="48.5" stroke="#142D4E" strokeWidth="1.2" />
      </svg>
    );
  }

  // 5. Hero Study (Cute cat curled up sleeping on a stack of books)
  if (variant === 'hero-study') {
    return (
      <svg
        width="190"
        height="140"
        viewBox="0 0 190 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Sparkles / Ambient Zzz or stars */}
        <path d="M30 40 L32 35 L34 40 L32 45 Z" fill="#93C5FD" opacity="0.8" />
        <path d="M165 30 L167 24 L169 30 L167 36 Z" fill="#FBBF24" opacity="0.9" />
        <line x1="26" y1="28" x2="32" y2="22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="160" y1="18" x2="166" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <line x1="172" y1="44" x2="178" y2="40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        {/* Stack of Books */}
        {/* Bottom Book (Deep Navy) */}
        <rect x="25" y="102" width="140" height="20" rx="5" fill="#142D4E" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="35" y="105" width="125" height="14" rx="3" fill="#F8FAFC" />
        <line x1="45" y1="112" x2="150" y2="112" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="23" y="102" width="14" height="20" rx="3" fill="#0F243E" />

        {/* Middle Book (Primary Blue) */}
        <rect x="32" y="84" width="130" height="19" rx="5" fill="#1565C0" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="42" y="87" width="115" height="13" rx="3" fill="#F8FAFC" />
        <line x1="50" y1="93" x2="145" y2="93" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="30" y="84" width="14" height="19" rx="3" fill="#0D47A1" />

        {/* Top Book (Soft Sky Blue) */}
        <rect x="40" y="66" width="120" height="19" rx="5" fill="#3B82C4" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="50" y="69" width="105" height="13" rx="3" fill="#F8FAFC" />
        <line x1="58" y1="75" x2="142" y2="75" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="38" y="66" width="14" height="19" rx="3" fill="#1E5B94" />

        {/* Sleeping Cat Curled on Top Book */}
        {/* Cat Body */}
        <ellipse cx="108" cy="50" rx="32" ry="20" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.5" />
        {/* Cat Tail curled around */}
        <path
          d="M138 52 C152 50, 154 62, 142 66 C136 68, 126 66, 122 66"
          stroke="#142D4E"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cat Head */}
        <circle cx="82" cy="44" r="18" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.5" />
        {/* Left Ear */}
        <polygon points="68,34 72,18 81,30" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="70,32 73,22 79,29" fill="#BAE6FD" />
        {/* Right Ear */}
        <polygon points="90,30 98,18 102,34" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="92,29 97,22 100,32" fill="#BAE6FD" />

        {/* Sleeping Eyes (Happy Curves) */}
        <path d="M72 44 C72 41, 76 41, 76 44" stroke="#142D4E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M84 44 C84 41, 88 41, 88 44" stroke="#142D4E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Nose & Mouth */}
        <polygon points="80,48 78.5,46 81.5,46" fill="#142D4E" />
        <path d="M80 48 C79 50, 77.5 50, 77 49.5" stroke="#142D4E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M80 48 C81 50, 82.5 50, 83 49.5" stroke="#142D4E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Blush */}
        <ellipse cx="69" cy="48" rx="3" ry="1.5" fill="#F472B6" opacity="0.6" />
        <ellipse cx="91" cy="48" rx="3" ry="1.5" fill="#F472B6" opacity="0.6" />
        {/* Paws curled under */}
        <ellipse cx="88" cy="62" rx="7" ry="5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" />
        <line x1="86" y1="62" x2="86" y2="66" stroke="#142D4E" strokeWidth="1.5" />
        <line x1="89" y1="62" x2="89" y2="66" stroke="#142D4E" strokeWidth="1.5" />
      </svg>
    );
  }

  // 6. Brand Hero (Used above the big STUDYMATE title in Screenshot 1)
  if (variant === 'brand-hero') {
    return (
      <svg
        width="90"
        height="65"
        viewBox="0 0 90 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none inline-block ${className}`}
      >
        {/* Sparkles */}
        <path d="M12 26 L14 20 L16 26 L14 32 Z" fill="#38BDF8" opacity="0.9" />
        <path d="M78 18 L79.5 13 L81 18 L79.5 23 Z" fill="#FBBF24" opacity="0.9" />
        {/* Left Ear */}
        <polygon points="26,30 33,14 41,30" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="29,28 34,18 39,28" fill="#BAE6FD" />
        {/* Right Ear */}
        <polygon points="64,30 57,14 49,30" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="61,28 56,18 51,28" fill="#BAE6FD" />
        {/* Head */}
        <ellipse cx="45" cy="42" rx="22" ry="17" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.5" />
        {/* Eyes */}
        <path d="M34 40 C34 37, 39 37, 39 40" stroke="#142D4E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M51 40 C51 37, 56 37, 56 40" stroke="#142D4E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Blush */}
        <ellipse cx="30" cy="46" rx="3.5" ry="1.8" fill="#F472B6" opacity="0.5" />
        <ellipse cx="60" cy="46" rx="3.5" ry="1.8" fill="#F472B6" opacity="0.5" />
        {/* Nose & Smile */}
        <polygon points="45,45 43,42.5 47,42.5" fill="#142D4E" />
        <path d="M45 45 C43.5 48, 41 48, 40 47" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M45 45 C46.5 48, 49 48, 50 47" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Cute front paws hanging down */}
        <ellipse cx="37" cy="59" rx="6.5" ry="4" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" />
        <ellipse cx="53" cy="59" rx="6.5" ry="4" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" />
      </svg>
    );
  }

  // 7. Login Hero Mascot (Centered cute cat with paws on front and 3 amber radiant sparkles on top-right)
  if (variant === 'login-hero') {
    const s = size || 80;
    return (
      <svg
        width={s}
        height={s * 0.75}
        viewBox="0 0 80 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none inline-block ${className}`}
      >
        {/* 3 Amber radiant tick marks on top-right */}
        <line x1="68" y1="12" x2="75" y2="7" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="72" y1="19" x2="79" y2="19" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="26" x2="75" y2="30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Left Ear */}
        <polygon points="18,24 25,6 34,20" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.4" strokeLinejoin="round" />
        <polygon points="21,22 26,10 32,19" fill="#93C5FD" />

        {/* Right Ear */}
        <polygon points="62,24 55,6 46,20" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.4" strokeLinejoin="round" />
        <polygon points="59,22 54,10 48,19" fill="#93C5FD" />

        {/* Head outline */}
        <path
          d="M18 36 C18 19, 62 19, 62 36 C62 48, 18 48, 18 36 Z"
          fill="#FFFFFF"
          stroke="#142D4E"
          strokeWidth="2.4"
        />

        {/* Cute dot eyes */}
        <ellipse cx="28" cy="33" rx="2.5" ry="3" fill="#142D4E" />
        <ellipse cx="52" cy="33" rx="2.5" ry="3" fill="#142D4E" />

        {/* Tiny nose & smile mouth */}
        <polygon points="40,36 38.5,34 41.5,34" fill="#142D4E" />
        <path d="M40 36 C39 38.5, 37 38.5, 36 38" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M40 36 C41 38.5, 43 38.5, 44 38" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="13" y1="34" x2="20" y2="35" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="13" y1="38" x2="20" y2="38" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="60" y1="35" x2="67" y2="34" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="60" y1="38" x2="67" y2="38" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />

        {/* Two front paws */}
        <ellipse cx="30" cy="48" rx="6" ry="4.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />
        <ellipse cx="50" cy="48" rx="6" ry="4.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />
      </svg>
    );
  }

  // 8. KPI Assigned Subjects: Cat Reading Open Book
  if (variant === 'kpi-reading') {
    const s = size || 42;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Sparkles on top right */}
        <line x1="40" y1="10" x2="44" y2="6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="43" y1="14" x2="47" y2="14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="18" x2="44" y2="21" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

        {/* Cat Ears */}
        <polygon points="12,18 17,6 23,17" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="14,16 18,9 21,15" fill="#93C5FD" />
        <polygon points="36,18 31,6 25,17" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="34,16 30,9 27,15" fill="#93C5FD" />

        {/* Cat Head */}
        <ellipse cx="24" cy="22" rx="14" ry="11" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" />

        {/* Happy Curved Eyes */}
        <path d="M17 21 C17 19, 21 19, 21 21" stroke="#142D4E" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M27 21 C27 19, 31 19, 31 21" stroke="#142D4E" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Nose & Smile */}
        <polygon points="24,24 23,22.5 25,22.5" fill="#142D4E" />
        <path d="M24 24 C23 25.5, 22 25.5, 21.5 25" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M24 24 C25 25.5, 26 25.5, 26.5 25" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Open Book in front */}
        <path d="M24 38 C20 36, 12 34, 8 36 L8 28 C12 26, 20 28, 24 30 Z" fill="#93C5FD" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 38 C28 36, 36 34, 40 36 L40 28 C36 26, 28 28, 24 30 Z" fill="#3B82C4" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <line x1="24" y1="30" x2="24" y2="38" stroke="#142D4E" strokeWidth="2" />

        {/* Little paws holding the book sides */}
        <ellipse cx="11" cy="30" rx="3" ry="2.2" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <ellipse cx="37" cy="30" rx="3" ry="2.2" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
      </svg>
    );
  }

  // 9. KPI Flashcard Mastery: 3 Fanned Cards with Paw Print
  if (variant === 'kpi-cards') {
    const s = size || 42;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Sparkles on top right */}
        <line x1="40" y1="10" x2="44" y2="6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="43" y1="14" x2="47" y2="14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="18" x2="44" y2="21" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

        {/* Back card (tilted left) */}
        <rect x="7" y="14" width="18" height="26" rx="3.5" transform="rotate(-15 7 14)" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        {/* Middle card */}
        <rect x="14" y="11" width="18" height="26" rx="3.5" transform="rotate(-2 14 11)" fill="#F0F7FD" stroke="#142D4E" strokeWidth="1.8" />
        {/* Front card (tilted right) */}
        <rect x="19" y="12" width="18" height="26" rx="3.5" transform="rotate(10 19 12)" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" />

        {/* Paw print on front card */}
        <g transform="translate(24, 21) rotate(10)">
          <ellipse cx="0" cy="4" rx="4" ry="3.2" fill="#1565C0" />
          <ellipse cx="-4" cy="-0.5" rx="1.5" ry="2" transform="rotate(-15 -4 -0.5)" fill="#1565C0" />
          <ellipse cx="-1.3" cy="-2.5" rx="1.5" ry="2.2" fill="#1565C0" />
          <ellipse cx="1.6" cy="-2.5" rx="1.5" ry="2.2" fill="#1565C0" />
          <ellipse cx="4.2" cy="-0.5" rx="1.5" ry="2" transform="rotate(15 4.2 -0.5)" fill="#1565C0" />
        </g>
      </svg>
    );
  }

  // 10. KPI Exams Completed: Clipboard with Checkmark and Cat Paw
  if (variant === 'kpi-clipboard') {
    const s = size || 42;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Clipboard board */}
        <rect x="11" y="9" width="24" height="31" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
        {/* Clip at top */}
        <rect x="18" y="6" width="10" height="5" rx="2" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
        <circle cx="23" cy="8.5" r="1.2" fill="#FFFFFF" />

        {/* Green Checkmark */}
        <path d="M17 24 L21.5 28.5 L29 18" stroke="#10B981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Cat Paw holding the bottom-right corner */}
        <g transform="translate(32, 33)">
          <path d="M6 13 C6 7, 2 2, -2 4 C-5 5, -4 10, -2 13 Z" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
          <ellipse cx="0" cy="6" rx="4.5" ry="3.8" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
          <ellipse cx="-2.5" cy="3.5" rx="1.2" ry="1.5" fill="#93C5FD" />
          <ellipse cx="0" cy="2.5" rx="1.2" ry="1.6" fill="#93C5FD" />
          <ellipse cx="2.5" cy="3.5" rx="1.2" ry="1.5" fill="#93C5FD" />
          <ellipse cx="0" cy="7" rx="2.2" ry="1.6" fill="#93C5FD" />
        </g>
      </svg>
    );
  }

  // 11. KPI Average Score: Gold Ribbon Medal with Paw Print
  if (variant === 'kpi-medal') {
    const s = size || 42;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Sparkles on top right */}
        <line x1="39" y1="10" x2="43" y2="6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="14" x2="46" y2="14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="39" y1="18" x2="43" y2="21" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

        {/* Ribbon tails at bottom */}
        <path d="M19 28 L15 41 L21 38 L25 41 L23 28" fill="#1565C0" stroke="#142D4E" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M29 28 L33 41 L27 38 L23 41 L25 28" fill="#1565C0" stroke="#142D4E" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Medal circle */}
        <circle cx="24" cy="21" r="13" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        <circle cx="24" cy="21" r="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />

        {/* Paw print inside medal */}
        <g transform="translate(24, 21)">
          <ellipse cx="0" cy="2.2" rx="3.6" ry="2.8" fill="#142D4E" />
          <ellipse cx="-3.4" cy="-1.8" rx="1.3" ry="1.7" transform="rotate(-15 -3.4 -1.8)" fill="#142D4E" />
          <ellipse cx="-1.1" cy="-3.5" rx="1.3" ry="1.8" fill="#142D4E" />
          <ellipse cx="1.3" cy="-3.5" rx="1.3" ry="1.8" fill="#142D4E" />
          <ellipse cx="3.5" cy="-1.8" rx="1.3" ry="1.7" transform="rotate(15 3.5 -1.8)" fill="#142D4E" />
        </g>
      </svg>
    );
  }

  // 12. Peeking Cat for Average Score Card Bottom-Right
  if (variant === 'kpi-peek') {
    const s = size || 56;
    return (
      <svg
        width={s}
        height={s * 0.65}
        viewBox="0 0 64 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Sparkles on top right */}
        <line x1="54" y1="9" x2="59" y2="5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="57" y1="14" x2="62" y2="14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <line x1="54" y1="19" x2="59" y2="23" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

        {/* Left Ear */}
        <polygon points="14,18 20,4 27,15" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="16,16 20,7 25,14" fill="#93C5FD" />

        {/* Right Ear */}
        <polygon points="50,18 44,4 37,15" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="48,16 44,7 39,14" fill="#93C5FD" />

        {/* Head */}
        <path
          d="M14 26 C14 13, 50 13, 50 26 C50 36, 14 36, 14 26 Z"
          fill="#FFFFFF"
          stroke="#142D4E"
          strokeWidth="2"
        />

        {/* Happy curved eyes */}
        <path d="M21 24 C21 21.5, 25 21.5, 25 24" stroke="#142D4E" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M39 24 C39 21.5, 43 21.5, 43 24" stroke="#142D4E" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Nose & Smile */}
        <polygon points="32,27 30.8,25.5 33.2,25.5" fill="#142D4E" />
        <path d="M32 27 C31 29, 29.5 29, 29 28.5" stroke="#142D4E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M32 27 C33 29, 34.5 29, 35 28.5" stroke="#142D4E" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="9" y1="24" x2="16" y2="25" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9" y1="28" x2="16" y2="28" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="48" y1="25" x2="55" y2="24" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="48" y1="28" x2="55" y2="28" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />

        {/* Two front paws resting on bottom card edge */}
        <ellipse cx="23" cy="35" rx="5" ry="3.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <ellipse cx="41" cy="35" rx="5" ry="3.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
      </svg>
    );
  }

  return null;
}

