'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* SVG Subcomponents for Login Page (matching reference design precisely)     */
/* -------------------------------------------------------------------------- */

// 1. Nurse Cat Mascot holding Syringe with yellow radiant sparkles & blue stars
function NurseCatMascot({ className = '' }: { className?: string }) {
  return (
    <svg
      width="130"
      height="100"
      viewBox="0 0 130 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Upper-Left Pastel Blue Sparkle Stars */}
      <path d="M18 28 L20 22 L22 28 L20 34 Z" fill="#38BDF8" />
      <circle cx="28" cy="20" r="2.2" fill="#93C5FD" />
      <path d="M26 38 L27.5 34 L29 38 L27.5 42 Z" fill="#38BDF8" opacity="0.8" />

      {/* Upper-Right Yellow Radiant Sparkles (bursting from the needle) */}
      <line x1="94" y1="20" x2="102" y2="14" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="99" y1="27" x2="108" y2="27" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="95" y1="34" x2="103" y2="40" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />

      {/* Cat Left Ear */}
      <polygon points="40,42 48,20 58,36" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" strokeLinejoin="round" />
      <polygon points="43,40 49,24 56,35" fill="#BAE6FD" />

      {/* Cat Right Ear */}
      <polygon points="86,42 78,20 68,36" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" strokeLinejoin="round" />
      <polygon points="83,40 77,24 70,35" fill="#BAE6FD" />

      {/* Cat Head Base */}
      <ellipse cx="63" cy="54" rx="28" ry="23" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" />

      {/* Nurse Cap between Ears */}
      <path
        d="M50 32 C50 25, 76 25, 76 32 L78 39 C78 40, 48 40, 48 39 Z"
        fill="#FFFFFF"
        stroke="#17365D"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Blue Medical Cross on Nurse Cap */}
      <rect x="61.5" y="28" width="3" height="8" rx="0.8" fill="#1685E8" />
      <rect x="59" y="30.5" width="8" height="3" rx="0.8" fill="#1685E8" />

      {/* Happy Closed Smiling Eyes (^ ^) */}
      <path d="M49 52 C49 48, 54 48, 54 52" stroke="#17365D" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M72 52 C72 48, 77 48, 77 52" stroke="#17365D" strokeWidth="2.4" strokeLinecap="round" fill="none" />

      {/* Soft Pink Blush Cheeks */}
      <ellipse cx="45" cy="56" rx="3.5" ry="2" fill="#F472B6" opacity="0.55" />
      <ellipse cx="81" cy="56" rx="3.5" ry="2" fill="#F472B6" opacity="0.55" />

      {/* Tiny Navy Nose & Cat Mouth (w) */}
      <polygon points="63,57 61.5,55 64.5,55" fill="#17365D" />
      <path d="M63 57 C62 59.5, 60 59.5, 59 58.5" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M63 57 C64 59.5, 66 59.5, 67 58.5" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Cute Whiskers */}
      <line x1="34" y1="54" x2="41" y2="55" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="34" y1="58" x2="41" y2="58" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="85" y1="55" x2="92" y2="54" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="85" y1="58" x2="92" y2="58" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />

      {/* Syringe held in right paw, angled up to the right */}
      <g transform="rotate(38 86 50)">
        {/* Plunger handle */}
        <rect x="82" y="24" width="8" height="2.5" rx="1" fill="#17365D" />
        <rect x="85" y="26.5" width="2" height="7.5" fill="#17365D" />
        <rect x="83" y="34" width="6" height="2" fill="#17365D" />
        {/* Barrel Body */}
        <rect x="82.5" y="36" width="7" height="19" rx="1.5" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" />
        {/* Blue Liquid inside barrel */}
        <rect x="83.5" y="42" width="5" height="12" rx="0.5" fill="#38BDF8" />
        {/* Measurement tick marks */}
        <line x1="83" y1="40" x2="86" y2="40" stroke="#17365D" strokeWidth="1" />
        <line x1="83" y1="44" x2="86" y2="44" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="83" y1="48" x2="86" y2="48" stroke="#FFFFFF" strokeWidth="1" />
        {/* Syringe Needle */}
        <path d="M84.5 55 L87.5 55 L86.5 58 L85.5 58 Z" fill="#17365D" />
        <line x1="86" y1="58" x2="86" y2="69" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Front Paws resting on the shelf/card border */}
      <ellipse cx="51" cy="76" rx="7.5" ry="5.5" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.2" />
      <line x1="49" y1="76" x2="49" y2="80" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="53" y1="76" x2="53" y2="80" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />

      <ellipse cx="75" cy="76" rx="7.5" ry="5.5" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.2" />
      <line x1="73" y1="76" x2="73" y2="80" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="77" y1="76" x2="77" y2="80" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// 2. Male Cat Avatar for Paul (Admin)
