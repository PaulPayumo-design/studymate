'use client';

import React, { useState, useEffect } from 'react';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, QuestionType, Question, GeneratedQuestionItem, QuestionExamSet } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge, QuestionTypeBadge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  AlertTriangle,
  Info,
  Check,
  Save,
  ArrowRight,
  Sliders,
  HelpCircle,
  Layers,
  KeyRound,
  FileCheck2,
} from 'lucide-react';

interface ReviewItem extends GeneratedQuestionItem {
  reviewStatus: 'pending' | 'approved' | 'rejected';
}

interface TopicQuestionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType?: QuestionType; // If specified, generates only this type
  initialExamSet?: QuestionExamSet;
  initialSubjectId?: string;
  initialModuleId?: string;
  onQuestionsSaved?: () => void;
}

export function TopicQuestionGeneratorModal({
  isOpen,
  onClose,
  targetType,
  initialExamSet,
  initialSubjectId,
  initialModuleId,
  onQuestionsSaved,
}: TopicQuestionGeneratorModalProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  // Selection
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [topicsText, setTopicsText] = useState<string>('');
  const [selectedExamMode, setSelectedExamMode] = useState<QuestionExamSet>(initialExamSet || 'multiple_choice');

  // Counts / Distribution (Defaulting to 60 questions)
  const [mcCount, setMcCount] = useState<number>(60);
  const [idCount, setIdCount] = useState<number>(0);
  const [tfCount, setTfCount] = useState<number>(0);

  // Workflow steps: 'config' | 'review'
  const [step, setStep] = useState<'config' | 'review'>('config');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // Review items
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Load subjects & modules
  useEffect(() => {
    if (!isOpen) return;

    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    setSubjects(s);
    setModules(m);

    const subId = initialSubjectId && s.some(sub => sub.id === initialSubjectId) ? initialSubjectId : s[0]?.id || '';
    setSelectedSubjectId(subId);

    const subMods = m.filter(mod => mod.subject_id === subId);
    const modId =
      initialModuleId && subMods.some(mod => mod.id === initialModuleId) ? initialModuleId : subMods[0]?.id || '';
    setSelectedModuleId(modId);

    // Prefill topics from the selected Week Title
    const activeMod = m.find(mod => mod.id === modId);
    if (activeMod?.topics) {
      setTopicsText(activeMod.topics);
    } else {
      setTopicsText('');
    }

    // Configure 60-item defaults based on initialExamSet or targetType
    const mode = initialExamSet || (targetType === 'identification' ? 'identification' : targetType === 'true_false' ? 'true_false' : targetType === 'multiple_choice' ? 'multiple_choice' : 'multiple_choice');
    setSelectedExamMode(mode);

    if (mode === 'multiple_choice') {
      setMcCount(60);
      setIdCount(0);
      setTfCount(0);
    } else if (mode === 'identification') {
      setMcCount(0);
      setIdCount(60);
      setTfCount(0);
    } else if (mode === 'true_false') {
      setMcCount(0);
      setIdCount(0);
      setTfCount(60);
    } else if (mode === 'mixed') {
      setMcCount(20);
      setIdCount(20);
      setTfCount(20);
    }

    setStep('config');
    setApiError(null);
    setSaveSuccessMsg(null);
  }, [isOpen, initialSubjectId, initialModuleId, targetType, initialExamSet]);

  const handleSubjectChange = (subId: string) => {
    setSelectedSubjectId(subId);
    const subMods = modules.filter(m => m.subject_id === subId);
    const firstModId = subMods[0]?.id || '';
    setSelectedModuleId(firstModId);
    const mod = modules.find(m => m.id === firstModId);
    if (mod?.topics) setTopicsText(mod.topics);
  };

  const handleModuleChange = (modId: string) => {
    setSelectedModuleId(modId);
    const mod = modules.find(m => m.id === modId);
    if (mod?.topics) setTopicsText(mod.topics);
  };

  const handleApplyPreset = (mode: QuestionExamSet) => {
    setSelectedExamMode(mode);
    if (mode === 'multiple_choice') {
      setMcCount(60);
      setIdCount(0);
      setTfCount(0);
    } else if (mode === 'identification') {
      setMcCount(0);
      setIdCount(60);
      setTfCount(0);
    } else if (mode === 'true_false') {
      setMcCount(0);
      setIdCount(0);
      setTfCount(60);
    } else if (mode === 'mixed') {
      setMcCount(20);
      setIdCount(20);
      setTfCount(20);
    }
  };

  const totalSelected = mcCount + idCount + tfCount;
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentModule = modules.find(m => m.id === selectedModuleId);
  const filteredModules = modules.filter(m => m.subject_id === selectedSubjectId);

  // Generate Questions via Server-side AI API
  const handleGenerate = async () => {
    if (!topicsText.trim()) {
      setApiError('Please enter or paste curriculum topics for the selected week.');
      return;
    }
    if (totalSelected <= 0) {
      setApiError('Total question count must be at least 1.');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setIsConfigured(null);

    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectTitle: currentSubject?.title || 'Subject',
          moduleTitle: currentModule?.title || 'Week',
          moduleNumber: currentModule?.module_number,
          topics: topicsText.trim(),
          examSet: selectedExamMode,
          targetType,
          counts: {
            multiple_choice: mcCount,
            identification: idCount,
            true_false: tfCount,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.configured === false) {
          setIsConfigured(false);
        }
        setApiError(data.error || 'Failed to generate questions from AI service.');
        return;
      }

      setIsConfigured(true);
      const generated: ReviewItem[] = (data.questions || []).map((q: GeneratedQuestionItem) => ({
        ...q,
        reviewStatus: 'pending',
      }));

      setReviewItems(generated);
      setStep('review');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setApiError(`Could not connect to generation service: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate an individual question
  const handleRegenerateSingle = async (item: ReviewItem) => {
    setRegeneratingId(item.id);
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectTitle: currentSubject?.title || 'Subject',
          moduleTitle: currentModule?.title || 'Module',
          topics: topicsText.trim() || item.topic,
          singleQuestion: {
            questionType: item.question_type,
            topic: item.topic,
            replaceQuestionText: item.question_text,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        const replacement: ReviewItem = {
          ...data.questions[0],
          reviewStatus: 'pending',
        };
        setReviewItems(prev => prev.map(q => (q.id === item.id ? replacement : q)));
      } else {
        alert(data.error || 'Failed to regenerate question.');
      }
    } catch {
      alert('Error connecting to AI service for regeneration.');
    } finally {
      setRegeneratingId(null);
    }
  };

  // Approve / Reject individual
  const handleToggleApprove = (id: string) => {
    setReviewItems(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            reviewStatus: q.reviewStatus === 'approved' ? 'pending' : 'approved',
          };
        }
        return q;
      })
    );
  };

  const handleToggleReject = (id: string) => {
    setReviewItems(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            reviewStatus: q.reviewStatus === 'rejected' ? 'pending' : 'rejected',
          };
        }
        return q;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setReviewItems(prev => prev.filter(q => q.id !== id));
  };

  const handleApproveAll = () => {
    setReviewItems(prev =>
      prev.map(q => (q.reviewStatus !== 'rejected' ? { ...q, reviewStatus: 'approved' } : q))
    );
  };

  // Save approved questions to Question Bank
  const handleSaveApproved = () => {
    const approved = reviewItems.filter(q => q.reviewStatus === 'approved');
    if (approved.length === 0) {
      alert('Please approve at least one question before saving.');
      return;
    }

    const toSave: Question[] = approved.map(q => ({
      id: `q-ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      subject_id: selectedSubjectId,
      module_id: selectedModuleId,
      question_type: q.question_type,
      exam_set: q.exam_set || selectedExamMode,
      question_text: q.question_text,
      choices: q.choices,
      correct_answer: q.correct_answer,
      alternative_answers: q.alternative_answers,
      explanation: q.explanation,
      topic: q.topic,
      source_pdf_ref: q.source_ref || `Topic: ${q.topic}`,
      approval_status: 'approved',
      created_at: new Date().toISOString(),
    }));

    const result = StudyMateStore.saveQuestionsBulk(toSave, true);

    setSaveSuccessMsg(
      `Successfully saved ${result.addedCount} approved question${
        result.addedCount !== 1 ? 's' : ''
      } to ${currentModule?.title || 'the module'}.${
        result.duplicateCount > 0 ? ` (${result.duplicateCount} duplicates prevented).` : ''
      }`
    );

    if (onQuestionsSaved) onQuestionsSaved();

    setTimeout(() => {
      onClose();
    }, 1600);
  };

  const approvedCount = reviewItems.filter(q => q.reviewStatus === 'approved').length;
  const rejectedCount = reviewItems.filter(q => q.reviewStatus === 'rejected').length;
  const pendingCount = reviewItems.filter(q => q.reviewStatus === 'pending').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        targetType
          ? `AI Generator: ${
              targetType === 'multiple_choice'
                ? 'Multiple Choice'
                : targetType === 'identification'
                ? 'Identification'
                : 'True or False'
            }`
          : 'AI Question Generator from Topics'
      }
      description={
        step === 'config'
          ? 'Enter the syllabus topics and StudyMate AI will generate high-quality examination items, choices, correct answers, and explanations.'
          : 'Review, edit, regenerate, approve or reject generated questions. Only approved questions will be saved.'
      }
      maxWidth="6xl"
    >
      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold">{saveSuccessMsg}</p>
        </div>
      )}

      {/* Unconfigured API Key Alert */}
      {isConfigured === false && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-600 shrink-0" />
            <h4 className="text-sm font-bold">AI API Key Required</h4>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            To generate questions directly from topics, add your API key in{' '}
            <code className="bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold">.env.local</code>{' '}
            in your project folder:
          </p>
          <div className="p-2.5 bg-purple-950 text-purple-100 rounded-xl font-mono text-xs overflow-x-auto">
            <code>GEMINI_API_KEY=your_google_gemini_api_key_here</code>
          </div>
          <p className="text-[11px] text-amber-800">
            You can get a free Google Gemini API key at{' '}
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold hover:text-amber-950"
            >
              aistudio.google.com
            </a>
            . OpenAI keys (<code className="font-mono">OPENAI_API_KEY</code>) are also supported.
          </p>
        </div>
      )}

      {/* General API Error Alert */}
      {apiError && isConfigured !== false && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="font-medium">{apiError}</p>
        </div>
      )}

      {/* STEP 1: CONFIGURE & TOPIC INPUT */}
      {step === 'config' && (
        <div className="space-y-6">
          {/* Subject & Module Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1.5">
                Target Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubjectId}
                onChange={e => handleSubjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-sm font-medium text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} – {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1.5">
                Target Week <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedModuleId}
                onChange={e => handleModuleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-sm font-medium text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {filteredModules.map(m => (
                  <option key={m.id} value={m.id}>
                    Week {m.module_number}: {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topics Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-purple-900">
                Curriculum Topics to Study <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-purple-600 font-medium">
                Assigned topics for this Week Title
              </span>
            </div>
            <Textarea
              rows={5}
              value={topicsText}
              onChange={e => setTopicsText(e.target.value)}
              placeholder={`Enter or paste curriculum topics for this Week Title...`}
              className="font-sans text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* 60 Questions Per Examination Mode Presets */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-purple-600" />
                  Examination Suite Mode (Target: 60 Items)
                </h4>
                <p className="text-xs text-purple-600/80 mt-0.5">
                  Select which examination mode question set to generate for this Week Title.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-purple-900 block">Total Items to Generate</span>
                <span className={`text-xl font-black ${totalSelected === 60 ? 'text-emerald-700' : 'text-purple-700'}`}>
                  {totalSelected} / 60 Items
                </span>
              </div>
            </div>

            {/* Quick 60-Item Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('multiple_choice')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedExamMode === 'multiple_choice' && mcCount === 60
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white border-purple-200 text-purple-950 hover:border-purple-300'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase opacity-80">Mode 1</span>
                <span className="block text-xs font-extrabold mt-0.5">Multiple Choice</span>
                <span className="block text-[11px] mt-1 font-semibold opacity-90">60 Items</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('identification')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedExamMode === 'identification' && idCount === 60
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white border-purple-200 text-purple-950 hover:border-purple-300'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase opacity-80">Mode 2</span>
                <span className="block text-xs font-extrabold mt-0.5">Identification</span>
                <span className="block text-[11px] mt-1 font-semibold opacity-90">60 Items</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('true_false')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedExamMode === 'true_false' && tfCount === 60
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white border-purple-200 text-purple-950 hover:border-purple-300'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase opacity-80">Mode 3</span>
                <span className="block text-xs font-extrabold mt-0.5">True or False</span>
                <span className="block text-[11px] mt-1 font-semibold opacity-90">60 Items</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('mixed')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedExamMode === 'mixed' && mcCount === 20 && idCount === 20 && tfCount === 20
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white border-purple-200 text-purple-950 hover:border-purple-300'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase opacity-80">Mode 4 (Balanced)</span>
                <span className="block text-xs font-extrabold mt-0.5">Mixed Examination</span>
                <span className="block text-[11px] mt-1 font-semibold opacity-90">20 MC • 20 ID • 20 TF</span>
              </button>
            </div>

            {/* Breakdown Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-purple-100">
              <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs">
                <span className="text-xs font-bold text-purple-900 block mb-1">Multiple Choice Items</span>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={mcCount}
                  onChange={e => setMcCount(Math.max(0, parseInt(e.target.value) || 0))}
                />
                <span className="text-[10px] text-purple-500 mt-1 block">4 choices per question</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs">
                <span className="text-xs font-bold text-purple-900 block mb-1">Identification Items</span>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={idCount}
                  onChange={e => setIdCount(Math.max(0, parseInt(e.target.value) || 0))}
                />
                <span className="text-[10px] text-purple-500 mt-1 block">Concepts with synonyms</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs">
                <span className="text-xs font-bold text-purple-900 block mb-1">True or False Items</span>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={tfCount}
                  onChange={e => setTfCount(Math.max(0, parseInt(e.target.value) || 0))}
                />
                <span className="text-[10px] text-purple-500 mt-1 block">Binary statements</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleGenerate}
              isLoading={isLoading}
              disabled={isLoading || totalSelected <= 0 || !topicsText.trim()}
              className="gap-2 px-6"
            >
              <Sparkles className="w-4 h-4" />
              Generate {totalSelected} Questions
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW & APPROVAL DRAWER */}
      {step === 'review' && (
        <div className="space-y-4">
          {/* Top Review Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Review Stage</span>
                <span className="text-xs font-semibold text-purple-900">
                  {currentSubject?.code} – {currentModule?.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="font-bold text-purple-950">{reviewItems.length} Total Generated</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{approvedCount} Approved</span>
                <span>•</span>
                <span className="text-amber-700 font-medium">{pendingCount} Pending</span>
                <span>•</span>
                <span className="text-red-600 font-medium">{rejectedCount} Rejected</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setStep('config')} className="text-xs">
                Back to Topics
              </Button>
              <Button variant="outline" size="sm" onClick={handleApproveAll} className="gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                <Check className="w-3.5 h-3.5" />
                Approve All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveApproved}
                disabled={approvedCount === 0}
                className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-3.5 h-3.5" />
                Save {approvedCount} Approved to Bank
              </Button>
            </div>
          </div>

          {/* List of Generated Questions */}
          <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
            {reviewItems.map((item, idx) => {
              const isDuplicate = StudyMateStore.isDuplicateQuestion(
                selectedSubjectId,
                selectedModuleId,
                item.question_text
              );
              const isRegenerating = regeneratingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all duration-150 ${
                    item.reviewStatus === 'approved'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : item.reviewStatus === 'rejected'
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white border-purple-100 hover:border-purple-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <QuestionTypeBadge type={item.question_type} />
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[11px] font-semibold text-purple-700 border border-purple-100">
                        {item.topic}
                      </span>
                      {isDuplicate && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-[11px] font-bold text-amber-800 border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Similar to existing bank question
                        </span>
                      )}
                    </div>

                    {/* Action Buttons for this item */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Regenerate this question only"
                        onClick={() => handleRegenerateSingle(item)}
                        disabled={isRegenerating}
                        className="w-8 h-8 rounded-lg text-purple-600 hover:bg-purple-100"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit question details"
                        onClick={() => setEditingItem(item)}
                        className="w-8 h-8 rounded-lg text-purple-600 hover:bg-purple-100"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title={item.reviewStatus === 'approved' ? 'Unapprove' : 'Approve question'}
                        onClick={() => handleToggleApprove(item.id)}
                        className={`w-8 h-8 rounded-lg ${
                          item.reviewStatus === 'approved'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title={item.reviewStatus === 'rejected' ? 'Restore' : 'Reject question'}
                        onClick={() => handleToggleReject(item.id)}
                        className={`w-8 h-8 rounded-lg ${
                          item.reviewStatus === 'rejected'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete from list"
                        onClick={() => handleDeleteItem(item.id)}
                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm font-semibold text-purple-950 mt-2.5 leading-snug">
                    {item.question_text}
                  </p>

                  {/* Choices for Multiple Choice */}
                  {item.question_type === 'multiple_choice' && item.choices && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {item.choices.map((choice, cIdx) => {
                        const isCorrect = choice === item.correct_answer;
                        return (
                          <div
                            key={cIdx}
                            className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
                              isCorrect
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-gray-50/70 border-gray-100 text-purple-900'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {String.fromCharCode(65 + cIdx)}
                            </span>
                            <span className="flex-1">{choice}</span>
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True / False display */}
                  {item.question_type === 'true_false' && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-xs text-purple-700 font-medium">Correct Answer:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                          item.correct_answer === 'True'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.correct_answer}
                      </span>
                    </div>
                  )}

                  {/* Identification display */}
                  {item.question_type === 'identification' && (
                    <div className="mt-2.5 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-purple-700 font-medium">Correct Answer:</span>
                        <span className="font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {item.correct_answer}
                        </span>
                      </div>
                      {item.alternative_answers && item.alternative_answers.length > 0 && (
                        <div className="text-[11px] text-purple-600">
                          <span className="font-medium">Accepted alternates: </span>
                          <span>{item.alternative_answers.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="mt-2.5 pt-2 border-t border-purple-50 text-xs text-purple-600/90 leading-relaxed">
                    <span className="font-bold text-purple-900">Explanation: </span>
                    {item.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK INLINE EDIT MODAL */}
      {editingItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title="Edit Question Details"
          description="Adjust question phrasing, choices, or explanation before saving to question bank."
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">Topic</label>
              <Input
                value={editingItem.topic}
                onChange={e => setEditingItem({ ...editingItem, topic: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">Question Text</label>
              <Textarea
                rows={3}
                value={editingItem.question_text}
                onChange={e => setEditingItem({ ...editingItem, question_text: e.target.value })}
              />
            </div>

            {editingItem.question_type === 'multiple_choice' && editingItem.choices && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-purple-900">Choices & Correct Answer</label>
                {editingItem.choices.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <Input
                      value={c}
                      onChange={e => {
                        const newChoices = [...editingItem.choices!];
                        const oldVal = newChoices[i];
                        newChoices[i] = e.target.value;
                        const isCurrentCorrect = editingItem.correct_answer === oldVal;
                        setEditingItem({
                          ...editingItem,
                          choices: newChoices,
                          correct_answer: isCurrentCorrect ? e.target.value : editingItem.correct_answer,
                        });
                      }}
                      className="flex-1"
                    />
                    <input
                      type="radio"
                      name="correctChoice"
                      checked={editingItem.correct_answer === c}
                      onChange={() => setEditingItem({ ...editingItem, correct_answer: c })}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {editingItem.question_type === 'true_false' && (
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Correct Answer</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="tfAnswer"
                      checked={editingItem.correct_answer === 'True'}
                      onChange={() => setEditingItem({ ...editingItem, correct_answer: 'True' })}
                    />
                    True
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="tfAnswer"
                      checked={editingItem.correct_answer === 'False'}
                      onChange={() => setEditingItem({ ...editingItem, correct_answer: 'False' })}
                    />
                    False
                  </label>
                </div>
              </div>
            )}

            {editingItem.question_type === 'identification' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">Canonical Correct Answer</label>
                  <Input
                    value={editingItem.correct_answer}
                    onChange={e => setEditingItem({ ...editingItem, correct_answer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">
                    Accepted Alternate Answers (comma separated)
                  </label>
                  <Input
                    value={(editingItem.alternative_answers || []).join(', ')}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        alternative_answers: e.target.value
                          .split(',')
                          .map(s => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">Explanation</label>
              <Textarea
                rows={2}
                value={editingItem.explanation}
                onChange={e => setEditingItem({ ...editingItem, explanation: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-purple-100">
              <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setReviewItems(prev => prev.map(q => (q.id === editingItem.id ? editingItem : q)));
                  setEditingItem(null);
                }}
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
