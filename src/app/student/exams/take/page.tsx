'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { evaluateAnswer } from '@/lib/scoring';
import { Question, ExamMode, Subject, Module } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  HelpCircle,
  Check,
  X,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge, QuestionTypeBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import confetti from 'canvas-confetti';
import { CatMascot } from '@/components/shared/CatMascot';

interface ConfirmedAnswerState {
  isCorrect: boolean;
  confirmedAnswer: string;
  explanation: string;
  correctAnswer: string;
}

function ExamRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const moduleId = searchParams.get('moduleId');
  const examMode = (searchParams.get('mode') as ExamMode) || 'mixed';

  const [subject, setSubject] = useState<Subject | null>(null);
  const [moduleItem, setModuleItem] = useState<Module | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, ConfirmedAnswerState>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startTimeRef = useRef<number | null>(null);

  // 1. Prepare Question Pool for Weekly Examination
  useEffect(() => {
    const allSubjects = StudyMateStore.getSubjects();
    const allModules = StudyMateStore.getModules();

    const m = allModules.find(mod => mod.id === moduleId);
    if (!m) {
      setErrorMessage('Requested curriculum week was not found.');
      return;
    }
    setModuleItem(m);
    const sub = allSubjects.find(s => s.id === m.subject_id);
    setSubject(sub || null);

    const pool = StudyMateStore.getApprovedQuestionsForExam(m.id, examMode);

    if (pool.length < 60) {
      setErrorMessage(
        `Insufficient approved questions in bank: Found ${pool.length} of 60 required approved questions for "${m.title}".`
      );
      return;
    }

    const randomizedQuestions = [...pool].sort(() => Math.random() - 0.5);
    setExamQuestions(randomizedQuestions);
    startTimeRef.current = Date.now();
  }, [moduleId, examMode]);

  // Final submission logic
  const handleFinalSubmit = useCallback(() => {
    if (isSubmitting || examQuestions.length === 0 || !user || !moduleItem) return;
    setIsSubmitting(true);

    const timeSpent = Math.max(1, Math.round((Date.now() - (startTimeRef.current ?? Date.now())) / 1000));

    const attempt = StudyMateStore.submitExamAttempt({
      studentId: user.id,
      subjectId: subject?.id || '',
      moduleId: moduleItem.id,
      isComprehensive: false,
      examMode,
      questions: examQuestions,
      rawAnswers: answers,
      timeSpentSeconds: timeSpent,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    router.replace(`/student/results/${attempt.id}`);
  }, [answers, examMode, examQuestions, isSubmitting, moduleItem, router, subject?.id, user]);

  const currentQ = examQuestions[currentIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] || '' : '';
  const currentConfirmed = currentQ ? confirmedAnswers[currentQ.id] : undefined;
  const isCurrentConfirmed = Boolean(currentConfirmed);

  // Automatic answer checking for Multiple Choice and True/False
  const handleAutomaticAnswer = (selectedAnswer: string) => {
    if (!currentQ || confirmedAnswers[currentQ.id]) return;
    const answer = selectedAnswer.trim();
    if (!answer) return;

    const evaluation = evaluateAnswer(answer, currentQ);
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: answer,
    }));
    setConfirmedAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        isCorrect: evaluation.isCorrect,
        confirmedAnswer: answer,
        explanation: currentQ.explanation,
        correctAnswer: currentQ.correct_answer,
      },
    }));
  };

  // Typing handler for Identification questions
  const handleTypeIdentification = (text: string) => {
    if (!currentQ || confirmedAnswers[currentQ.id]) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: text,
    }));
  };

  // Submit handler for Identification questions (triggered by Submit Answer button or Enter key)
  const handleSubmitIdentification = () => {
    if (!currentQ || confirmedAnswers[currentQ.id]) return;
    const answer = (answers[currentQ.id] || '').trim();
    if (!answer) return;

    const evaluation = evaluateAnswer(answer, currentQ);
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: answer,
    }));
    setConfirmedAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        isCorrect: evaluation.isCorrect,
        confirmedAnswer: answer,
        explanation: currentQ.explanation,
        correctAnswer: currentQ.correct_answer,
      },
    }));
  };

  const confirmedCount = Object.keys(confirmedAnswers).length;
  const totalQuestions = examQuestions.length;

  if (errorMessage) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-rose-200 space-y-4 shadow-sm text-center my-auto">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-[#142D4E]">Examination Notice</h2>
        <p className="text-xs text-[#64748B] leading-relaxed">{errorMessage}</p>
        <div className="pt-2">
          <Button variant="primary" onClick={() => router.push('/student/exams')}>
            Return to Examination Portal
          </Button>
        </div>
      </div>
    );
  }

  if (examQuestions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-xs text-[#64748B]">
        Preparing examination session...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)] pb-12 relative min-w-0 w-full overflow-hidden">
      {/* Sticky Top Bar: Exam Title, Progress, Submit */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DCEEFF] p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF3FB] text-[#1685E8] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
              Week {moduleItem?.module_number || 1}
            </span>
            <span className="text-xs font-bold text-[#142D4E] capitalize">
              {examMode.replace('_', ' ')}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-black text-[#142D4E] truncate">
            {moduleItem?.title || 'Weekly Examination'}
          </h2>
        </div>

        {/* Right: Answered counter & Submit Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right text-xs">
            <div className="font-black text-[#142D4E]">
              {confirmedCount} / {totalQuestions}
            </div>
            <div className="text-[10px] text-[#64748B]">Answered</div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="gap-1.5 font-bold text-xs py-2 bg-[#1685E8] hover:bg-[#126ec2] transition-all duration-150 active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
          </Button>
        </div>
      </div>

      {/* Progress Bar across the exam */}
      <div className="w-full bg-[#EAF3FB] rounded-full h-2 overflow-hidden shadow-2xs">
        <div
          className="bg-[#1685E8] h-2 rounded-full transition-all duration-300"
          style={{ width: `${(confirmedCount / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Main Spacious Question Workspace (Question Palette completely removed) */}
      <div className="bg-white rounded-3xl border border-[#DCEEFF] p-6 sm:p-10 shadow-xs flex flex-col justify-between space-y-6 flex-1">
        <div className="space-y-6">
          {/* Question Header & Counter */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#F0F6FD] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-[#1685E8] bg-[#EAF3FB] px-3.5 py-1.5 rounded-xl border border-[#BFDBFE]">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <QuestionTypeBadge type={currentQ.question_type} />
            </div>

            <span className="text-xs font-semibold text-[#64748B]">
              {isCurrentConfirmed ? (
                currentConfirmed?.isCorrect ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 font-bold text-[11px]">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect!
                  </span>
                )
              ) : currentQ.question_type === 'identification' ? (
                <span className="text-[#64748B] text-xs">Type your answer & submit</span>
              ) : (
                <span className="text-[#3B82C4] font-medium text-xs">Select an answer</span>
              )}
            </span>
          </div>

          {/* Question Stem */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-[#142D4E] leading-relaxed">
              {currentQ.question_text}
            </h3>
          </div>

          {/* Answering Component */}
          <div className="space-y-4 pt-2">
            {/* 1. Multiple Choice */}
            {currentQ.question_type === 'multiple_choice' && currentQ.choices && (
              <div className="space-y-3">
                {currentQ.choices.map((choice, cIdx) => {
                  const isSelected = currentAnswer === choice;
                  const isCorrectChoice = choice.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();

                  // Feedback border & background classes
                  let choiceClass = 'bg-white border-[#DCEEFF] hover:border-[#BFDBFE] hover:bg-[#F8FAFD]';

                  if (isCurrentConfirmed) {
                    if (isSelected && currentConfirmed?.isCorrect) {
                      choiceClass = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30';
                    } else if (isSelected && !currentConfirmed?.isCorrect) {
                      choiceClass = 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/30';
                    } else if (!isSelected && isCorrectChoice) {
                      choiceClass = 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500/50';
                    } else {
                      choiceClass = 'bg-white border-[#DCEEFF] opacity-60';
                    }
                  } else if (isSelected) {
                    choiceClass = 'bg-[#EAF3FB] border-[#1685E8] ring-2 ring-[#1685E8]/20 shadow-xs';
                  }

                  return (
                    <div
                      key={cIdx}
                      onClick={() => !isCurrentConfirmed && handleAutomaticAnswer(choice)}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3.5 ${
                        isCurrentConfirmed ? 'cursor-default' : 'cursor-pointer'
                      } ${choiceClass}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCurrentConfirmed
                              ? isSelected && currentConfirmed?.isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : isSelected && !currentConfirmed?.isCorrect
                                ? 'bg-rose-600 text-white border-rose-600'
                                : isCorrectChoice
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'border-[#CBD5E1] text-[#64748B] bg-white'
                              : isSelected
                              ? 'bg-[#1685E8] text-white border-[#1685E8]'
                              : 'border-[#CBD5E1] text-[#64748B] bg-white'
                          }`}
                        >
                          {String.fromCharCode(65 + cIdx)}
                        </div>
                        <span
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isSelected
                              ? 'text-[#142D4E] font-black'
                              : isCurrentConfirmed && isCorrectChoice
                              ? 'text-emerald-950 font-bold'
                              : 'text-[#142D4E] font-medium'
                          }`}
                        >
                          {choice}
                        </span>
                      </div>

                      {/* Right feedback icon for this choice */}
                      {isCurrentConfirmed && (
                        <div className="shrink-0 pl-2">
                          {isSelected && currentConfirmed?.isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          )}
                          {isSelected && !currentConfirmed?.isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                          {!isSelected && isCorrectChoice && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                              Correct Choice
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. Identification */}
            {currentQ.question_type === 'identification' && (
              <div className="space-y-4 max-w-lg mx-auto w-full text-center py-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#142D4E] text-center">
                  Type Your Answer Below:
                </label>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    autoFocus={!isCurrentConfirmed}
                    disabled={isCurrentConfirmed}
                    placeholder="Type exact terminology or concept here..."
                    value={currentAnswer}
                    onChange={e => handleTypeIdentification(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        if (!isCurrentConfirmed && currentAnswer.trim()) {
                          handleSubmitIdentification();
                        } else if (isCurrentConfirmed && currentIdx < totalQuestions - 1) {
                          setCurrentIdx(prev => prev + 1);
                        }
                      }
                    }}
                    className={`w-full max-w-md mx-auto block px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all shadow-2xs text-center ${
                      isCurrentConfirmed
                        ? currentConfirmed?.isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                          : 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-400/20'
                        : 'border-[#BFDBFE] text-[#142D4E] bg-white focus:ring-2 focus:ring-[#3B82C4] focus:outline-none'
                    }`}
                  />
                  {!isCurrentConfirmed && (
                    <p className="text-[11px] text-[#64748B] text-center">
                      * Type your answer and click <strong>Submit Answer</strong> below or press Enter. Capitalization and extra spaces are normalized.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 3. True or False */}
            {currentQ.question_type === 'true_false' && (
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                {(['True', 'False'] as const).map(option => {
                  const isSelected = currentAnswer.toLowerCase() === option.toLowerCase();
                  const isCorrectOption = currentQ.correct_answer.trim().toLowerCase() === option.toLowerCase();

                  let btnClass = 'bg-white border-[#DCEEFF] text-[#142D4E] hover:border-[#BFDBFE] hover:bg-[#F8FAFD]';

                  if (isCurrentConfirmed) {
                    if (isSelected && currentConfirmed?.isCorrect) {
                      btnClass = 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25';
                    } else if (isSelected && !currentConfirmed?.isCorrect) {
                      btnClass = 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/25';
                    } else if (!isSelected && isCorrectOption) {
                      btnClass = 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/40 font-black';
                    } else {
                      btnClass = 'bg-white border-[#DCEEFF] opacity-40 text-[#64748B]';
                    }
                  } else if (isSelected) {
                    btnClass = 'bg-[#1685E8] text-white border-[#1685E8] shadow-md shadow-[#1685E8]/20';
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isCurrentConfirmed}
                      onClick={() => !isCurrentConfirmed && handleAutomaticAnswer(option)}
                      className={`p-5 rounded-2xl border font-black text-sm flex items-center justify-center gap-2.5 transition-all ${
                        isCurrentConfirmed ? 'cursor-default' : 'cursor-pointer'
                      } ${btnClass}`}
                    >
                      {option === 'True' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Immediate Answer Feedback Banner (Appears immediately after answering) */}
            {isCurrentConfirmed && currentConfirmed && (
              <div
                className={`p-5 rounded-2xl border transition-all space-y-3 mt-4 max-w-2xl mx-auto w-full ${
                  currentConfirmed.isCorrect
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/90 border-rose-300 text-rose-950'
                }`}
              >
                {/* Result Indicator Header */}
                <div className="flex items-center gap-2 font-black text-sm">
                  {currentConfirmed.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-800 font-black">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span className="text-rose-800 font-black">Incorrect!</span>
                    </>
                  )}
                </div>

                {/* Reveal correct answer when student is incorrect */}
                {!currentConfirmed.isCorrect && (
                  <div className="p-3.5 bg-white/95 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1">
                    <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px] block">
                      Correct Answer:
                    </span>
                    <span className="font-black text-sm text-[#142D4E] mt-0.5 block">
                      {currentConfirmed.correctAnswer}
                    </span>
                  </div>
                )}

                {/* Short Reviewer Explanation */}
                {currentConfirmed.explanation && (
                  <div className="p-3.5 bg-white/90 rounded-xl border border-[#DCEEFF] text-xs text-[#142D4E] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#1685E8] text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-[#1685E8]" />
                      <span>Explanation:</span>
                    </div>
                    <p className="leading-relaxed text-[#142D4E]/90 pl-5">
                      {currentConfirmed.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Row: Previous on Left, Cat Mascot + Action Button on Right */}
        <div className="pt-4 border-t border-[#F0F6FD] flex items-center justify-between gap-3">
          {/* Left: Previous Question */}
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold border-[#BFDBFE] text-[#142D4E] hover:bg-[#EAF3FB] px-3 sm:px-4 shrink-0 transition-all duration-150 active:scale-[0.98]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Question</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          {/* Right: Cat Mascot immediately beside the Next Question / Submit Answer / Finish Examination button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Outlined Cat mascot and subtle paw prints, aligned vertically with the button */}
            <div className="flex items-center gap-1 sm:gap-1.5 select-none pointer-events-none shrink-0">
              <div className="hidden sm:flex items-center gap-1">
                <CatMascot variant="paw" size={13} className="text-[#3B82C4]/40" />
                <CatMascot variant="paw" size={16} className="text-[#3B82C4]/50 -mb-0.5" />
              </div>
              <CatMascot
                variant="login-hero"
                size={52}
                className="w-10 sm:w-13 h-auto"
              />
            </div>

            {/* Action Button: Submit Answer (Identification before checking) OR Next Question / Finish Examination (after checking) */}
            {!isCurrentConfirmed ? (
              currentQ.question_type === 'identification' ? (
                <Button
                  variant="primary"
                  size="md"
                  disabled={!currentAnswer.trim()}
                  onClick={handleSubmitIdentification}
                  className="gap-2 text-xs font-bold bg-[#1685E8] hover:bg-[#126ec2] px-5 sm:px-6 py-2.5 rounded-xl shadow-xs shrink-0 transition-all duration-150 active:scale-[0.98]"
                >
                  <span>Submit Answer</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <div className="text-xs text-[#64748B] font-medium flex items-center gap-1.5 py-2 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#3B82C4]/60 animate-pulse" />
                  <span className="hidden sm:inline">Select an answer above</span>
                  <span className="sm:hidden">Select answer</span>
                </div>
              )
            ) : currentIdx < totalQuestions - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold bg-[#1685E8] hover:bg-[#126ec2] px-3.5 sm:px-6 py-2.5 rounded-xl shadow-sm shadow-[#1685E8]/20 shrink-0 transition-all duration-150 active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Next Question</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSubmitModalOpen(true)}
                className="gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-400/20 px-3.5 sm:px-6 py-2.5 rounded-xl shrink-0 transition-all duration-150 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Finish Examination</span>
                <span className="sm:hidden">Finish</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Examination?"
        description="Are you ready to conclude and finalize your examination score?"
      >
        <div className="space-y-4">
          <div className="p-4 bg-[#EAF3FB] rounded-2xl border border-[#BFDBFE] space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-[#142D4E]">
              <span>Total Questions:</span>
              <span>{totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between text-[#142D4E]">
              <span>Answered & Confirmed:</span>
              <span className="font-bold text-emerald-700">{confirmedCount}</span>
            </div>
            <div className="flex items-center justify-between text-[#142D4E]">
              <span>Unanswered:</span>
              <span className={`font-bold ${totalQuestions - confirmedCount > 0 ? 'text-rose-600' : 'text-[#1685E8]'}`}>
                {totalQuestions - confirmedCount}
              </span>
            </div>
          </div>

          {totalQuestions - confirmedCount > 0 && (
            <p className="text-xs text-amber-700 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              You still have {totalQuestions - confirmedCount} unanswered questions. Unanswered items will receive 0 points.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>
              Continue Answering
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsSubmitModalOpen(false);
                handleFinalSubmit();
              }}
              isLoading={isSubmitting}
            >
              Confirm & Grade Examination
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ExamRoomPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#64748B]">Initializing exam room...</div>}>
      <ExamRoomContent />
    </Suspense>
  );
}