function MaleCatAvatar() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="paul_cat_bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DCEEFF" />
          <stop offset="1" stopColor="#B9DCFF" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#paul_cat_bg)" />

      {/* Ears */}
      <polygon points="12,18 16,8 21,17" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points="14,17 17,11 20,16" fill="#93C5FD" />
      <polygon points="32,18 28,8 23,17" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points="30,17 27,11 24,16" fill="#93C5FD" />

      {/* Blue Cap / Beret on Left Ear */}
      <ellipse cx="18" cy="12" rx="7" ry="4.5" transform="rotate(-15 18 12)" fill="#1685E8" stroke="#17365D" strokeWidth="1.4" />
      <circle cx="16" cy="9" r="1.4" fill="#38BDF8" />

      {/* Cat Head */}
      <ellipse cx="22" cy="24" rx="13" ry="10" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" />

      {/* Eyes */}
      <path d="M16 23 C16 21, 19 21, 19 23" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M25 23 C25 21, 28 21, 28 23" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Nose & Mouth */}
      <polygon points="22,26 21,24.5 23,24.5" fill="#17365D" />
      <path d="M22 26 C21.2 27.5, 19.8 27.5, 19 27" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M22 26 C22.8 27.5, 24.2 27.5, 25 27" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Whiskers */}
      <line x1="10" y1="24" x2="14" y2="24.5" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="26" x2="14" y2="26" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="24.5" x2="34" y2="24" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="26" x2="34" y2="26" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />

      {/* Blue Bowtie */}
      <polygon points="19,34 22,35.5 19,37" fill="#1685E8" stroke="#17365D" strokeWidth="1" strokeLinejoin="round" />
      <polygon points="25,34 22,35.5 25,37" fill="#1685E8" stroke="#17365D" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="22" cy="35.5" r="1.4" fill="#38BDF8" stroke="#17365D" strokeWidth="0.8" />
    </svg>
  );
}

// 3. Female Cat Avatar for Shaina (Student)
function FemaleCatAvatar() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="shaina_cat_bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE6EE" />
          <stop offset="1" stopColor="#E2F0FE" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#shaina_cat_bg)" />

      {/* Ears */}
      <polygon points="12,18 16,8 21,17" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points="14,17 17,11 20,16" fill="#FBCFE8" />
      <polygon points="32,18 28,8 23,17" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points="30,17 27,11 24,16" fill="#FBCFE8" />

      {/* Pink Bow on Left Ear */}
      <ellipse cx="14" cy="15" rx="3.5" ry="2.2" transform="rotate(-30 14 15)" fill="#F472B6" stroke="#17365D" strokeWidth="1" />
      <ellipse cx="18" cy="13" rx="3.5" ry="2.2" transform="rotate(30 18 13)" fill="#F472B6" stroke="#17365D" strokeWidth="1" />
      <circle cx="16" cy="14" r="1.5" fill="#FB7185" stroke="#17365D" strokeWidth="0.8" />

      {/* Cat Head */}
      <ellipse cx="22" cy="24" rx="13" ry="10" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" />

      {/* Eyes */}
      <path d="M16 23 C16 21, 19 21, 19 23" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M25 23 C25 21, 28 21, 28 23" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Soft Pink Blush */}
      <ellipse cx="14.5" cy="25" rx="2.2" ry="1.2" fill="#FB7185" opacity="0.6" />
      <ellipse cx="29.5" cy="25" rx="2.2" ry="1.2" fill="#FB7185" opacity="0.6" />

      {/* Nose & Mouth */}
      <polygon points="22,26 21,24.5 23,24.5" fill="#17365D" />
      <path d="M22 26 C21.2 27.5, 19.8 27.5, 19 27" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M22 26 C22.8 27.5, 24.2 27.5, 25 27" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Whiskers */}
      <line x1="10" y1="24" x2="14" y2="24.5" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="26" x2="14" y2="26" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="24.5" x2="34" y2="24" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="26" x2="34" y2="26" stroke="#17365D" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// 4. Medical Kit & Books Illustration (Bottom Left Background)
function MedicalKitAndBooksIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      width="190"
      height="130"
      viewBox="0 0 190 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Background Soft Glow */}
      <ellipse cx="90" cy="95" rx="80" ry="28" fill="#BAE6FD" opacity="0.4" />

      {/* First Aid Kit */}
      {/* Handle */}
      <path d="M48 48 C48 38, 76 38, 76 48" stroke="#60A5FA" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      {/* Box Body */}
      <rect x="28" y="46" width="68" height="54" rx="14" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
      <rect x="32" y="50" width="60" height="46" rx="10" fill="#F0F9FF" />
      {/* Blue Medical Cross */}
      <rect x="58.5" y="62" width="7" height="22" rx="2" fill="#60A5FA" />
      <rect x="51" y="69.5" width="22" height="7" rx="2" fill="#60A5FA" />
      {/* Top Latch */}
      <rect x="57" y="44" width="10" height="4" rx="2" fill="#93C5FD" />

      {/* Stack of Study Books */}
      {/* Bottom Book */}
      <rect x="90" y="85" width="68" height="15" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2.2" />
      <rect x="94" y="87" width="60" height="11" rx="2" fill="#E0F2FE" />
      <line x1="100" y1="92" x2="148" y2="92" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="3 2" />

      {/* Top Book */}
      <rect x="95" y="71" width="64" height="15" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2.2" />
      <rect x="99" y="73" width="56" height="11" rx="2" fill="#BAE6FD" />
      <line x1="105" y1="78" x2="147" y2="78" stroke="#60A5FA" strokeWidth="1.4" strokeDasharray="3 2" />
    </svg>
  );
}

// 5. Heartbeat Waveform & Heart Outline Illustration (Bottom Right Background)
function HeartbeatIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      width="250"
      height="100"
      viewBox="0 0 250 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Flowing Pulse Line with QRS spikes */}
      <path
        d="M10 56 L65 56 L72 50 L77 56 L83 26 L90 82 L97 46 L103 62 L108 56 L138 56"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heart Outline that smoothly receives the pulse line */}
      <path
        d="M138 56 C138 42, 148 30, 164 30 C178 30, 187 42, 187 54 C187 72, 168 88, 164 92 C160 88, 141 72, 141 54 C141 42, 150 30, 164 30"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 6. Cute Paw Print (Filled & Outline options)
