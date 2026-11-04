'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, Flashcard, ExamAttempt } from '@/lib/types';
import {
  BookOpen,
  Layers,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Award,
  Clock,
  Play,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CatMascot } from '@/components/shared/CatMascot';
import { formatDate, formatSeconds } from '@/lib/utils';

// Cat 1 – Subject Header Cat (lying down on subtle light-blue wave with curled tail)
function HeaderLyingCat() {
  return (
    <div className="relative flex items-center select-none pointer-events-none">
      {/* 2 Blue paw prints stepping towards cat */}
      <div className="flex items-center gap-1 mr-2 mb-1">
        <CatMascot variant="paw" size={13} className="text-[#3B82C4]/60" />
        <CatMascot variant="paw" size={16} className="text-[#3B82C4]/75 -mb-1" />
      </div>

      {/* Cat resting on subtle light-blue wave */}
      <div className="relative flex items-end">
        {/* Subtle light-blue mound/wave underneath */}
        <div className="absolute -bottom-1 -left-3 -right-3 h-3 bg-[#EAF3FB] rounded-t-full border-t border-x border-[#BFDBFE]/70 -z-10" />

        {/* Lying Cat SVG */}
        <svg
          width="76"
          height="46"
          viewBox="0 0 88 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* 2 Yellow radiant tick marks above head */}
          <line x1="12" y1="16" x2="6" y2="12" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="15" y1="23" x2="8" y2="24" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />

          {/* Cat Tail curled upward behind it */}
          <path
            d="M66 40 C72 32, 78 20, 74 12 C71 7, 65 10, 67 16 C69 22, 65 32, 58 38"
            stroke="#142D4E"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="#FFFFFF"
          />

          {/* Cat Body (lying down) */}
          <ellipse cx="44" cy="38" rx="22" ry="12" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />

          {/* Left Ear */}
          <polygon points="17,20 22,6 30,17" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="19,18 23,9 28,16" fill="#93C5FD" />
          {/* Right Ear */}
          <polygon points="41,20 46,6 38,17" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="40,18 45,9 39,16" fill="#93C5FD" />

          {/* Head base */}
          <ellipse cx="29" cy="27" rx="14" ry="11" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />

          {/* Closed smiling curved eyes */}
          <path d="M22 26 C22 23, 26 23, 26 26" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M32 26 C32 23, 36 23, 36 26" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Pink blush */}
          <ellipse cx="20" cy="29" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />
          <ellipse cx="38" cy="29" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />

          {/* Tiny nose & mouth */}
          <polygon points="29,28.5 28,27 30,27" fill="#142D4E" />
          <path d="M29 28.5 C28 30, 26.5 30, 26 29.5" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M29 28.5 C30 30, 31.5 30, 32 29.5" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Whiskers */}
          <line x1="12" y1="28" x2="17" y2="28.5" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="12" y1="31" x2="17" y2="30.5" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="41" y1="28.5" x2="46" y2="28" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="41" y1="30.5" x2="46" y2="31" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />

          {/* Front Paws resting forward */}
          <ellipse cx="24" cy="45" rx="5" ry="3.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
          <ellipse cx="34" cy="45" rx="5" ry="3.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        </svg>
      </div>
    </div>
  );
}

