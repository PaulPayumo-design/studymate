'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { ExamAttempt } from '@/lib/types';
import { Award, Sparkles, FileCheck2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate, formatSeconds } from '@/lib/utils';
import { CatMascot } from '@/components/shared/CatMascot';

// Cat 1 – Header Peeking Cat on soft sky-blue wave
function HeaderResultsCat() {
  return (
    <div className="relative flex items-end select-none pointer-events-none shrink-0 -mb-1 mx-auto sm:mx-0">
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

// Cat 2 – Results Container Sleeping Cat on soft light-blue wave
function ResultsContainerSleepingCat() {
  return (
    <div className="relative flex items-end select-none pointer-events-none shrink-0 -mb-1">
      {/* Subtle light-blue wave mound underneath */}
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
        <text x="21" y="15" fill="#1685E8" fontSize="11" fontWeight="900" fontFamily="sans-serif">Z</text>
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

export default function StudentResultsHistoryPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    if (user) {
      const att = StudyMateStore.getExamAttempts(user.id);
      setAttempts(att);
    }
  }, [user]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 min-w-0 w-full overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <CatMascot variant="header-peek" size={36} />
          <h1 className="text-2xl sm:text-3xl font-black text-[#142D4E] tracking-tight">
            My Examination Results & History
          </h1>
        </div>

        {/* Cat 1 – Header Peeking Cat */}
        <HeaderResultsCat />

        <Link href="/student/exams" className="shrink-0 self-start sm:self-auto">
          <Button
            variant="primary"
            size="sm"
            className="gap-2 text-xs font-bold py-2.5 px-4 rounded-xl bg-[#1685E8] hover:bg-[#126ec2] text-white shadow-xs shadow-[#1685E8]/25 transition-all duration-150 active:scale-[0.98]"
          >
            <FileCheck2 className="w-4 h-4" />
            Take New Examination
          </Button>
        </Link>
      </div>

      {/* History Card with Cat 2 in bottom right */}
      <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 sm:p-6 shadow-xs space-y-4 overflow-hidden relative min-w-0 max-w-full">
        <div className="flex items-center justify-between border-b border-[#F0F6FD] pb-3">
          <h3 className="text-base font-black text-[#142D4E]">
            Completed Attempts ({attempts.length})
          </h3>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#64748B] space-y-3">
            <Award className="w-12 h-12 text-[#93C5FD] mx-auto" />
            <p className="font-bold text-sm text-[#142D4E]">You have not completed any examinations yet.</p>
            <p>Select a weekly exam suite to test your knowledge.</p>
            <Link href="/student/exams">
              <Button variant="primary" size="sm" className="mt-2 text-xs font-bold py-2 px-4 rounded-xl bg-[#1685E8] hover:bg-[#126ec2] transition-all duration-150 active:scale-[0.98]">
                Start Examination
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto w-full min-w-0">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCEEFF] text-[#64748B] uppercase tracking-wider font-bold">
                    <th className="py-3 px-3">Examination</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Percentage</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F6FD]">
                  {attempts.map(att => (
                    <tr key={att.id} className="hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-black text-sm text-[#142D4E]">
                          {att.is_comprehensive ? (
                            <span className="flex items-center gap-1.5 text-[#1685E8]">
                              <Sparkles className="w-3.5 h-3.5" />
                              60-Item Comprehensive Examination
                            </span>
                          ) : (
                            att.module_title?.replace('Module', 'Week') || 'Weekly Mock Exam'
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-[#64748B] font-semibold">
                        {att.subject_title || 'Midterm Assessment'}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-[11px] bg-[#EAF3FB] text-[#1685E8] px-2.5 py-1 rounded-md border border-[#BFDBFE] capitalize">
                          {att.exam_mode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#142D4E]">
                        {att.score} / {att.total_items}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-black px-2.5 py-0.5 rounded-full text-xs ${
                            att.percentage >= 75
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#64748B] font-medium">
                        {formatSeconds(att.time_spent_seconds)}
                      </td>
                      <td className="py-3.5 px-3 text-[#64748B]">
                        {formatDate(att.submitted_at)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href={`/student/results/${att.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-bold gap-1 rounded-lg py-1 px-3 border-[#BFDBFE] text-[#142D4E] hover:bg-[#EAF3FB] transition-all duration-150 active:scale-[0.98]"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#1685E8]" />
                            Review Report
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cat 2 – Sleeping Cat on soft light-blue wave in bottom-right corner */}
            <div className="flex justify-end pt-2">
              <ResultsContainerSleepingCat />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}