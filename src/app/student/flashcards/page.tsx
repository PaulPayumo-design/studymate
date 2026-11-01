'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { Flashcard, Module, FlashcardStatus } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CatMascot } from '@/components/shared/CatMascot';

function FlashcardsStudyContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');

  const [modules, setModules] = useState<Module[]>([]);
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
  const [activeDeck, setActiveDeck] = useState<Flashcard[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId || 'all');

  // Study Session State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studentProgress, setStudentProgress] = useState<Record<string, FlashcardStatus>>({});

  const loadData = useCallback(() => {
    const m = StudyMateStore.getModules();
    const f = StudyMateStore.getFlashcards();
    setModules(m);
    setAllFlashcards(f);

    if (user) {
      const prog = StudyMateStore.getFlashcardProgress(user.id);
      setStudentProgress(prog);
    }

    if (initialModuleId && m.some(item => item.id === initialModuleId)) {
      setSelectedModuleId(initialModuleId);
    }
  }, [initialModuleId, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update Active Deck whenever selectedModuleId or flashcards change
  useEffect(() => {
    let filtered = allFlashcards;
    if (selectedModuleId && selectedModuleId !== 'all') {
      filtered = allFlashcards.filter(c => c.module_id === selectedModuleId);
    }

    setActiveDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedModuleId, allFlashcards]);

  const handleNext = useCallback(() => {
    if (currentIndex < activeDeck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, activeDeck.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation: Space to flip, Arrows for Next/Prev
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleShuffle = () => {
    const shuffled = [...activeDeck].sort(() => Math.random() - 0.5);
    setActiveDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleSetStatus = (cardId: string, status: 'known' | 'need_review') => {
    if (!user) return;
    StudyMateStore.setFlashcardProgress(user.id, cardId, status);
    setStudentProgress(prev => ({
      ...prev,
      [cardId]: status,
    }));
    // Auto advance to next card
    if (currentIndex < activeDeck.length - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex(prev => prev + 1);
      }, 250);
    }
  };

  const currentCard = activeDeck[currentIndex];
  const currentStatus = currentCard ? studentProgress[currentCard.id] : undefined;

  // Counters for active deck
  const knownCount = activeDeck.filter(c => studentProgress[c.id] === 'known').length;
  const needReviewCount = activeDeck.filter(c => studentProgress[c.id] === 'need_review').length;
  const progressPercent = activeDeck.length > 0 ? ((currentIndex + 1) / activeDeck.length) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 relative">
      {/* Decorative paw prints in corner */}
      <div className="absolute -bottom-6 right-6 pointer-events-none select-none flex flex-col items-end gap-2">
        <CatMascot variant="paw" size={32} className="text-[#3B82C4]/25" />
        <CatMascot variant="paw" size={24} className="text-[#3B82C4]/20 mr-4" />
      </div>

      {/* Header with Cat Mascot & Shuffle Deck Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <CatMascot variant="header-peek" size={40} />
          <h1 className="text-2xl sm:text-3xl font-black text-[#142D4E] tracking-tight">
            Interactive Flashcard Study Session
          </h1>
        </div>

        <button
          onClick={handleShuffle}
          className="py-2.5 px-4 rounded-xl bg-[#EAF3FB] hover:bg-[#D8EBFB] text-[#1685E8] font-bold text-xs flex items-center gap-2 border border-[#BFDBFE] transition-all duration-150 active:scale-[0.98] self-start sm:self-auto shrink-0 shadow-2xs"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle Deck</span>
        </button>
      </div>

      {/* Week / Module Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {/* All option */}
        <button
          onClick={() => setSelectedModuleId('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            selectedModuleId === 'all'
              ? 'bg-[#1685E8] text-white shadow-sm shadow-[#1685E8]/25'
              : 'bg-white text-[#142D4E] border border-[#DCEEFF] hover:border-[#BFDBFE] hover:bg-[#F4F9FD]'
          }`}
        >
          All ({allFlashcards.length || 180})
        </button>

        {/* 3 Modules: CMPA, NLM, MS */}
        {modules.map(mod => {
          const modCards = allFlashcards.filter(c => c.module_id === mod.id);
          const isSelected = selectedModuleId === mod.id;

          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModuleId(mod.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#1685E8] text-white shadow-sm shadow-[#1685E8]/25'
                  : 'bg-white text-[#142D4E] border border-[#DCEEFF] hover:border-[#BFDBFE] hover:bg-[#F4F9FD]'
              }`}
            >
              {mod.title} ({modCards.length || 60})
            </button>
          );
        })}
      </div>

      {/* Progress & Mastery Sub-bar */}
      <div className="bg-white rounded-2xl border border-[#DCEEFF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#142D4E] shrink-0">
            Card {activeDeck.length > 0 ? currentIndex + 1 : 0} of {activeDeck.length}
          </span>
          {/* Progress bar */}
          <div className="w-48 sm:w-64 h-2.5 bg-[#EAF3FB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1685E8] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {knownCount} Known
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            {needReviewCount} Need Review
          </span>
        </div>
      </div>

      {/* 3D Interactive Flip Card */}
      {activeDeck.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCEEFF] p-16 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-[#93C5FD] mx-auto" />
          <h3 className="text-base font-bold text-[#142D4E]">No flashcards available in this selection</h3>
          <p className="text-xs text-[#64748B]">Please select a different module or choose &quot;All&quot;.</p>
        </div>
      ) : (
        <div className="relative">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[340px] sm:min-h-[380px] bg-white rounded-3xl border border-[#DCEEFF] shadow-lg shadow-[#142D4E]/5 hover:border-[#BFDBFE] hover:shadow-xl transition-all cursor-pointer relative p-8 flex flex-col justify-between select-none"
          >
            {/* Peeking Cat Mascot Resting Paws on Card Top Right */}
            <div className="absolute -top-7 right-8 sm:right-12 z-20 pointer-events-none">
              <CatMascot variant="card-peek" size={82} />
            </div>

            {/* Card Header Pill */}
            <div className="flex items-center justify-between">
              <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#1685E8] bg-[#EAF3FB] px-3.5 py-1.5 rounded-lg border border-[#BFDBFE]/80">
                {isFlipped ? 'ANSWER / EXPLANATION' : 'TERM / QUESTION'}
              </span>
            </div>

            {/* Card Main Content */}
            <div className="my-auto py-6 text-center">
              {!isFlipped ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-2xl sm:text-4xl font-black text-[#142D4E] leading-snug">
                    {currentCard?.front_text}
                  </h2>
                </div>
              ) : (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <p className="text-lg sm:text-2xl font-bold text-[#1685E8] leading-relaxed">
                    {currentCard?.back_text}
                  </p>
                </div>
              )}
            </div>

            {/* Card Bottom Bar */}
            <div className="flex items-center justify-between text-xs text-[#64748B] pt-4 border-t border-[#F0F6FD]">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#1685E8]" />
                Click or press Space to reveal answer
              </span>
              <span className="font-semibold text-[#1685E8]">
                {currentCard?.source_ref || 'Midterm Reviewer'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="py-2.5 px-5 rounded-xl bg-white hover:bg-[#F4F9FD] disabled:opacity-40 disabled:cursor-not-allowed text-[#142D4E] font-bold text-xs flex items-center gap-1.5 border border-[#BFDBFE] transition-all duration-150 active:scale-[0.98] shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Center Mastery Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => currentCard && handleSetStatus(currentCard.id, 'need_review')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all duration-150 active:scale-[0.98] ${
              currentStatus === 'need_review'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white hover:bg-[#FFFBEB] text-[#142D4E] border-[#BFDBFE]'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Need Review</span>
          </button>

          <button
            onClick={() => currentCard && handleSetStatus(currentCard.id, 'known')}
            className={`py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] shadow-sm ${
              currentStatus === 'known'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1685E8] hover:bg-[#126ec2] text-white shadow-[#1685E8]/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Known</span>
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= activeDeck.length - 1}
          className="py-2.5 px-5 rounded-xl bg-white hover:bg-[#F4F9FD] disabled:opacity-40 disabled:cursor-not-allowed text-[#142D4E] font-bold text-xs flex items-center gap-1.5 border border-[#BFDBFE] transition-all duration-150 active:scale-[0.98] shadow-2xs"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Flashcards...</div>}>
      <FlashcardsStudyContent />
    </Suspense>
  );
}