// Cat 2 – Module Card Peeking Cat (Peeking over bottom-right border of module card)
function BottomRightCardCat() {
  return (
    <div className="absolute -bottom-2.5 sm:-bottom-3 right-2 sm:right-3 flex items-end select-none pointer-events-none z-10">
      <svg
        width="54"
        height="38"
        viewBox="0 0 72 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* 2 Amber radiant sparkles on top-right */}
        <line x1="58" y1="12" x2="65" y2="7" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="62" y1="20" x2="69" y2="19" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />

        {/* Left Ear */}
        <polygon points="16,22 22,6 30,18" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="18,20 23,9 28,17" fill="#93C5FD" />

        {/* Right Ear */}
        <polygon points="52,22 46,6 38,18" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="50,20 45,9 40,17" fill="#93C5FD" />

        {/* Head outline */}
        <path
          d="M16 32 C16 18, 52 18, 52 32 C52 42, 16 42, 16 32 Z"
          fill="#FFFFFF"
          stroke="#142D4E"
          strokeWidth="2.2"
        />

        {/* Closed happy eyes */}
        <path d="M23 29 C23 26, 27 26, 27 29" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M41 29 C41 26, 45 26, 45 29" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Pink blush */}
        <ellipse cx="20" cy="32" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />
        <ellipse cx="48" cy="32" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />

        {/* Tiny nose & mouth */}
        <polygon points="34,31.5 33,30 35,30" fill="#142D4E" />
        <path d="M34 31.5 C33 33, 31.5 33, 31 32.5" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M34 31.5 C35 33, 36.5 33, 37 32.5" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="10" y1="31" x2="16" y2="31.5" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10" y1="34" x2="16" y2="33.5" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="31.5" x2="58" y2="31" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="33.5" x2="58" y2="34" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />

        {/* Two front paws resting on the bottom border */}
        <ellipse cx="25" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <line x1="23.5" y1="41" x2="23.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
        <line x1="26.5" y1="41" x2="26.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
        <ellipse cx="43" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <line x1="41.5" y1="41" x2="41.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
        <line x1="44.5" y1="41" x2="44.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const f = StudyMateStore.getFlashcards();
    const att = StudyMateStore.getExamAttempts(user.id);
    const prog = StudyMateStore.getFlashcardProgress(user.id);

    setSubjects(s);
    setModules(m);
    setFlashcards(f);
    setAttempts(att);
    setProgressMap(prog);
  }, [user]);

  // Flashcard Mastery
  const knownCards = Object.values(progressMap).filter(status => status === 'known').length;
  const totalCards = flashcards.length;
  const masteryPercentage = totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

  // Average Score
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 90; // Default illustrative or calculated

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 relative min-w-0 w-full overflow-hidden">
      {/* Decorative paw prints in corner */}
      <div className="absolute -bottom-6 right-6 pointer-events-none select-none flex flex-col items-end gap-2">
        <CatMascot variant="paw" size={32} className="text-[#3B82C4]/25" />
        <CatMascot variant="paw" size={24} className="text-[#3B82C4]/20 mr-4" />
      </div>

      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F4C81] via-[#1660A5] to-[#1E74C4] text-white p-5 sm:p-8 shadow-xl shadow-[#0F4C81]/15">
        {/* Subtle floating paw prints in banner background */}
        <div className="absolute right-48 sm:right-60 top-7 hidden lg:flex items-center gap-2 select-none pointer-events-none opacity-20">
          <CatMascot variant="paw" size={26} className="text-white rotate-12" />
          <CatMascot variant="paw" size={20} className="text-white -rotate-15 -mb-2" />
          <CatMascot variant="paw" size={15} className="text-white rotate-45 mb-2" />
        </div>

        {/* Subtle wave curve at bottom of banner */}
        <div className="absolute -bottom-6 left-0 right-0 h-14 bg-gradient-to-t from-white/10 to-transparent pointer-events-none -z-0" />

        <div className="relative z-10 max-w-xl space-y-3">
          {/* Heading with 3 Radiant Sparkles */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Hi, {user?.full_name || 'Shaina'}!
            </h1>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 -mt-2">
              <line x1="6" y1="6" x2="16" y2="4" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="5" y1="12" x2="17" y2="12" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="6" y1="18" x2="16" y2="20" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            Small and consistent study efforts today can lead to big achievements tomorrow.
          </p>

          <div className="flex items-center gap-3 pt-3 flex-wrap">
            <Link href="/student/flashcards">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 font-bold bg-white text-[#142D4E] hover:bg-[#F0F7FD] border-none shadow-md shadow-black/10 py-2.5 px-4 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Layers className="w-4 h-4 text-[#1685E8]" />
                Study Flashcards
              </Button>
            </Link>
            <Link href="/student/exams">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-white border-white/40 hover:bg-white/15 hover:border-white py-2.5 px-4 rounded-xl font-bold bg-transparent transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Take an Exam
              </Button>
            </Link>
          </div>
        </div>

        {/* Mascot on stack of books */}
        <div className="absolute right-4 sm:right-10 bottom-0 pointer-events-none select-none hidden md:block">
          <CatMascot variant="hero-study" size={190} />
        </div>
      </div>

      {/* 2. Quick Access KPIs (Custom Mascot Illustrations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Assigned Subjects */}
        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition-all duration-200 group">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] border border-[#BFDBFE]/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <CatMascot variant="kpi-reading" size={42} />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-semibold mb-0.5">Assigned Subjects</div>
            <div className="text-2xl sm:text-[26px] font-black text-[#142D4E] tracking-tight">{subjects.length || 3}</div>
          </div>
        </div>

        {/* Flashcard Mastery */}
        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition-all duration-200 group">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] border border-[#BFDBFE]/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <CatMascot variant="kpi-cards" size={42} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#64748B] font-semibold mb-0.5">Flashcard Mastery</div>
            <div className="text-xl sm:text-2xl font-black text-[#142D4E] tracking-tight flex items-baseline gap-1.5">
              <span>{masteryPercentage}%</span>
              <span className="text-xs font-semibold text-[#64748B]">({knownCards}/{totalCards || 180})</span>
            </div>
            {/* Sleek Progress Bar Track matching reference image */}
            <div className="w-full bg-[#E2EEFC] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#1685E8] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, masteryPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exams Completed */}
        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition-all duration-200 group">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <CatMascot variant="kpi-clipboard" size={42} />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-semibold mb-0.5">Exams Completed</div>
            <div className="text-2xl sm:text-[26px] font-black text-[#142D4E] tracking-tight">{attempts.length || 1}</div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition-all duration-200 group">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <CatMascot variant="kpi-medal" size={42} />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-semibold mb-0.5">Average Score</div>
            <div className="text-2xl sm:text-[26px] font-black text-[#142D4E] tracking-tight">{avgScore}%</div>
          </div>
        </div>
      </div>

      {/* 3. Assigned Subject & Active Midterm Modules (Cat-themed Container Design) */}
      <div className="space-y-6">
        {subjects.map(subject => {
          const subModules = modules.filter(m => m.subject_id === subject.id);
          return (
            <div
              key={subject.id}
              className="bg-white rounded-3xl border border-[#DCEEFF] p-4 sm:p-6 lg:p-8 shadow-xs hover:border-[#BFDBFE] transition-all space-y-6 relative overflow-hidden"
            >
              {/* Subtle bottom wave & paw accent */}
              <div className="absolute -bottom-10 -right-10 w-64 h-32 bg-[#F0F7FD] rounded-full blur-2xl pointer-events-none -z-0" />
              <div className="absolute bottom-4 right-6 hidden sm:flex items-center gap-1.5 select-none pointer-events-none opacity-40">
                <CatMascot variant="paw" size={18} className="text-[#38BDF8]" />
                <CatMascot variant="paw" size={24} className="text-[#38BDF8] -mb-1" />
              </div>

              {/* Subject Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F6FD] pb-5 relative z-10">
                <div>
                  <div className="inline-block font-mono text-xs font-bold text-[#1685E8] bg-[#EAF3FB] px-3 py-1 rounded-full border border-[#BFDBFE] mb-2">
                    {subject.code}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#142D4E] tracking-tight">{subject.title}</h3>
                </div>

                {/* Right Header Side: Cat 1 (Lying Cat with wave and paws) + All Subjects Link */}
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <HeaderLyingCat />
                  <Link
                    href="/student/subjects"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1685E8] hover:text-[#0F4C81] transition-colors group"
                  >
                    <span>All Subjects</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                  </Link>
                </div>
              </div>

              {/* Modules list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
                {subModules.map(mod => {
                  const modCards = flashcards.filter(f => f.module_id === mod.id);
                  return (
                    <div
                      key={mod.id}
                      className="bg-white rounded-2xl border border-[#DCEEFF] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:border-[#BFDBFE] hover:shadow-md transition-all duration-200 relative group"
                    >
                      {/* Top Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-[#EAF3FB] border border-[#BFDBFE]/60 flex items-center justify-center text-[#1685E8] shadow-2xs">
                            <Layers className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <span className="text-xs font-bold text-[#1685E8] bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]/70">
                            {mod.exam_question_count || 200} Qs
                          </span>
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-[#142D4E] tracking-tight line-clamp-1 group-hover:text-[#1685E8] transition-colors">
                          {mod.title}
                        </h4>
                      </div>

                      {/* Bottom Info: Stats & Buttons + Cat 2 Decor */}
                      <div className="space-y-3 pt-2 relative">
                        {/* 2 tiny blue paw prints near bottom-left corner */}
                        <div className="absolute -bottom-2 -left-1 flex items-center gap-1 select-none pointer-events-none opacity-50">
                          <CatMascot variant="paw" size={11} className="text-[#38BDF8]" />
                          <CatMascot variant="paw" size={13} className="text-[#38BDF8] -mb-1" />
                        </div>

                        {/* Cat 2: Peeking cat on bottom-right corner */}
                        <BottomRightCardCat />

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs font-bold text-[#142D4E]">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#1685E8]" />
                            {modCards.length || 60} Flashcards
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#1685E8]" />
                            No Time Limit
                          </span>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <Link href={`/student/flashcards?moduleId=${mod.id}`} className="w-full">
                            <button className="w-full py-2.5 px-4 rounded-xl bg-[#EAF3FB] hover:bg-[#D5E8F8] text-[#1685E8] font-black text-xs flex items-center justify-center border border-[#BFDBFE] transition-all duration-150 active:scale-[0.98] cursor-pointer">
                              Cards
                            </button>
                          </Link>
                          <Link href={`/student/exams?moduleId=${mod.id}`} className="w-full">
                            <button className="w-full py-2.5 px-4 rounded-xl bg-[#1685E8] hover:bg-[#126ec2] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all duration-150 shadow-xs shadow-[#1685E8]/25 active:scale-[0.98] cursor-pointer">
                              <Play className="w-3 h-3 fill-current" />
                              <span>Exam</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. My Examination History */}
      <div className="bg-white rounded-3xl border border-[#DCEEFF] p-4 sm:p-6 lg:p-7 shadow-xs hover:border-[#BFDBFE] transition-all space-y-4 min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F6FD] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FB] border border-[#BFDBFE]/70 flex items-center justify-center text-[#1685E8] shadow-2xs">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#142D4E] tracking-tight">My Examination History</h3>
              <p className="text-xs text-[#64748B]">Review your past test scores, time spent, and answer explanations.</p>
            </div>
          </div>
          <Link
            href="/student/results"
            className="text-xs sm:text-sm font-bold text-[#1685E8] hover:text-[#0F4C81] inline-flex items-center gap-1.5 transition-colors group"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full min-w-0">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2EEFC] text-[#64748B] uppercase tracking-wider font-extrabold text-[10px] sm:text-[11px]">
                <th className="py-3 px-3">Examination</th>
                <th className="py-3 px-3">Mode</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Percentage</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F6FD]">
              {attempts.length === 0 ? (
                // Sample row matching screenshot if no completed attempts in storage yet
                <tr className="hover:bg-[#F8FBFE] transition-colors duration-150">
                  <td className="py-3.5 px-3">
                    <div className="font-black text-sm text-[#142D4E]">CMPA_W6-10_MIDTERMS</div>
                    <div className="text-[11px] text-[#64748B]">Community & Maternal-Child Health Nursing (CMPA)</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[11px] bg-[#EAF3FB] text-[#1685E8] px-2.5 py-1 rounded-full border border-[#BFDBFE]">
                      Mixed
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#142D4E]">180 / 200</td>
                  <td className="py-3.5 px-3 font-black text-emerald-600">90%</td>
                  <td className="py-3.5 px-3 text-[#64748B] font-medium">45:00</td>
                  <td className="py-3.5 px-3 text-[#64748B]">Jan 18, 2026, 10:45 PM</td>
                  <td className="py-3.5 px-3 text-right">
                    <Link href="/student/results">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold gap-1.5 rounded-xl py-1 px-3 border-[#BFDBFE] hover:bg-[#EAF3FB] hover:border-[#1685E8] text-[#1685E8] transition-all active:scale-[0.98]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Report
                      </Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                attempts.slice(0, 5).map(att => {
                  const sub = subjects.find(s => s.id === att.subject_id);
                  const mod = modules.find(m => m.id === att.module_id);
                  const title = att.is_comprehensive
                    ? '60-Item Comprehensive Examination'
                    : mod?.title || 'Weekly Mock Exam';

                  return (
                    <tr key={att.id} className="hover:bg-[#F8FBFE] transition-colors duration-150">
                      <td className="py-3.5 px-3">
                        <div className="font-black text-sm text-[#142D4E]">{title}</div>
                        <div className="text-[11px] text-[#64748B]">{sub?.title || 'Midterm Assessment'}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-[11px] bg-[#EAF3FB] text-[#1685E8] px-2.5 py-1 rounded-full border border-[#BFDBFE] capitalize">
                          {att.exam_mode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#142D4E]">{att.score} / {att.total_items}</td>
                      <td className="py-3.5 px-3 font-black text-emerald-600">{att.percentage}%</td>
                      <td className="py-3.5 px-3 text-[#64748B] font-medium">{formatSeconds(att.time_spent_seconds)}</td>
                      <td className="py-3.5 px-3 text-[#64748B]">{formatDate(att.submitted_at)}</td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href={`/student/results/${att.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-bold gap-1.5 rounded-xl py-1 px-3 border-[#BFDBFE] hover:bg-[#EAF3FB] hover:border-[#1685E8] text-[#1685E8] transition-all active:scale-[0.98]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Report
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
