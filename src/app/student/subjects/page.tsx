'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, Flashcard, Question } from '@/lib/types';
import { Layers, Clock, ArrowRight, Play } from 'lucide-react';
import { CatMascot } from '@/components/shared/CatMascot';

// Custom Cat Mascot peeking directly over the top border of the Module Card (matching design reference)
function PeekingCardCat() {
  return (
    <div className="absolute -top-9 sm:-top-10 right-8 sm:right-12 flex items-end gap-1 select-none pointer-events-none z-10">
      {/* 2 Blue paw prints stepping towards cat */}
      <div className="flex items-center gap-1 mb-2">
        <CatMascot variant="paw" size={13} className="text-[#3B82C4]/50" />
        <CatMascot variant="paw" size={17} className="text-[#3B82C4]/65 -mb-1" />
      </div>

      {/* Outlined Cat peeking with paws on card edge & 3 amber sparkles */}
      <svg
        width="76"
        height="50"
        viewBox="0 0 84 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* 3 Amber radiant tick marks on top-right */}
        <line x1="68" y1="10" x2="76" y2="5" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="72" y1="18" x2="80" y2="18" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="26" x2="76" y2="30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

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

        {/* Closed happy curved eyes */}
        <path d="M25 32 C25 28, 31 28, 31 32" stroke="#142D4E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M49 32 C49 28, 55 28, 55 32" stroke="#142D4E" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Pink blush */}
        <ellipse cx="23" cy="36" rx="3.5" ry="1.8" fill="#F472B6" opacity="0.6" />
        <ellipse cx="57" cy="36" rx="3.5" ry="1.8" fill="#F472B6" opacity="0.6" />

        {/* Tiny nose & smile mouth */}
        <polygon points="40,35 38.5,33 41.5,33" fill="#142D4E" />
        <path d="M40 35 C39 37.5, 37 37.5, 36 37" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M40 35 C41 37.5, 43 37.5, 44 37" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="12" y1="34" x2="19" y2="35" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="12" y1="38" x2="19" y2="38" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="61" y1="35" x2="68" y2="34" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="61" y1="38" x2="68" y2="38" stroke="#142D4E" strokeWidth="1.4" strokeLinecap="round" />

        {/* Two front paws resting on top border of card */}
        <ellipse cx="28" cy="48" rx="6.5" ry="4.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />
        <line x1="26" y1="47" x2="26" y2="50" stroke="#142D4E" strokeWidth="1.5" />
        <line x1="30" y1="47" x2="30" y2="50" stroke="#142D4E" strokeWidth="1.5" />
        <ellipse cx="52" cy="48" rx="6.5" ry="4.5" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />
        <line x1="50" y1="47" x2="50" y2="50" stroke="#142D4E" strokeWidth="1.5" />
        <line x1="54" y1="47" x2="54" y2="50" stroke="#142D4E" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function StudentSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setSubjects(StudyMateStore.getSubjects());
    setModules(StudyMateStore.getModules());
    setFlashcards(StudyMateStore.getFlashcards());
    setQuestions(StudyMateStore.getQuestions());
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-14 relative min-w-0 w-full overflow-hidden">
      {/* Decorative paw prints in corner of page */}
      <div className="absolute -bottom-6 right-6 pointer-events-none select-none flex flex-col items-end gap-2">
        <CatMascot variant="paw" size={32} className="text-[#3B82C4]/20" />
        <CatMascot variant="paw" size={24} className="text-[#3B82C4]/15 mr-4" />
      </div>

      {/* Page Header with Cat Mascot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DCEEFF]">
        <div className="flex items-center gap-3">
          <CatMascot variant="header-peek" size={40} />
          <h1 className="text-2xl sm:text-3xl font-black text-[#142D4E] tracking-tight">
            My Subjects & Weeks
          </h1>
        </div>
      </div>

      {/* Subject Main Containers */}
      <div className="space-y-8">
        {subjects.map(subject => {
          const subModules = modules.filter(m => m.subject_id === subject.id);

          return (
            <div
              key={subject.id}
              className="bg-white rounded-3xl border border-[#DCEEFF] p-4 sm:p-6 lg:p-8 shadow-xs hover:border-[#BFDBFE] transition-all relative overflow-visible min-w-0 max-w-full"
            >
              {/* Corner paw print decoration on each subject container */}
              <div className="absolute top-5 right-6 pointer-events-none select-none hidden sm:flex items-center gap-1.5 opacity-35">
                <CatMascot variant="paw" size={14} className="text-[#3B82C4]" />
                <CatMascot variant="paw" size={18} className="text-[#3B82C4]" />
              </div>

              {/* Subject Section Header matching reference */}
              <div className="space-y-2 pb-6 border-b border-[#F0F6FD]">
                {/* Code Pill: e.g. CMPA - 301 */}
                <div>
                  <span className="inline-block text-xs font-bold text-[#1685E8] bg-[#EAF3FB] px-3 py-1 rounded-full border border-[#BFDBFE]">
                    {subject.code}
                  </span>
                </div>

                {/* Subject Title & All Subjects Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-[#142D4E] tracking-tight">
                    {subject.title}
                  </h2>
                  <Link
                    href={`/student/exams?subjectId=${subject.id}`}
                    className="text-xs sm:text-sm font-bold text-[#1685E8] hover:text-[#0F4C81] flex items-center gap-1.5 transition-colors shrink-0 group self-start sm:self-auto"
                    title="View weekly exams for this subject"
                  >
                    <span>All Subjects</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                  </Link>
                </div>

                {/* Subject Description */}
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-3xl">
                  {subject.description}
                </p>
              </div>

              {/* Module/Examination Cards Grid with Peeking Cat Decorations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-9">
                {subModules.map(mod => {
                  const modCards = flashcards.filter(f => f.module_id === mod.id);

                  return (
                    <div key={mod.id} className="relative pt-2">
                      {/* Cute Cat peeking over the top border of the card with paw prints and amber sparkles */}
                      <PeekingCardCat />

                      {/* Week / Module Examination Card */}
                      <div className="bg-white rounded-3xl border border-[#DCEEFF] p-5 sm:p-6 shadow-xs hover:border-[#BFDBFE] hover:shadow-md transition-all flex flex-col justify-between space-y-4 h-full">
                        <div className="space-y-3">
                          {/* Card Top Row: Stack icon on left, 60 Qs on right */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-9 h-9 rounded-xl bg-[#EAF3FB] border border-[#BFDBFE]/60 flex items-center justify-center text-[#1685E8] shadow-2xs">
                              <Layers className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            <span className="text-xs font-bold text-[#1685E8] bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]/70">
                              {mod.exam_question_count || 60} Qs
                            </span>
                          </div>

                          {/* Module Title & Description */}
                          <div>
                            <h4 className="font-black text-sm sm:text-base text-[#142D4E] tracking-tight">
                              {mod.title}
                            </h4>
                            <p className="text-xs text-[#64748B] leading-relaxed mt-1 line-clamp-2">
                              {mod.description}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Section: Flashcard & Exam Stats + Buttons */}
                        <div className="space-y-3 pt-2">
                          {/* Stats Row */}
                          <div className="flex items-center justify-between text-xs font-bold text-[#142D4E]">
                            <span className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-[#1685E8]" />
                              <span>{modCards.length || 60} Flashcards</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#1685E8]" />
                              <span>{mod.exam_time_limit_minutes || 60} Min Exam</span>
                            </span>
                          </div>

                            {/* Action Buttons: Cards (Secondary Light Blue) & Exam (Primary Blue) */}
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <Link href={`/student/flashcards?moduleId=${mod.id}`} className="w-full">
                              <button className="w-full py-2.5 px-4 rounded-xl bg-[#EAF3FB] hover:bg-[#D5E8F8] text-[#1685E8] font-black text-xs flex items-center justify-center border border-[#BFDBFE] transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs">
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
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
