'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { ExamAttempt, Question } from '@/lib/types';
import {
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  ArrowLeft,
  Sparkles,
  Info,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, QuestionTypeBadge } from '@/components/ui/Badge';
import { formatDate, formatSeconds } from '@/lib/utils';
import { CatMascot } from '@/components/shared/CatMascot';

function DetailedResultReportContent() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params?.attemptId as string;
  const { user } = useAuth();

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({});

  useEffect(() => {
    if (!attemptId) return;

    const att = StudyMateStore.getExamAttemptById(attemptId);
    if (att) {
      setAttempt(att);
      const allQs = StudyMateStore.getQuestions();
      const map: Record<string, Question> = {};
      allQs.forEach(q => {
        map[q.id] = q;
      });
      setQuestionsMap(map);
    }
  }, [attemptId]);

  if (!attempt) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-xs text-[#64748B]">
        Loading examination report...
      </div>
    );
  }

  // Privacy Protection: Students cannot access another student's private examination results
  if (user && user.role === 'student' && attempt.student_id !== user.id) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-[#142D4E]">Access Denied</h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          You do not have authorization to view another student&apos;s private examination results.
        </p>
        <div className="pt-2">
          <Link href="/student/results">
            <Button variant="primary" size="sm" className="bg-[#1685E8] hover:bg-[#126ec2] transition-all duration-150 active:scale-[0.98]">
              Return to My Results
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPassed = attempt.percentage >= 75;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 relative">
      {/* Decorative paw prints */}
      <div className="absolute -bottom-6 right-6 pointer-events-none select-none flex flex-col items-end gap-2">
        <CatMascot variant="paw" size={32} className="text-[#3B82C4]/25" />
        <CatMascot variant="paw" size={24} className="text-[#3B82C4]/20 mr-4" />
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/student/results">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-[#1685E8] font-bold hover:bg-[#EAF3FB] transition-all duration-150 active:scale-[0.98]">
            <ArrowLeft className="w-4 h-4" />
            Back to All Results
          </Button>
        </Link>

        <Link href={attempt.module_id ? `/student/exams?moduleId=${attempt.module_id}` : '/student/exams'}>
          <Button variant="outline" size="sm" className="gap-2 text-xs font-bold border-[#BFDBFE] text-[#142D4E] hover:bg-[#EAF3FB] transition-all duration-150 active:scale-[0.98]">
            <RotateCcw className="w-3.5 h-3.5 text-[#1685E8]" />
            Take Weekly Examination
          </Button>
        </Link>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-8 rounded-3xl border border-[#BFDBFE] shadow-xl shadow-[#0F4C81]/15 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#0F4C81] via-[#1660A5] to-[#1E74C4] text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full text-blue-100 border border-white/20">
              Examination Complete
            </span>
            <span className="text-xs text-blue-100 font-semibold capitalize">
              {attempt.exam_mode.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {attempt.is_comprehensive ? '60-Item Comprehensive Examination' : attempt.module_title}
          </h1>
          <p className="text-xs text-blue-100/90 font-medium">{attempt.subject_title} • Taken on {formatDate(attempt.submitted_at)}</p>
        </div>

        {/* Big Score Display */}
        <div className="flex items-center gap-6 bg-white/15 backdrop-blur-md p-5 rounded-3xl border border-white/20 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-blue-100 uppercase tracking-wider">Final Score</div>
            <div className="text-4xl sm:text-5xl font-black mt-1">
              {attempt.score} <span className="text-xl text-blue-100 font-normal">/ {attempt.total_items}</span>
            </div>
            <div className="text-xs text-blue-100 font-semibold mt-1">
              Duration: {formatSeconds(attempt.time_spent_seconds)}
            </div>
          </div>

          <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-xl shrink-0 ${
            isPassed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
          }`}>
            <span>{attempt.percentage}%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isPassed ? 'Passed' : 'Needs Review'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Correct Answers</span>
          <div className="text-2xl font-black text-emerald-600">{attempt.correct_count}</div>
          <div className="text-[11px] text-[#64748B]">Earned Points</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Incorrect Answers</span>
          <div className="text-2xl font-black text-rose-600">{attempt.incorrect_count}</div>
          <div className="text-[11px] text-[#64748B]">To Review</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Examination Mode</span>
          <div className="text-sm font-black text-[#142D4E] capitalize pt-1.5">{attempt.exam_mode.replace('_', ' ')}</div>
          <div className="text-[11px] text-[#64748B]">Format</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Time Elapsed</span>
          <div className="text-2xl font-black text-[#142D4E]">{formatSeconds(attempt.time_spent_seconds)}</div>
          <div className="text-[11px] text-[#64748B]">Total Duration</div>
        </div>
      </div>

      {/* Performance by Weekly Breakdown */}
      {attempt.module_breakdown && attempt.module_breakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-6 shadow-xs space-y-4">
          <div className="border-b border-[#F0F6FD] pb-3">
            <h3 className="text-base font-black text-[#142D4E] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1685E8]" />
              Performance by Curriculum Week
            </h3>
            <p className="text-xs text-[#64748B]">Weekly score and accuracy analysis.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {attempt.module_breakdown.map(mb => (
              <div key={mb.module_id} className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#DCEEFF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[#142D4E]">Week {mb.module_number}</span>
                  <span className="text-[11px] font-bold text-[#1685E8]">{mb.score_percentage}%</span>
                </div>
                <p className="text-[11px] text-[#64748B] line-clamp-1">{mb.module_title?.replace('Module', 'Week')}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DCEEFF]">
                  <span className="text-[#64748B]">Correct:</span>
                  <span className="font-bold text-[#142D4E]">{mb.correct_count} / {mb.total_questions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance by Question Type Breakdown */}
      {attempt.type_breakdown && (
        <div className="bg-white rounded-2xl border border-[#DCEEFF] p-6 shadow-xs space-y-4">
          <div className="border-b border-[#F0F6FD] pb-3">
            <h3 className="text-base font-black text-[#142D4E]">Performance by Question Type</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {attempt.type_breakdown.map(tb => (
              <div key={tb.question_type} className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#DCEEFF] space-y-1.5">
                <span className="font-black text-xs text-[#142D4E] capitalize">{tb.question_type.replace('_', ' ')}</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Score: {tb.correct_count} / {tb.total_questions}</span>
                  <span className="font-bold text-[#1685E8]">{tb.score_percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review with Answers & Explanations */}
      <div className="bg-white rounded-2xl border border-[#DCEEFF] p-6 shadow-xs space-y-4">
        <div className="border-b border-[#F0F6FD] pb-3">
          <h3 className="text-base font-black text-[#142D4E]">
            Detailed Question & Answer Review ({attempt.answers.length} Items)
          </h3>
          <p className="text-xs text-[#64748B]">
            Answers and source citations from the PDF reviewer are now revealed for study purposes.
          </p>
        </div>

        <div className="space-y-4">
          {attempt.answers.map((ans, idx) => {
            const originalQuestion = questionsMap[ans.question_id];
            return (
              <div
                key={ans.question_id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  ans.is_correct
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-rose-50/30 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-xs text-[#142D4E]">Q{idx + 1}.</span>
                    {originalQuestion && <QuestionTypeBadge type={originalQuestion.question_type} />}
                    {ans.is_correct ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-[#142D4E]">
                  {originalQuestion?.question_text || 'Question text unavailable'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white rounded-xl border border-[#DCEEFF]">
                    <span className="text-[10px] uppercase font-bold text-[#64748B]">Your Answer:</span>
                    <p className={`font-semibold mt-0.5 ${ans.is_correct ? 'text-emerald-800' : 'text-rose-700 font-bold'}`}>
                      {ans.student_answer || '<No Answer Provided>'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#DCEEFF]">
                    <span className="text-[10px] uppercase font-bold text-emerald-600">Correct Answer:</span>
                    <p className="font-bold text-emerald-950 mt-0.5">
                      {ans.correct_answer_snapshot}
                    </p>
                  </div>
                </div>

                {ans.explanation_snapshot && (
                  <div className="p-3 bg-[#EAF3FB] rounded-xl text-xs text-[#142D4E] border border-[#BFDBFE]/80 space-y-0.5">
                    <strong className="text-[#142D4E] font-bold">Reviewer Explanation:</strong>{' '}
                    <span>{ans.explanation_snapshot}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DetailedResultReportPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#64748B]">Loading examination report...</div>}>
      <DetailedResultReportContent />
    </Suspense>
  );
}
