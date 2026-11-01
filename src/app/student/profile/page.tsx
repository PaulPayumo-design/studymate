'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { ExamAttempt } from '@/lib/types';
import { Award, Layers, FileCheck2, Calendar, ShieldCheck, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { CatMascot } from '@/components/shared/CatMascot';

// Cat 1 – Header Peeking Cat on soft light-blue wave
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

// Cat 2 – Profile Card Peeking Cat (at bottom-right corner of student info container)
function ProfileCardPeekingCat() {
  return (
    <div className="absolute -bottom-3 sm:-bottom-4 right-4 sm:right-6 flex flex-col items-end select-none pointer-events-none z-10">
      {/* 2 Blue paw prints stepping towards cat */}
      <div className="flex flex-col items-end gap-1 mr-4 mb-0.5">
        <CatMascot variant="paw" size={13} className="text-[#3B82C4]/75 mr-3" />
        <CatMascot variant="paw" size={15} className="text-[#3B82C4]/85" />
      </div>

      <div className="relative">
        {/* Peeking Cat SVG */}
        <svg
          width="60"
          height="42"
          viewBox="0 0 72 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* 3 Yellow radiant tick marks top-right */}
          <line x1="56" y1="12" x2="64" y2="7" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="60" y1="19" x2="68" y2="18" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="58" y1="26" x2="65" y2="28" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />

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

          {/* Closed happy eyes */}
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

          {/* Two front paws resting on bottom border */}
          <ellipse cx="25" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#102D55" strokeWidth="1.8" />
          <line x1="23.5" y1="41" x2="23.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
          <line x1="26.5" y1="41" x2="26.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
          <ellipse cx="43" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#102D55" strokeWidth="1.8" />
          <line x1="41.5" y1="41" x2="41.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
          <line x1="44.5" y1="41" x2="44.5" y2="44" stroke="#102D55" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
  );
}

// Cat 3 – Flashcard Mastery Corner Paws
function FlashcardCornerPaws() {
  return (
    <div className="absolute bottom-1.5 left-2.5 flex items-end select-none pointer-events-none">
      {/* Subtle light-blue wave mound underneath */}
      <div className="absolute -bottom-1 -left-3 w-20 h-3 bg-[#EAF3FB] rounded-tr-full border-t border-r border-[#BFDBFE]/70 -z-10" />

      {/* 2 Blue paw prints */}
      <div className="flex items-center gap-1.5">
        <CatMascot variant="paw" size={13} className="text-[#3B82C4]/75" />
        <CatMascot variant="paw" size={15} className="text-[#3B82C4]/85 -mb-0.5" />
      </div>
    </div>
  );
}

// Cat 4 – Average Score Card Sleeping Cat (with tiny Zzz details)
function ScoreCardSleepingCat() {
  return (
    <div className="absolute -bottom-1 right-2 flex items-end select-none pointer-events-none z-10">
      {/* Subtle light-blue wave mound underneath */}
      <div className="absolute -bottom-1 -left-4 -right-2 h-3.5 bg-[#EAF3FB] rounded-tl-full border-t border-l border-[#BFDBFE]/70 -z-10" />

      {/* Sleeping Cat SVG */}
      <svg
        width="66"
        height="42"
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
  const reviewCount = Object.values(progressMap).filter(status => status === 'need_review').length;
  const avgScore =
    attempts.length > 0
      ? (attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length).toFixed(1)
      : '90.0';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header with Cat Mascot & Peeking Cat on Wave */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <CatMascot variant="header-peek" size={36} />
          <h1 className="text-2xl sm:text-3xl font-black text-[#102D55] tracking-tight">
            Student Profile & Academic Record
          </h1>
        </div>

        {/* Header Peeking Cat */}
        <ProfileHeaderCat />
      </div>

      {/* User Details Card */}
      <div className="relative bg-white rounded-3xl border border-[#D8E9FF] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 overflow-visible">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#102D55] to-[#1769C2] text-white flex items-center justify-center font-black text-4xl shadow-xl shadow-[#1769C2]/20 shrink-0">
          {user?.full_name?.charAt(0) || 'S'}
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-[#102D55]">
              {user?.full_name || 'Shaina'}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-center sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authorized Student
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-[#1769C2]" />
              {user?.email || 'student@studymate.local'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#3B82C4]" />
              Enrolled: {user?.created_at ? formatDate(user.created_at) : 'Jan 12, 2026, 05:30 PM'}
            </span>
          </div>

          <p className="text-xs text-[#64748B] pt-2 border-t border-[#F0F6FD] leading-relaxed max-w-2xl">
            Authorized single-tenant student account. Access to CMPA, NLM, and MS Midterm examination suites and 18 verified study flashcards.
          </p>
        </div>

        {/* Profile Card Peeking Cat at bottom-right corner */}
        <ProfileCardPeekingCat />
      </div>

      {/* Academic Stats Grid (3 Cards in one row on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Flashcard Mastery */}
        <div className="relative bg-white rounded-2xl border border-[#D8E9FF] p-5 text-center space-y-2 shadow-xs overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-[#EAF3FB] text-[#1769C2] border border-[#BFDBFE] flex items-center justify-center mx-auto">
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#64748B]">Flashcard Mastery</span>
          <div className="text-2xl font-black text-[#102D55]">{knownCount} Mastered</div>
          <p className="text-[11px] text-[#64748B] font-medium">{reviewCount} marked for review</p>

          {/* 2 Small blue paw prints at bottom-left corner */}
          <FlashcardCornerPaws />
        </div>

        {/* Examinations Taken (Clean without additional illustrations) */}
        <div className="bg-white rounded-2xl border border-[#D8E9FF] p-5 text-center space-y-2 shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#64748B]">Examinations Taken</span>
          <div className="text-2xl font-black text-[#102D55]">{attempts.length || 1}</div>
          <p className="text-[11px] text-[#64748B] font-medium">Weekly & Comprehensive tests</p>
        </div>

        {/* Average Score */}
        <div className="relative bg-white rounded-2xl border border-[#D8E9FF] p-5 text-center space-y-2 shadow-xs overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <Award className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#64748B]">Average Score</span>
          <div className="text-2xl font-black text-[#102D55]">{avgScore}%</div>
          <p className="text-[11px] text-[#64748B] font-medium">Cumulative accuracy</p>

          {/* Small sleeping cat at bottom-right corner with Zzz details */}
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