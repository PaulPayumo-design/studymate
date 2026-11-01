'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { ExamAttempt } from '@/lib/types';
import { Award, Layers, FileCheck2, ShieldCheck } from 'lucide-react';
import { CatMascot } from '@/components/shared/CatMascot';

// Header Peeking Cat on soft light-blue wave
function ProfileHeaderCat() {
  return (
    <div className="relative flex items-end select-none pointer-events-none shrink-0 -mb-1 ml-auto">
      {/* Subtle light-blue wave mound underneath */}
      <div className="absolute -bottom-1 -left-6 -right-6 h-3.5 bg-[#EAF3FB] rounded-t-full border-t border-x border-[#BFDBFE]/80 -z-10" />

      {/* 2 Blue paw prints stepping towards cat */}
      <div className="flex items-center gap-1.5 mr-2 mb-1.5">
        <CatMascot variant="paw" size={12} className="text-[#3B82C4]/70" />
        <CatMascot variant="paw" size={15} className="text-[#3B82C4]/85 -mb-1" />
      </div>

      {/* Peeking White Cat */}
      <svg
        width="68"
        height="44"
        viewBox="0 0 76 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* 3 Yellow radiant tick marks top-right */}
        <line x1="60" y1="12" x2="68" y2="7" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="64" y1="19" x2="72" y2="18" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="62" y1="26" x2="69" y2="28" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />

        {/* Left Ear */}
        <polygon points="16,22 22,6 30,18" fill="#FFFFFF" stroke="#102D55" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="18,20 23,9 28,17" fill="#FDA4AF" />

        {/* Right Ear */}
        <polygon points="52,22 46,6 38,18" fill="#FFFFFF" stroke="#102D55" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="50,20 45,9 40,17" fill="#FDA4AF" />

        {/* Head outline */}
        <path
          d="M16 32 C16 18, 52 18, 52 32 C52 42, 16 42, 16 32 Z"
          fill="#FFFFFF"
          stroke="#102D55"
          strokeWidth="2.2"
        />

        {/* Closed smiling curved eyes ^ ^ */}
        <path d="M23 29 C23 26, 27 26, 27 29" stroke="#102D55" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M41 29 C41 26, 45 26, 45 29" stroke="#102D55" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Pink blush */}
        <ellipse cx="20" cy="32" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />
        <ellipse cx="48" cy="32" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />

        {/* Tiny nose & mouth */}
        <polygon points="34,31.5 33,30 35,30" fill="#102D55" />
        <path d="M34 31.5 C33 33, 31.5 33, 31 32.5" stroke="#102D55" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M34 31.5 C35 33, 36.5 33, 37 32.5" stroke="#102D55" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="10" y1="31" x2="16" y2="31.5" stroke="#102D55" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10" y1="34" x2="16" y2="33.5" stroke="#102D55" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="31.5" x2="58" y2="31" stroke="#102D55" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="33.5" x2="58" y2="34" stroke="#102D55" strokeWidth="1.2" strokeLinecap="round" />

        {/* Two front paws resting on the bottom */}
        <ellipse cx="25" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#102D55" strokeWidth="1.8" />
        <line x1="23.5" y1="41" x2="23.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
        <line x1="26.5" y1="41" x2="26.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
        <ellipse cx="43" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#102D55" strokeWidth="1.8" />
        <line x1="41.5" y1="41" x2="41.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
        <line x1="44.5" y1="41" x2="44.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

// Cat Avatar Inside Profile Card (Soft Pastel Blue Gradient #DCEEFF to #B9DCFF)
function CatAvatar() {
  return (
    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-[#DCEEFF] to-[#B9DCFF] border border-[#B9DCFF] flex items-end justify-center overflow-hidden shadow-xs shrink-0 relative">
      <svg
        width="66"
        height="56"
        viewBox="0 0 76 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="translate-y-1"
      >
        {/* Yellow radiant tick marks top-right */}
        <line x1="58" y1="14" x2="65" y2="9" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="63" y1="21" x2="71" y2="20" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="61" y1="28" x2="68" y2="30" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />

        {/* Left Ear */}
        <polygon points="16,25 22,8 31,21" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" strokeLinejoin="round" />
        <polygon points="18,23 23,11 29,20" fill="#FDA4AF" />

        {/* Right Ear */}
        <polygon points="53,25 47,8 38,21" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" strokeLinejoin="round" />
        <polygon points="51,23 46,11 40,20" fill="#FDA4AF" />

        {/* Head outline */}
        <path
          d="M16 35 C16 19, 53 19, 53 35 C53 48, 16 48, 16 35 Z"
          fill="#FFFFFF"
          stroke="#17365D"
          strokeWidth="2.4"
        />

        {/* Closed smiling curved eyes ^ ^ */}
        <path d="M23 32 C23 29, 27 29, 27 32" stroke="#17365D" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M42 32 C42 29, 46 29, 46 32" stroke="#17365D" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Pink blush */}
        <ellipse cx="20" cy="35" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.6" />
        <ellipse cx="49" cy="35" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.6" />

        {/* Tiny nose & mouth */}
        <polygon points="34.5,34.5 33.5,33 35.5,33" fill="#17365D" />
        <path d="M34.5 34.5 C33.5 36, 32 36, 31.5 35.5" stroke="#17365D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M34.5 34.5 C35.5 36, 37 36, 37.5 35.5" stroke="#17365D" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="9" y1="34" x2="16" y2="34.5" stroke="#17365D" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="9" y1="37" x2="16" y2="36.5" stroke="#17365D" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="53" y1="34.5" x2="60" y2="34" stroke="#17365D" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="53" y1="36.5" x2="60" y2="37" stroke="#17365D" strokeWidth="1.3" strokeLinecap="round" />

        {/* Two front paws resting on the bottom edge */}
        <ellipse cx="25" cy="46" rx="6" ry="4.2" fill="#FFFFFF" stroke="#17365D" strokeWidth="2" />
        <line x1="23" y1="44" x2="23" y2="48" stroke="#17365D" strokeWidth="1.3" />
        <line x1="27" y1="44" x2="27" y2="48" stroke="#17365D" strokeWidth="1.3" />

        <ellipse cx="44" cy="46" rx="6" ry="4.2" fill="#FFFFFF" stroke="#17365D" strokeWidth="2" />
        <line x1="42" y1="44" x2="42" y2="48" stroke="#17365D" strokeWidth="1.3" />
        <line x1="46" y1="44" x2="46" y2="48" stroke="#17365D" strokeWidth="1.3" />
      </svg>
    </div>
  );
}

// Profile Card Peeking Cat (at bottom-right corner with wave and paw prints above)
function ProfileCardPeekingCat() {
  return (
    <div className="absolute -bottom-0.5 right-3 sm:right-6 flex items-end select-none pointer-events-none z-10">
      {/* Subtle light-blue wave mound underneath */}
      <div className="absolute -bottom-0.5 -left-4 -right-5 h-4 bg-[#DCEEFF] rounded-t-full border-t border-x border-[#B9DCFF] -z-10" />

      {/* Peeking Cat with Paw Prints above */}
      <div className="relative flex items-end">
        {/* Cat SVG */}
        <svg
          width="62"
          height="42"
          viewBox="0 0 76 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* 3 Yellow radiant tick marks */}
          <line x1="60" y1="12" x2="68" y2="7" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="64" y1="19" x2="72" y2="18" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="62" y1="26" x2="69" y2="28" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />

          {/* Left Ear */}
          <polygon points="16,22 22,6 30,18" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="18,20 23,9 28,17" fill="#FDA4AF" />

          {/* Right Ear */}
          <polygon points="52,22 46,6 38,18" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="50,20 45,9 40,17" fill="#FDA4AF" />

          {/* Head outline */}
          <path
            d="M16 32 C16 18, 52 18, 52 32 C52 42, 16 42, 16 32 Z"
            fill="#FFFFFF"
            stroke="#17365D"
            strokeWidth="2.2"
          />

          {/* Closed smiling curved eyes */}
          <path d="M23 29 C23 26, 27 26, 27 29" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M41 29 C41 26, 45 26, 45 29" stroke="#17365D" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Pink blush */}
          <ellipse cx="20" cy="32" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />
          <ellipse cx="48" cy="32" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />

          {/* Tiny nose & mouth */}
          <polygon points="34,31.5 33,30 35,30" fill="#17365D" />
          <path d="M34 31.5 C33 33, 31.5 33, 31 32.5" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M34 31.5 C35 33, 36.5 33, 37 32.5" stroke="#17365D" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Whiskers */}
          <line x1="10" y1="31" x2="16" y2="31.5" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="10" y1="34" x2="16" y2="33.5" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="52" y1="31.5" x2="58" y2="31" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="52" y1="33.5" x2="58" y2="34" stroke="#17365D" strokeWidth="1.2" strokeLinecap="round" />

          {/* Two front paws */}
          <ellipse cx="25" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" />
          <line x1="23.5" y1="41" x2="23.5" y2="44" stroke="#17365D" strokeWidth="1.2" />
          <line x1="26.5" y1="41" x2="26.5" y2="44" stroke="#17365D" strokeWidth="1.2" />
          <ellipse cx="43" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#17365D" strokeWidth="1.8" />
          <line x1="41.5" y1="41" x2="41.5" y2="44" stroke="#17365D" strokeWidth="1.2" />
          <line x1="44.5" y1="41" x2="44.5" y2="44" stroke="#17365D" strokeWidth="1.2" />
        </svg>

        {/* Two small blue paw prints placed above the decorative cat */}
        <div className="flex flex-col items-center gap-2 ml-1 mb-6">
          <CatMascot variant="paw" size={14} className="text-[#1769C2] translate-x-1" />
          <CatMascot variant="paw" size={12} className="text-[#1769C2] -translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}

// Flashcard Mastery Corner Paws (Small paw prints on bottom-left)
function FlashcardCornerPaws() {
  return (
    <div className="absolute bottom-3 left-4 flex items-center gap-2 select-none pointer-events-none">
      <CatMascot variant="paw" size={14} className="text-[#1D70B8]" />
      <CatMascot variant="paw" size={17} className="text-[#1D70B8] -mb-1" />
    </div>
  );
}

// Average Score Card Sleeping Cat (with tiny Zzz and yellow accents)
function ScoreCardSleepingCat() {
  return (
    <div className="absolute -bottom-0.5 right-2 sm:right-3 flex items-end select-none pointer-events-none z-10">
      {/* Subtle light-blue wave mound underneath */}
      <div className="absolute -bottom-0.5 -left-4 -right-2 h-4 bg-[#EAF3FB] rounded-t-full border-t border-x border-[#D8E9FF] -z-10" />

      {/* Sleeping Cat SVG */}
      <svg
        width="68"
        height="44"
        viewBox="0 0 92 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Floating 'z Z z' in blue */}
        <text x="14" y="22" fill="#3B82C4" fontSize="9" fontWeight="900" fontFamily="sans-serif">z</text>
        <text x="21" y="15" fill="#1769C2" fontSize="11" fontWeight="900" fontFamily="sans-serif">Z</text>
        <text x="30" y="9" fill="#102D55" fontSize="13" fontWeight="900" fontFamily="sans-serif">z</text>

        {/* 3 Yellow radiant tick marks top-right */}
        <line x1="72" y1="16" x2="77" y2="9" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="78" y1="21" x2="85" y2="18" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="79" y1="28" x2="86" y2="30" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />

        {/* Cat Tail curled around the body */}
        <path
          d="M68 46 C78 44, 84 36, 82 28 C80 23, 74 24, 75 29 C76 34, 72 40, 62 44"
          stroke="#102D55"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="#FFFFFF"
        />

        {/* Curled Sleeping Cat Body */}
        <ellipse cx="50" cy="40" rx="24" ry="13" fill="#FFFFFF" stroke="#102D55" strokeWidth="2.2" />

        {/* Left Ear */}
        <polygon points="26,30 29,17 37,26" fill="#FFFFFF" stroke="#102D55" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="28,29 30,20 35,26" fill="#FDA4AF" />

        {/* Right Ear */}
        <polygon points="43,29 48,17 41,25" fill="#FFFFFF" stroke="#102D55" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="43,28 46,20 42,25" fill="#FDA4AF" />

        {/* Sleeping Head resting on paws */}
        <ellipse cx="36" cy="35" rx="14" ry="11" fill="#FFFFFF" stroke="#102D55" strokeWidth="2.2" />

        {/* Closed peaceful sleeping eyes */}
        <path d="M29 35 C29 38, 33 38, 33 35" stroke="#102D55" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M38 35 C38 38, 42 38, 42 35" stroke="#102D55" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Pink blush */}
        <ellipse cx="27" cy="37" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />
        <ellipse cx="44" cy="37" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />

        {/* Tiny nose */}
        <polygon points="36,37.5 35,36 37,36" fill="#102D55" />

        {/* Whiskers */}
        <line x1="20" y1="37" x2="25" y2="37.5" stroke="#102D55" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="20" y1="40" x2="25" y2="39.5" stroke="#102D55" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="46" y1="37.5" x2="51" y2="37" stroke="#102D55" strokeWidth="1.2" strokeLinecap="round" />

        {/* Front paws tucked under chin */}
        <ellipse cx="33" cy="46" rx="5" ry="3.2" fill="#FFFFFF" stroke="#102D55" strokeWidth="1.6" />
        <ellipse cx="41" cy="46" rx="5" ry="3.2" fill="#FFFFFF" stroke="#102D55" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

function StudentProfileContent() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const att = StudyMateStore.getExamAttempts(user.id);
      const prog = StudyMateStore.getFlashcardProgress(user.id);
      setAttempts(att);
      setProgressMap(prog);
    }
  }, [user]);

  const knownCount = Object.values(progressMap).filter(status => status === 'known').length;
  const avgScore =
    attempts.length > 0
      ? (attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length).toFixed(1)
      : '90.0';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <CatMascot variant="header-peek" size={36} />
          <h1 className="text-2xl sm:text-3xl font-black text-[#142D4E] tracking-tight">
            Student Profile & Academic Record
          </h1>
        </div>

        {/* Header Peeking Cat */}
        <ProfileHeaderCat />
      </div>

      {/* Main Student Profile Card */}
      <div className="relative bg-white rounded-3xl border border-[#DCEEFF] p-5 sm:p-6 shadow-xs hover:border-[#BFDBFE] transition-all overflow-hidden flex items-center justify-between min-h-[96px] sm:min-h-[104px]">
        {/* Left Side: Avatar + Name + Authorized Student Badge */}
        <div className="flex items-center gap-4 sm:gap-5 z-10">
          {/* Cat Avatar */}
          <CatAvatar />

          {/* Student Name & Authorized Student Badge */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] tracking-tight">
              {user?.full_name || 'Shaina'}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#12B76A] bg-[#E8F8F0] px-3 py-1 rounded-full border border-[#A6F4C5] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" />
              Authorized Student
            </span>
          </div>
        </div>

        {/* Right Side: Peeking Cat with Paw Prints on Wave */}
        <ProfileCardPeekingCat />
      </div>

      {/* 3 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: Flashcard Mastery */}
        <div className="relative bg-white rounded-3xl border border-[#DCEEFF] p-6 sm:p-7 shadow-xs hover:border-[#BFDBFE] transition-all overflow-hidden flex flex-col items-center justify-center text-center min-h-[170px]">
          {/* Top Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] border border-[#BFDBFE] flex items-center justify-center mx-auto mb-3 text-[#1685E8]">
            <Layers className="w-6 h-6 stroke-[2]" />
          </div>

          {/* Label */}
          <span className="text-xs font-semibold text-[#64748B] mb-1">
            Flashcard Mastery
          </span>

          {/* Metric */}
          <div className="text-2xl sm:text-3xl font-black text-[#142D4E]">
            {knownCount} Mastered
          </div>

          {/* Small paw prints on bottom-left */}
          <FlashcardCornerPaws />
        </div>

        {/* Card 2: Examinations Taken */}
        <div className="relative bg-white rounded-3xl border border-[#DCEEFF] p-6 sm:p-7 shadow-xs hover:border-[#BFDBFE] transition-all overflow-hidden flex flex-col items-center justify-center text-center min-h-[170px]">
          {/* Top Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#E8F8F0] border border-[#A6F4C5] flex items-center justify-center mx-auto mb-3 text-[#12B76A]">
            <FileCheck2 className="w-6 h-6 stroke-[2]" />
          </div>

          {/* Label */}
          <span className="text-xs font-semibold text-[#64748B] mb-1">
            Examinations Taken
          </span>

          {/* Metric */}
          <div className="text-2xl sm:text-3xl font-black text-[#142D4E]">
            {attempts.length || 1}
          </div>
        </div>

        {/* Card 3: Average Score */}
        <div className="relative bg-white rounded-3xl border border-[#DCEEFF] p-6 sm:p-7 shadow-xs hover:border-[#BFDBFE] transition-all overflow-hidden flex flex-col items-center justify-center text-center min-h-[170px]">
          {/* Top Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex items-center justify-center mx-auto mb-3 text-[#F79009]">
            <Award className="w-6 h-6 stroke-[2]" />
          </div>

          {/* Label */}
          <span className="text-xs font-semibold text-[#64748B] mb-1">
            Average Score
          </span>

          {/* Metric */}
          <div className="text-2xl sm:text-3xl font-black text-[#142D4E]">
            {avgScore}%
          </div>

          {/* Sleeping cat on bottom-right */}
          <ScoreCardSleepingCat />
        </div>
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Profile...</div>}>
      <StudentProfileContent />
    </Suspense>
  );
}