function PawPrint({
  size = 24,
  className = '',
  outline = false,
}: {
  size?: number;
  className?: string;
  outline?: boolean;
}) {
  if (outline) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none select-none ${className}`}
      >
        <path d="M16 26 C12 26 10 23 10 20 C10 17 13 16 16 16 C19 16 22 17 22 20 C22 23 20 26 16 26 Z" />
        <ellipse cx="8" cy="12" rx="2.2" ry="3.2" transform="rotate(-15 8 12)" />
        <ellipse cx="13" cy="9" rx="2.2" ry="3.2" transform="rotate(-5 13 9)" />
        <ellipse cx="19" cy="9" rx="2.2" ry="3.2" transform="rotate(5 19 9)" />
        <ellipse cx="24" cy="12" rx="2.2" ry="3.2" transform="rotate(15 24 12)" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      <ellipse cx="16" cy="20" rx="6.5" ry="5.5" />
      <ellipse cx="8.5" cy="12.5" rx="2.5" ry="3.5" transform="rotate(-18 8.5 12.5)" />
      <ellipse cx="13.5" cy="9.5" rx="2.4" ry="3.6" transform="rotate(-6 13.5 9.5)" />
      <ellipse cx="18.5" cy="9.5" rx="2.4" ry="3.6" transform="rotate(6 18.5 9.5)" />
      <ellipse cx="23.5" cy="12.5" rx="2.5" ry="3.5" transform="rotate(18 23.5 12.5)" />
    </svg>
  );
}

// 7. Radiant Sparkle Ticks for Title (Left and Right)
function RadiantTicks({ direction = 'left' }: { direction?: 'left' | 'right' }) {
  if (direction === 'left') {
    return (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none" className="shrink-0 select-none">
        <line x1="16" y1="5" x2="6" y2="3" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="17" y1="11" x2="5" y2="11" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="16" y1="17" x2="6" y2="19" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" className="shrink-0 select-none">
      <line x1="6" y1="5" x2="16" y2="3" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="5" y1="11" x2="17" y2="11" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="6" y1="17" x2="16" y2="19" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Main LoginPage Component                                                    */
/* -------------------------------------------------------------------------- */

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  // Preserved credentials, supports both internal and user-facing @pawstudy.local
  const [email, setEmail] = useState('student@pawstudy.local');
  const [password, setPassword] = useState('studymate123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Authenticate without changing internal logic
  const executeLogin = async (targetEmail: string, targetPass: string) => {
    setError(null);
    setIsLoading(true);

    // Normalize email alias to internal authentication store if needed
    const normalized = targetEmail
      .trim()
      .toLowerCase()
      .replace('@pawstudy.local', '@studymate.local');

    const res = await login(normalized, targetPass);
    setIsLoading(false);

    if (res.success) {
      if (normalized.includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleQuickLogin = async (presetEmail: string) => {
    const displayEmail = presetEmail.replace('@studymate.local', '@pawstudy.local');
    setEmail(displayEmail);
    setPassword('studymate123');
    await executeLogin(presetEmail, 'studymate123');
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-[#EBF5FD] via-[#F3F9FE] to-[#E3F1FD]">
      {/* -------------------------------------------------------------------- */}
      {/* Background Soft Waves                                                */}
      {/* -------------------------------------------------------------------- */}
      {/* Top Left Wavy Backdrop */}
      <div className="absolute -top-16 -left-16 w-96 h-96 bg-[#D8EDFD]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      {/* Bottom Soft Blue Wave */}
      <div className="absolute -bottom-24 left-0 right-0 h-72 bg-gradient-to-t from-[#CFE7FC]/80 via-[#DFEFFD]/40 to-transparent pointer-events-none -z-10" />
      {/* Bottom Right Wave Arc */}
      <div className="absolute -bottom-16 -right-16 w-[480px] h-[480px] bg-[#D4EBFD]/70 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* -------------------------------------------------------------------- */}
      {/* Decorative Floating Paw Prints around Canvas                         */}
      {/* -------------------------------------------------------------------- */}
      {/* Top-Right Floating Paws */}
      <div className="absolute top-12 right-12 sm:right-24 hidden sm:flex flex-col items-end gap-3 pointer-events-none select-none">
        <PawPrint size={36} className="text-[#38BDF8]/40 rotate-12" />
        <PawPrint size={26} className="text-[#38BDF8]/35 -rotate-12 mr-8" />
        <PawPrint size={20} className="text-[#38BDF8]/30 rotate-45 mr-2" />
      </div>

      {/* Mid-Left Floating Paws */}
      <div className="absolute top-1/2 -translate-y-12 left-8 sm:left-16 hidden sm:flex flex-col items-start gap-4 pointer-events-none select-none">
        <PawPrint size={32} className="text-[#38BDF8]/35 -rotate-15" />
        <PawPrint size={24} className="text-[#38BDF8]/30 rotate-12 ml-6" />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Corner Illustrations (Medical Kit on left, Heartbeat on right)       */}
      {/* -------------------------------------------------------------------- */}
      {/* Bottom-Left Medical Kit & Books */}
      <div className="absolute bottom-4 left-4 sm:left-8 hidden md:block">
        <MedicalKitAndBooksIllustration />
      </div>

      {/* Bottom-Right Heartbeat Pulse & Heart */}
      <div className="absolute bottom-6 right-4 sm:right-8 hidden md:block">
        <HeartbeatIllustration />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Centered White Login Card                                            */}
      {/* -------------------------------------------------------------------- */}
      <div className="max-w-[460px] w-full bg-white rounded-[28px] border border-[#D5E5F7] p-7 sm:p-9 shadow-xl shadow-[#17365D]/6 relative my-auto space-y-5 sm:space-y-6">
        {/* Top Header with Nurse Cat Mascot and PAW STUDY Branding */}
        <div className="text-center pt-1">
          {/* Nurse Cat Mascot with Syringe */}
          <div className="flex justify-center -mb-1">
            <NurseCatMascot />
          </div>

          {/* PAW STUDY Heading with Radiant Sparkles */}
          <h1 className="text-[26px] sm:text-[30px] font-black text-[#17365D] tracking-tight flex items-center justify-center gap-2 select-none">
            <RadiantTicks direction="left" />
            <span className="flex items-center tracking-tight">
              <span>P</span>
              <PawPrint size={24} className="inline-block text-[#17365D] -mt-1 mx-0.5" />
              <span>W&nbsp;STUDY</span>
            </span>
            <RadiantTicks direction="right" />
          </h1>
        </div>

        {/* Error Alert Message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Email Address */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#17365D] mb-1.5">
              <Mail className="w-3.5 h-3.5 text-[#1685E8]" />
              <span>EMAIL ADDRESS</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@pawstudy.local"
              className="w-full px-4 py-2.5 sm:py-3 rounded-2xl border border-[#CBE2FC] text-sm font-semibold text-[#17365D] bg-white placeholder-[#94A3B8] focus:border-[#1685E8] focus:ring-2 focus:ring-[#1685E8]/20 focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#17365D] mb-1.5">
              <Lock className="w-3.5 h-3.5 text-[#1685E8]" />
              <span>PASSWORD</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full px-4 py-2.5 sm:py-3 rounded-2xl border border-[#CBE2FC] text-sm font-semibold text-[#17365D] bg-white placeholder-[#94A3B8] focus:border-[#1685E8] focus:ring-2 focus:ring-[#1685E8]/20 focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Blue Gradient Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1473E6] via-[#1685E8] to-[#0F5BB5] hover:from-[#1162C7] hover:to-[#0E4F9E] text-white font-black text-sm tracking-wide shadow-md shadow-[#1685E8]/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-[1.8px] border-white flex items-center justify-center shrink-0">
                <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
            )}
            <span>Sign In</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 py-0.5 before:h-px before:flex-1 before:bg-[#E2EEFC] after:h-px after:flex-1 after:bg-[#E2EEFC]">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#1685E8]">
            ONE-CLICK AUTHORIZED ACCOUNTS
          </span>
        </div>

        {/* One-Click Authorized Accounts */}
        <div className="space-y-2.5">
          {/* Paul (Admin) */}
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@studymate.local')}
            className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-[#CDE2FE] bg-[#F4F9FD] hover:bg-[#EAF3FB] transition-all text-left group shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-[#BFDBFE]">
                <MaleCatAvatar />
              </div>
              <div>
                <div className="font-black text-sm text-[#17365D]">Paul</div>
                <div className="text-xs font-semibold text-[#64748B]">Admin • Full Access</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1685E8] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Shaina (Student) */}
          <button
            type="button"
            onClick={() => handleQuickLogin('student@studymate.local')}
            className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-[#CDE2FE] bg-[#F4F9FD] hover:bg-[#EAF3FB] transition-all text-left group shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-[#BFDBFE]">
                <FemaleCatAvatar />
              </div>
              <div>
                <div className="font-black text-sm text-[#17365D]">Shaina</div>
                <div className="text-xs font-semibold text-[#64748B]">Student • Student Nurse</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card Footer Note: Row-Level Security & Blue Outline Paw */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[#1685E8] relative">
          <Lock className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="text-[11px] sm:text-xs font-semibold text-[#64748B]">
            Row-Level Security & Role-Based Access Control
          </span>

          {/* Cute Blue Outline Paw at bottom right of card */}
          <div className="absolute right-0 bottom-[-4px]">
            <PawPrint size={24} outline className="text-[#38BDF8]" />
          </div>
        </div>
      </div>
    </div>
  );
}
