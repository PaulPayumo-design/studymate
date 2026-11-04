'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, ExamMode, Question } from '@/lib/types';
import {
  FileText,
  Calendar,
  Sparkles,
  Play,
  ListChecks,
  Edit3,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { CatMascot } from '@/components/shared/CatMascot';

// Cat 1 – Header Cat (peeking beside Examination Portal title with wave, paws, and yellow rays)
function ExamPortalHeaderCat() {
  return (
    <div className="relative flex items-end select-none pointer-events-none -mb-1 ml-1 sm:ml-2 shrink-0">
      {/* Subtle light-blue wave mound underneath */}
      <div className="absolute -bottom-1 -left-5 -right-5 h-3.5 bg-[#EAF3FB] rounded-t-full border-t border-x border-[#BFDBFE]/80 -z-10" />

      {/* 2 Blue paw prints stepping towards cat */}
      <div className="flex items-center gap-1.5 mr-2 mb-1.5">
        <CatMascot variant="paw" size={12} className="text-[#3B82C4]/70" />
        <CatMascot variant="paw" size={15} className="text-[#3B82C4]/85 -mb-1" />
      </div>

      {/* Cat peeking head */}
      <svg
        width="66"
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
        <polygon points="16,22 22,6 30,18" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="18,20 23,9 28,17" fill="#FDA4AF" />

        {/* Right Ear */}
        <polygon points="52,22 46,6 38,18" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="50,20 45,9 40,17" fill="#FDA4AF" />

        {/* Head base */}
        <path
          d="M16 32 C16 18, 52 18, 52 32 C52 42, 16 42, 16 32 Z"
          fill="#FFFFFF"
          stroke="#142D4E"
          strokeWidth="2.2"
        />

        {/* Closed smiling curved eyes ^ ^ */}
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

        {/* Two front paws resting on the bottom */}
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

// Cat 2 – Identification Card Cat (peeking over top-right border with yellow sparks & paws)
function IdentificationModeCat() {
  return (
    <div className="absolute -top-6 right-10 sm:right-16 flex items-end select-none pointer-events-none z-10">
      {/* Subtle light-blue wave mound behind cat */}
      <div className="absolute bottom-1 -left-5 -right-12 h-3.5 bg-[#EAF3FB] rounded-t-full border-t border-x border-[#BFDBFE]/80 -z-10" />

      {/* 3 Yellow radiant sparkles on the top-left */}
      <div className="absolute -top-1.5 -left-4 flex flex-col items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="16" y1="18" x2="8" y2="14" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="18" y1="11" x2="10" y2="5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="21" y1="7" x2="17" y2="1" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Peeking Cat SVG */}
      <svg
        width="58"
        height="40"
        viewBox="0 0 72 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Left Ear */}
        <polygon points="16,22 22,6 30,18" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="18,20 23,9 28,17" fill="#FDA4AF" />

        {/* Right Ear */}
        <polygon points="52,22 46,6 38,18" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="50,20 45,9 40,17" fill="#FDA4AF" />

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

        {/* Two front paws resting on the card top border */}
        <ellipse cx="25" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <line x1="23.5" y1="41" x2="23.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
        <line x1="26.5" y1="41" x2="26.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
        <ellipse cx="43" cy="42" rx="5.5" ry="3.8" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.8" />
        <line x1="41.5" y1="41" x2="41.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
        <line x1="44.5" y1="41" x2="44.5" y2="44" stroke="#142D4E" strokeWidth="1.2" />
      </svg>

      {/* 2 Blue paw prints stepping away to the right */}
      <div className="flex items-center gap-1.5 ml-2 mb-2">
        <CatMascot variant="paw" size={13} className="text-[#3B82C4]/75" />
        <CatMascot variant="paw" size={15} className="text-[#3B82C4]/85 -mb-1" />
      </div>
    </div>
  );
}

// Cat 3 – Examination Summary Sleeping Cat (curled up sleeping with z Z z, sparkles, and paws)
function SleepingExamCat() {
  return (
    <div className="relative flex items-end select-none pointer-events-none shrink-0 -mb-1">
      {/* Subtle light-blue wave mound underneath */}
      <div className="absolute -bottom-1 -left-7 -right-3 h-3.5 bg-[#EAF3FB] rounded-t-full border-t border-x border-[#BFDBFE]/80 -z-10" />

      {/* 2 Blue paw prints stepping towards sleeping cat */}
      <div className="flex items-center gap-1.5 mr-2 mb-1.5">
        <CatMascot variant="paw" size={12} className="text-[#3B82C4]/70" />
        <CatMascot variant="paw" size={15} className="text-[#3B82C4]/85 -mb-1" />
      </div>

      {/* Sleeping Cat SVG */}
      <svg
        width="76"
        height="48"
        viewBox="0 0 92 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Floating 'z Z z' in blue */}
        <text x="14" y="22" fill="#3B82C4" fontSize="9" fontWeight="900" fontFamily="sans-serif">z</text>
        <text x="21" y="15" fill="#1685E8" fontSize="11" fontWeight="900" fontFamily="sans-serif">Z</text>
        <text x="30" y="9" fill="#142D4E" fontSize="13" fontWeight="900" fontFamily="sans-serif">z</text>

        {/* 3 Yellow radiant tick marks above rear */}
        <line x1="72" y1="16" x2="77" y2="9" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="78" y1="21" x2="85" y2="18" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="79" y1="28" x2="86" y2="30" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />

        {/* Cat Tail curled around the body */}
        <path
          d="M68 46 C78 44, 84 36, 82 28 C80 23, 74 24, 75 29 C76 34, 72 40, 62 44"
          stroke="#142D4E"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="#FFFFFF"
        />

        {/* Curled Sleeping Cat Body */}
        <ellipse cx="50" cy="40" rx="24" ry="13" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />

        {/* Left Ear */}
        <polygon points="26,30 29,17 37,26" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="28,29 30,20 35,26" fill="#FDA4AF" />

        {/* Right Ear */}
        <polygon points="43,29 48,17 41,25" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="43,28 46,20 42,25" fill="#FDA4AF" />

        {/* Sleeping Head resting on paws */}
        <ellipse cx="36" cy="35" rx="14" ry="11" fill="#FFFFFF" stroke="#142D4E" strokeWidth="2.2" />

        {/* Closed peaceful sleeping eyes (downward curves) */}
        <path d="M29 35 C29 38, 33 38, 33 35" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M38 35 C38 38, 42 38, 42 35" stroke="#142D4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Pink blush */}
        <ellipse cx="27" cy="37" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />
        <ellipse cx="44" cy="37" rx="2.5" ry="1.4" fill="#F472B6" opacity="0.6" />

        {/* Tiny nose */}
        <polygon points="36,37.5 35,36 37,36" fill="#142D4E" />

        {/* Whiskers */}
        <line x1="20" y1="37" x2="25" y2="37.5" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="20" y1="40" x2="25" y2="39.5" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="46" y1="37.5" x2="51" y2="37" stroke="#142D4E" strokeWidth="1.2" strokeLinecap="round" />

        {/* Front paws tucked under chin */}
        <ellipse cx="33" cy="46" rx="5" ry="3.2" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.6" />
        <ellipse cx="41" cy="46" rx="5" ry="3.2" fill="#FFFFFF" stroke="#142D4E" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

interface ExamModeOption {
  id: ExamMode;
  name: string;
  questionCount: number;
  icon: React.ElementType;
}

const EXAMINATION_MODES: ExamModeOption[] = [
  {
    id: 'multiple_choice',
    name: 'Multiple Choice Only',
    questionCount: 200,
    icon: ListChecks,
  },
  {
    id: 'identification',
    name: 'Identification Only',
    questionCount: 200,
    icon: Edit3,
  },
  {
    id: 'true_false',
    name: 'True or False Only',
    questionCount: 200,
    icon: CheckCircle2,
  },
  {
    id: 'mixed',
    name: 'Mixed Examination',
    questionCount: 200,
    icon: Sparkles,
  },
];

function ExamsEntranceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<ExamMode | null>('multiple_choice');

  // Load subjects, modules, questions
  useEffect(() => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions();
    setSubjects(s);
    setModules(m);
    setQuestions(q);

    if (initialModuleId) {
      const targetMod = m.find(mod => mod.id === initialModuleId);
      if (targetMod) {
        setSelectedSubjectId(targetMod.subject_id);
        setSelectedModuleId(targetMod.id);
      }
    } else if (m.length > 0) {
      // Default select the first module so student has an intuitive start
      setSelectedModuleId(m[0].id);
    }
  }, [initialModuleId]);

  // Filter modules by subject
  const filteredModules = useMemo(() => {
    if (selectedSubjectId === 'all') {
      return modules;
    }
    return modules.filter(m => m.subject_id === selectedSubjectId);
  }, [modules, selectedSubjectId]);

  // Selected entities
  const activeModule = useMemo(() => {
    return modules.find(m => m.id === selectedModuleId);
  }, [modules, selectedModuleId]);

  const activeSubject = useMemo(() => {
    if (!activeModule) return null;
    return subjects.find(s => s.id === activeModule.subject_id);
  }, [subjects, activeModule]);

  const handleStartExam = () => {
    if (!selectedModuleId || !selectedMode) return;
    router.push(`/student/exams/take?moduleId=${selectedModuleId}&mode=${selectedMode}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF3FB] border border-[#BFDBFE] text-[#1685E8] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex items-end gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#142D4E] tracking-tight">
              Examination Portal
            </h1>
            <ExamPortalHeaderCat />
          </div>
        </div>
      </div>

      {/* Step 1: Choose Target Week */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#1685E8] text-white flex items-center justify-center text-xs font-black shrink-0">
              1
            </div>
            <h2 className="text-base font-black text-[#142D4E]">Choose Target Week</h2>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSubjectId('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedSubjectId === 'all'
                  ? 'bg-[#1685E8] text-white shadow-xs'
                  : 'bg-white text-[#142D4E] border border-[#DCEEFF] hover:border-[#BFDBFE] hover:bg-[#F4F9FD]'
              }`}
            >
              All Subjects
            </button>
            {subjects.map(s => {
              const isSelected = selectedSubjectId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubjectId(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#1685E8] text-white shadow-xs'
                      : 'bg-white text-[#142D4E] border border-[#DCEEFF] hover:border-[#BFDBFE] hover:bg-[#F4F9FD]'
                  }`}
                >
                  {s.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Week Selection Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredModules.map(mod => {
            const isSelected = selectedModuleId === mod.id;
            const sub = subjects.find(s => s.id === mod.subject_id);

            return (
              <div
                key={mod.id}
                onClick={() => setSelectedModuleId(mod.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-[#1685E8] ring-2 ring-[#1685E8]/20 shadow-sm'
                    : 'bg-white border-[#DCEEFF] hover:border-[#BFDBFE] hover:bg-[#F8FAFD]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-[#1685E8] text-white border-[#1685E8]'
                        : 'bg-[#EAF3FB] text-[#1685E8] border-[#BFDBFE]/80'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="font-black text-xs text-[#142D4E] truncate">{mod.title}</div>
                    <div className="text-[11px] font-semibold text-[#64748B] truncate">{sub?.code || 'MIDTERMS'}</div>
                  </div>
                </div>

                {/* Radio Circle Indicator (Concentric circle when active) */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-[#1685E8] bg-white' : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1685E8]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Examination Mode */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#1685E8] text-white flex items-center justify-center text-xs font-black shrink-0">
            2
          </div>
          <h2 className="text-base font-black text-[#142D4E]">Select Examination Mode</h2>
        </div>

        {/* 4 Mode Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXAMINATION_MODES.map(mode => {
            const isSelected = selectedMode === mode.id;
            const Icon = mode.icon;
            const isIdentification = mode.id === 'identification';

            return (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 overflow-visible ${
                  isSelected
                    ? 'bg-white border-[#1685E8] ring-2 ring-[#1685E8]/20 shadow-sm'
                    : 'bg-white border-[#DCEEFF] hover:border-[#BFDBFE] hover:bg-[#F8FAFD]'
                }`}
              >
                {/* Cat 2 – Peeking over the upper-right border of the Identification Only card */}
                {isIdentification && <IdentificationModeCat />}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#1685E8] text-white border-[#1685E8]'
                          : 'bg-[#EAF3FB] text-[#1685E8] border-[#BFDBFE]/80'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-[#142D4E]">{mode.name}</h3>
                    </div>
                  </div>

                  {/* Radio Circle Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-[#1685E8] bg-white' : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1685E8]" />}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1685E8] pl-13 pt-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#3B82C4]" />
                  <span>{mode.questionCount} Questions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Examination Summary Card with Cat 3 (Sleeping Cat on Wave) */}
      <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-visible">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1685E8] bg-[#EAF3FB] px-2.5 py-0.5 rounded border border-[#BFDBFE]/70">
            EXAMINATION SUMMARY
          </span>
          <p className="text-xs text-[#64748B] pt-0.5">
            {!selectedModuleId || !selectedMode ? (
              'Please select a Target Week (Step 1) and an Examination Mode (Step 2) to continue.'
            ) : (
              <span className="font-semibold text-[#142D4E]">
                Target: <span className="text-[#1685E8] font-bold">{activeModule?.title}</span> • Mode:{' '}
                <span className="text-[#1685E8] font-bold">
                  {EXAMINATION_MODES.find(m => m.id === selectedMode)?.name}
                </span>{' '}
                • 200 Questions • Self-Paced (No Time Limit)
              </span>
            )}
          </p>
        </div>

        {/* Right side: Sleeping Cat + Start Button */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          <SleepingExamCat />

          <button
            onClick={handleStartExam}
            disabled={!selectedModuleId || !selectedMode}
            className={`py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shrink-0 ${
              selectedModuleId && selectedMode
                ? 'bg-[#1685E8] hover:bg-[#126ec2] text-white shadow-md shadow-[#1685E8]/25 cursor-pointer'
                : 'bg-[#E2EEFC] text-[#64748B] cursor-not-allowed opacity-80'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start 200-Question Examination</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamsEntrancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Examination Portal...</div>}>
      <ExamsEntranceContent />
    </Suspense>
  );
}