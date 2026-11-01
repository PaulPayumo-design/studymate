'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, Question, ExamMode } from '@/lib/types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
} from 'lucide-react';
import { CatMascot } from '@/components/shared/CatMascot';

// Cat 1 – Hero Banner Peeking Cat
function BannerPeekingCat() {
  return (
    <div className="absolute bottom-0 right-4 sm:right-8 flex items-end select-none pointer-events-none z-10">
      {/* Subtle light-blue wave mound at banner bottom */}
      <div className="absolute -bottom-1 -left-6 -right-6 h-4 bg-[#3B82C4]/40 backdrop-blur-xs rounded-t-full border-t border-[#93C5FD]/60 -z-10" />

      {/* 2 White/Light-blue paw prints stepping towards cat */}
      <div className="flex items-center gap-1.5 mr-2 mb-2">
        <CatMascot variant="paw" size={12} className="text-white/80" />
        <CatMascot variant="paw" size={15} className="text-white/95 -mb-1" />
      </div>

      {/* Peeking White Cat */}
      <svg
        width="72"
        height="48"
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

        {/* Head outline */}
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

        {/* Two front paws resting on bottom border */}
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

// Cat 2 – Question Distribution Sleeping Cat
function DistributionSleepingCat() {
  return (
    <div className="relative flex items-end select-none pointer-events-none shrink-0 self-end -mb-1 sm:-mb-2">
      {/* Subtle light-blue wave mound in bottom-right corner */}
      <div className="absolute -bottom-1 -left-7 -right-5 h-4 bg-[#EAF3FB] rounded-t-full border-t border-x border-[#BFDBFE]/80 -z-10" />

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
        <text x="21" y="15" fill="#1565C0" fontSize="11" fontWeight="900" fontFamily="sans-serif">Z</text>
        <text x="30" y="9" fill="#142D4E" fontSize="13" fontWeight="900" fontFamily="sans-serif">z</text>

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

// Cat 3 – Multiple Choice Card Peeking Cat (peeking over upper-right border)
function ModePeekingCat() {
  return (
    <div className="absolute -top-6 right-10 sm:right-14 flex items-end select-none pointer-events-none z-10">
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

        {/* Two front paws resting on top border */}
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

// Cat 4 – Summary Footer Sleeping Cat
function SummarySleepingCat() {
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
        <text x="21" y="15" fill="#1565C0" fontSize="11" fontWeight="900" fontFamily="sans-serif">Z</text>
        <text x="30" y="9" fill="#142D4E" fontSize="13" fontWeight="900" fontFamily="sans-serif">z</text>

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

        {/* Closed peaceful sleeping eyes */}
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

function ComprehensiveExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSubjectId = searchParams.get('subjectId');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<ExamMode>('mixed');

  useEffect(() => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions();
    setSubjects(s);
    setModules(m);
    setQuestions(q);

    if (paramSubjectId && s.some(item => item.id === paramSubjectId)) {
      setSelectedSubjectId(paramSubjectId);
    } else if (s.length > 0) {
      setSelectedSubjectId(s[0].id);
    }
  }, [paramSubjectId]);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const subjectModules = modules.filter(m => m.subject_id === selectedSubjectId);

  // Check question sufficiency
  const nWeeks = subjectModules.length || 1;
  const basePerWeek = Math.floor(60 / nWeeks);
  let rem = 60 - basePerWeek * nWeeks;

  const moduleCheck = subjectModules.map(m => {
    const requiredForThisWeek = basePerWeek + (rem > 0 ? 1 : 0);
    if (rem > 0) rem--;

    let approved = questions.filter(
      q => q.module_id === m.id && q.approval_status === 'approved'
    );
    if (selectedMode !== 'mixed') {
      approved = approved.filter(q => q.question_type === selectedMode);
    }
    return {
      moduleNumber: m.module_number,
      title: m.title,
      approvedCount: approved.length,
      requiredCount: requiredForThisWeek,
      isSufficient: approved.length >= requiredForThisWeek,
    };
  });

  const hasInsufficientQuestions = moduleCheck.some(m => !m.isSufficient);

  const handleStartComprehensive = () => {
    if (hasInsufficientQuestions) return;
    router.push(`/student/exams/take?comprehensive=true&subjectId=${selectedSubjectId}&mode=${selectedMode}`);
  };

  const modes = [
    {
      id: 'mixed' as ExamMode,
      title: 'Mode 4: Mixed Mode (Recommended)',
      recommended: true,
    },
    {
      id: 'multiple_choice' as ExamMode,
      title: 'Mode 1: Multiple Choice Only',
    },
    {
      id: 'identification' as ExamMode,
      title: 'Mode 2: Identification Only',
    },
    {
      id: 'true_false' as ExamMode,
      title: 'Mode 3: True or False Only',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Cat 1 – Navy-to-sky-blue Hero Banner with Peeking Cat */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-r from-[#142D4E] via-[#1565C0] to-[#1E88E5] text-white shadow-xl shadow-[#1565C0]/15 space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-100 border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          Flagship Curriculum Examination
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          60-Item Comprehensive Examination
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl font-medium">
          The ultimate test of subject mastery. Combines 60 items distributed equally across all curriculum weeks without repetition for a comprehensive evaluation.
        </p>

        {/* Cat 1 – Outlined White Cat peeking from bottom right */}
        <BannerPeekingCat />
      </div>

      {/* Select Subject Dropdown */}
      <div className="bg-white rounded-2xl border border-[#D6E9FF] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-[#142D4E]">
            Subject Curriculum
          </label>
        </div>

        <select
          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-[#BFDBFE] bg-white text-[#142D4E] text-xs font-bold focus:ring-2 focus:ring-[#3B82C4] focus:outline-none"
          value={selectedSubjectId}
          onChange={e => setSelectedSubjectId(e.target.value)}
        >
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {s.code} - {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Cat 2 – Curriculum Weeks Distribution with Sleeping Cat */}
      <div className="bg-white rounded-2xl border border-[#D6E9FF] p-6 shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#F0F6FD] pb-3">
          <div>
            <h3 className="text-sm font-black text-[#142D4E]">Question Distribution Across Curriculum Weeks</h3>
          </div>
          <span className="text-xs font-black text-[#1565C0] bg-[#EAF3FB] px-3 py-1 rounded-full border border-[#BFDBFE]">
            Total: 60 Items
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {moduleCheck.map(mc => (
              <div
                key={mc.title}
                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                  mc.isSufficient
                    ? 'bg-[#F8FAFD] border-[#E2EEFC]'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-[#142D4E] block truncate">{mc.title}</span>
                  <span className="text-[11px] text-[#64748B]">
                    Requires {mc.requiredCount} Qs
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 font-bold">
                  {mc.isSufficient ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {mc.approvedCount} Qs
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full text-[10px]">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      {mc.approvedCount}/{mc.requiredCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cat 2 – Sleeping Cat on bottom right of Question Distribution */}
          <DistributionSleepingCat />
        </div>
      </div>

      {/* Cat 3 – Examination Mode Selection Cards with Peeking Cat */}
      <div className="space-y-3 pt-1">
        <h3 className="text-sm font-black text-[#142D4E]">Select Examination Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.map(mode => {
            const isSelected = selectedMode === mode.id;
            const isMultipleChoice = mode.id === 'multiple_choice';

            return (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 overflow-visible ${
                  isSelected
                    ? 'bg-white border-[#1565C0] ring-2 ring-[#1565C0]/20 shadow-sm'
                    : 'bg-white border-[#E2EEFC] hover:border-[#BFDBFE] hover:bg-[#F8FAFD]'
                }`}
              >
                {/* Cat 3 – Peeking over the upper-right border of Mode 1: Multiple Choice Only */}
                {isMultipleChoice && <ModePeekingCat />}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-[#142D4E]">{mode.title}</h4>
                    {mode.recommended && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#EAF3FB] text-[#1565C0] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                        Recommended
                      </span>
                    )}
                  </div>

                  {/* Radio Indicator (Concentric circle when active) */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-[#1565C0] bg-white' : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1565C0]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cat 4 – Start Button & Summary Footer with Sleeping Cat */}
      <div className="bg-white rounded-2xl border border-[#D6E9FF] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-visible">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1565C0] bg-[#EAF3FB] px-2.5 py-0.5 rounded border border-[#BFDBFE]/70">
            EXAMINATION SUMMARY
          </span>
          <p className="text-xs text-[#142D4E] font-bold pt-0.5">
            {currentSubject?.code} Comprehensive Exam • {modes.find(m => m.id === selectedMode)?.title} • 60 Items
          </p>
        </div>

        {/* Right side: Sleeping Cat + Start Button */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          <SummarySleepingCat />

          <button
            onClick={handleStartComprehensive}
            disabled={hasInsufficientQuestions}
            className={`py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
              !hasInsufficientQuestions
                ? 'bg-[#1565C0] hover:bg-[#142D4E] text-white shadow-md shadow-[#1565C0]/25 cursor-pointer'
                : 'bg-[#E2EEFC] text-[#64748B] cursor-not-allowed opacity-80'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start 60-Question Examination</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComprehensiveExamEntrancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Comprehensive Exam...</div>}>
      <ComprehensiveExamContent />
    </Suspense>
  );
}