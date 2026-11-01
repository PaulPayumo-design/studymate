'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Question, Subject, Module, QuestionType, QuestionDifficulty, ApprovalStatus, QuestionExamSet } from '@/lib/types';
import {
  HelpCircle,
  Plus,
  Search,
  Download,
  Upload,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Sliders,
  ListChecks,
  PenTool,
  ToggleLeft,
  FileText,
} from 'lucide-react';
import { QuestionTypeBadge, DifficultyBadge, ApprovalStatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { TopicQuestionGeneratorModal } from '@/components/admin/TopicQuestionGeneratorModal';

function QuestionsManagerContent() {
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');
  const initialSubjectId = searchParams.get('subjectId');
  const initialExamSet = searchParams.get('examSet') as QuestionExamSet | null;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedExamSet, setSelectedExamSet] = useState<string>(initialExamSet || 'all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Question Form State (for manual creation)
  const [formType, setFormType] = useState<QuestionType>('multiple_choice');
  const [formText, setFormText] = useState('');
  const [formChoices, setFormChoices] = useState<string[]>(['', '', '', '']);
  const [formCorrectAnswer, setFormCorrectAnswer] = useState('');
  const [formAltAnswers, setFormAltAnswers] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formSourceRef, setFormSourceRef] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<QuestionDifficulty>('medium');
  const [formApproval, setFormApproval] = useState<ApprovalStatus>('approved');

  const loadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions();
    setSubjects(s);
    setModules(m);
    setQuestions(q);

    if (initialSubjectId && s.some(sub => sub.id === initialSubjectId)) {
      setSelectedSubjectId(initialSubjectId);
      if (initialModuleId && m.some(mod => mod.id === initialModuleId)) {
        setSelectedModuleId(initialModuleId);
      }
    } else if (s.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(s[0].id);
      const subMods = m.filter(mod => mod.subject_id === s[0].id);
      if (subMods.length > 0) setSelectedModuleId(subMods[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialSubjectId, initialModuleId]);

  const handleSubjectFilterChange = (subId: string) => {
    setSelectedSubjectId(subId);
    setSelectedModuleId(''); // all modules or reset
  };

  const availableTopics = Array.from(
    new Set(
      questions
        .filter(q => (!selectedSubjectId || q.subject_id === selectedSubjectId) && (!selectedModuleId || q.module_id === selectedModuleId))
        .map(q => q.topic)
        .filter(Boolean) as string[]
    )
  );

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    if (selectedSubjectId && q.subject_id !== selectedSubjectId) return false;
    if (selectedModuleId && q.module_id !== selectedModuleId) return false;
    if (selectedType !== 'all' && q.question_type !== selectedType) return false;
    if (selectedExamSet !== 'all') {
      if (selectedExamSet === 'mixed') {
        if (q.exam_set !== 'mixed') return false;
      } else {
        if (q.exam_set) {
          if (q.exam_set !== selectedExamSet) return false;
        } else {
          if (q.question_type !== selectedExamSet) return false;
        }
      }
    }
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedStatus !== 'all' && q.approval_status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const match =
        q.question_text.toLowerCase().includes(qLower) ||
        q.correct_answer.toLowerCase().includes(qLower) ||
        (q.topic && q.topic.toLowerCase().includes(qLower)) ||
        q.explanation.toLowerCase().includes(qLower);
      if (!match) return false;
    }
    return true;
  });

  const activeModule = modules.find(m => m.id === selectedModuleId);
  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  // Module Progress towards 30 questions
  const moduleApprovedCount = questions.filter(
    q => q.module_id === selectedModuleId && q.approval_status === 'approved'
  ).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedModuleId) {
      alert('Please select a Subject and Module for this question.');
      return;
    }

    const newQuestion: Question = {
      id: `q-manual-${Date.now()}`,
      subject_id: selectedSubjectId,
      module_id: selectedModuleId,
      question_type: formType,
      question_text: formText.trim(),
      choices: formType === 'multiple_choice' ? formChoices.filter(c => c.trim().length > 0) : undefined,
      correct_answer: formCorrectAnswer.trim(),
      alternative_answers: formType === 'identification'
        ? formAltAnswers.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
      explanation: formExplanation.trim(),
      source_pdf_ref: formSourceRef.trim() || `${activeModule?.title || 'Module'} Reviewer.pdf`,
      topic: formTopic.trim() || undefined,
      difficulty: formDifficulty,
      approval_status: formApproval,
      created_at: new Date().toISOString(),
    };

    StudyMateStore.saveQuestion(newQuestion);
    setIsCreateModalOpen(false);
    resetForm();
    loadData();
  };

  const resetForm = () => {
    setFormText('');
    setFormChoices(['', '', '', '']);
    setFormCorrectAnswer('');
    setFormAltAnswers('');
    setFormTopic('');
    setFormExplanation('');
    setFormSourceRef('');
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    StudyMateStore.saveQuestion(editingQuestion);
    setEditingQuestion(null);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this question from the bank?')) {
      StudyMateStore.deleteQuestion(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    StudyMateStore.updateQuestionStatus(id, newStatus);
    loadData();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredQuestions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `studymate_questions_${selectedModuleId || 'all'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) throw new Error('JSON content must be an array of questions.');

      const imported: Question[] = parsed.map((item, idx) => ({
        id: item.id || `q-imp-${Date.now()}-${idx}`,
        subject_id: selectedSubjectId || item.subject_id,
        module_id: selectedModuleId || item.module_id,
        question_type: item.question_type || 'multiple_choice',
        question_text: item.question_text || 'Untitled Question',
        choices: item.choices || undefined,
        correct_answer: item.correct_answer || '',
        alternative_answers: item.alternative_answers || [],
        explanation: item.explanation || '',
        source_pdf_ref: item.source_pdf_ref || 'Imported Reviewer.pdf',
        difficulty: item.difficulty || 'medium',
        approval_status: item.approval_status || 'approved',
        created_at: new Date().toISOString(),
      }));

      StudyMateStore.saveQuestionsBulk(imported);
      setIsImportModalOpen(false);
      setImportJsonText('');
      loadData();
      alert(`Successfully imported ${imported.length} questions into the bank.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format.';
      setImportError(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#F8FAFC]">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26384D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-[#1685E8]" />
            Question Bank Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Target 30 questions per module across Multiple Choice, Identification, and True/False. Manual authoring, JSON import/export, and PDF generation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            AI Generator from Topics
          </button>
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#111C2A] text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
            Export JSON
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#111C2A] text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
            Import JSON
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#111C2A] text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#38BDF8]" />
            Add Question
          </button>
        </div>
      </div>

      {/* 3 Dedicated Question Type Management Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href={`/admin/questions/multiple-choice${selectedSubjectId ? `?subjectId=${selectedSubjectId}` : ''}${selectedModuleId ? `&moduleId=${selectedModuleId}` : ''}`}
          className="group p-4 rounded-2xl bg-[#101A27] border border-[#26384D] hover:border-[#1685E8] shadow-xs transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1685E8]/20 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#1685E8] group-hover:text-white transition-colors">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Multiple Choice
              </h4>
              <p className="text-[11px] text-[#94A3B8]">
                {questions.filter(q => q.question_type === 'multiple_choice' && (!selectedModuleId || q.module_id === selectedModuleId)).length} items • 4 options
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href={`/admin/questions/identification${selectedSubjectId ? `?subjectId=${selectedSubjectId}` : ''}${selectedModuleId ? `&moduleId=${selectedModuleId}` : ''}`}
          className="group p-4 rounded-2xl bg-[#101A27] border border-[#26384D] hover:border-[#1685E8] shadow-xs transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1685E8]/20 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#1685E8] group-hover:text-white transition-colors">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Identification
              </h4>
              <p className="text-[11px] text-[#94A3B8]">
                {questions.filter(q => q.question_type === 'identification' && (!selectedModuleId || q.module_id === selectedModuleId)).length} items • Normalized terms
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href={`/admin/questions/true-false${selectedSubjectId ? `?subjectId=${selectedSubjectId}` : ''}${selectedModuleId ? `&moduleId=${selectedModuleId}` : ''}`}
          className="group p-4 rounded-2xl bg-[#101A27] border border-[#26384D] hover:border-[#1685E8] shadow-xs transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1685E8]/20 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#1685E8] group-hover:text-white transition-colors">
              <ToggleLeft className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                True or False
              </h4>
              <p className="text-[11px] text-[#94A3B8]">
                {questions.filter(q => q.question_type === 'true_false' && (!selectedModuleId || q.module_id === selectedModuleId)).length} items • Binary check
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Target Progress Meter for Selected Module */}
      {selectedModuleId && activeModule && (
        <div className="rounded-2xl border border-[#26384D] bg-[#111C2A] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs bg-[#1685E8] text-white px-2 py-0.5 rounded-md">
                Module {activeModule.module_number}
              </span>
              <h4 className="font-bold text-sm text-[#F8FAFC]">{activeModule.title}</h4>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Target Question Bank: <strong>30 Questions</strong>. Current approved:{' '}
              <strong className={moduleApprovedCount >= 30 ? 'text-[#10B981]' : 'text-[#38BDF8]'}>
                {moduleApprovedCount} / 30
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-44 bg-[#101A27] border border-[#26384D] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#1685E8] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (moduleApprovedCount / 30) * 100)}%` }}
              />
            </div>
            <Link href={`/admin/modules?moduleId=${activeModule.id}`}>
              <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#1685E8]/20 text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer">
                <Sliders className="w-3 h-3 text-[#38BDF8]" />
                Distribution
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="rounded-2xl border border-[#26384D] bg-[#111C2A] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Subject
            </label>
            <select
              className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs font-medium focus:ring-2 focus:ring-[#1685E8] focus:outline-none"
              value={selectedSubjectId}
              onChange={e => handleSubjectFilterChange(e.target.value)}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-[#101A27] text-[#F8FAFC]">
                  {s.code} - {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Module
            </label>
            <select
              className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs font-medium focus:ring-2 focus:ring-[#1685E8] focus:outline-none"
              value={selectedModuleId}
              onChange={e => setSelectedModuleId(e.target.value)}
            >
              <option value="" className="bg-[#101A27] text-[#F8FAFC]">All Modules (1-10)</option>
              {modules
                .filter(m => !selectedSubjectId || m.subject_id === selectedSubjectId)
                .map(m => (
                  <option key={m.id} value={m.id} className="bg-[#101A27] text-[#F8FAFC]">
                    Module {m.module_number}: {m.title}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Question Type
            </label>
            <select
              className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs font-medium focus:ring-2 focus:ring-[#1685E8] focus:outline-none"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="all" className="bg-[#101A27] text-[#F8FAFC]">All Types</option>
              <option value="multiple_choice" className="bg-[#101A27] text-[#F8FAFC]">Multiple Choice</option>
              <option value="identification" className="bg-[#101A27] text-[#F8FAFC]">Identification</option>
              <option value="true_false" className="bg-[#101A27] text-[#F8FAFC]">True or False</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Topic
            </label>
            <select
              className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs font-medium focus:ring-2 focus:ring-[#1685E8] focus:outline-none"
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
            >
              <option value="all" className="bg-[#101A27] text-[#F8FAFC]">All Topics</option>
              {availableTopics.map(t => (
                <option key={t} value={t} className="bg-[#101A27] text-[#F8FAFC]">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Approval Status
            </label>
            <select
              className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs font-medium focus:ring-2 focus:ring-[#1685E8] focus:outline-none"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="all" className="bg-[#101A27] text-[#F8FAFC]">All Statuses</option>
              <option value="approved" className="bg-[#101A27] text-[#F8FAFC]">Approved Only</option>
              <option value="pending" className="bg-[#101A27] text-[#F8FAFC]">Pending Review Only</option>
              <option value="rejected" className="bg-[#101A27] text-[#F8FAFC]">Rejected Only</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
          <Input
            placeholder="Search question text, correct answers, or explanation excerpts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
          <span>Showing <strong className="text-[#F8FAFC]">{filteredQuestions.length}</strong> matching questions</span>
          <span>Target per week: 30 Questions</span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border border-[#26384D] bg-[#111C2A] p-8 text-center text-xs text-[#94A3B8] space-y-2">
            <HelpCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p>No questions matched the selected filters.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#1685E8]/20 text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer"
            >
              Add Question
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div key={q.id} className="rounded-2xl border border-[#26384D] bg-[#111C2A] hover:border-[#38BDF8]/50 transition-all p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-[#F8FAFC]">#{idx + 1}</span>
                  <QuestionTypeBadge type={q.question_type} />
                  <DifficultyBadge difficulty={q.difficulty} />
                  <ApprovalStatusBadge status={q.approval_status} />
                  {q.topic && (
                    <span className="px-2 py-0.5 rounded-md bg-[#1685E8]/20 text-[11px] font-bold text-[#38BDF8] border border-[#1685E8]/40">
                      {q.topic}
                    </span>
                  )}
                  {q.exam_set && (
                    <span className="px-2 py-0.5 rounded-md bg-[#101A27] text-[11px] font-bold text-[#38BDF8] border border-[#26384D]">
                      Set: {q.exam_set.replace('_', ' ')}
                    </span>
                  )}
                  <span className="text-[11px] text-[#94A3B8] font-mono">
                    Week {modules.find(m => m.id === q.module_id)?.module_number || '?'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {q.approval_status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(q.id, 'approved')}
                      className="inline-flex items-center text-[#10B981] hover:bg-emerald-950/40 text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                    </button>
                  )}
                  {q.approval_status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(q.id, 'rejected')}
                      className="inline-flex items-center text-rose-400 hover:bg-rose-950/40 text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => setEditingQuestion(q)}
                    className="p-1.5 text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#101A27] rounded-lg transition-colors cursor-pointer"
                    title="Edit Question"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm font-bold text-[#F8FAFC] leading-snug">{q.question_text}</p>

              {/* Answer Choices / Correct Display */}
              {q.question_type === 'multiple_choice' && q.choices && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.choices.map((choice, cIdx) => (
                    <div
                      key={cIdx}
                      className={`p-2.5 rounded-xl border text-xs ${
                        choice === q.correct_answer
                          ? 'bg-emerald-950/60 border-emerald-500/40 font-bold text-emerald-300'
                          : 'bg-[#101A27] border-[#26384D] text-[#94A3B8]'
                      }`}
                    >
                      <span className="font-bold mr-1.5 text-[#38BDF8]">{String.fromCharCode(65 + cIdx)}.</span>
                      {choice}
                      {choice === q.correct_answer && (
                        <span className="ml-2 text-[10px] bg-emerald-950 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {q.question_type === 'identification' && (
                <div className="p-3 bg-[#101A27] rounded-xl border border-[#26384D] text-xs space-y-1">
                  <div>
                    <span className="font-bold text-[#94A3B8]">Correct Answer:</span>{' '}
                    <span className="font-semibold text-[#10B981]">{q.correct_answer}</span>
                  </div>
                  {q.alternative_answers && q.alternative_answers.length > 0 && (
                    <div className="text-[11px] text-[#94A3B8]">
                      <strong>Alternative Accepted Answers:</strong> {q.alternative_answers.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {q.question_type === 'true_false' && (
                <div className="p-2.5 bg-[#101A27] rounded-xl border border-[#26384D] text-xs">
                  <span className="font-bold text-[#94A3B8]">Correct Answer:</span>{' '}
                  <span className="font-bold text-[#10B981]">{q.correct_answer}</span>
                </div>
              )}

              {/* Explanation & Source PDF Ref */}
              <div className="pt-2.5 border-t border-[#26384D] flex flex-col md:flex-row md:items-start justify-between gap-2.5 text-xs">
                <div className="text-[#94A3B8] leading-relaxed flex-1">
                  <strong className="text-[#F8FAFC] font-bold">Explanation:</strong> {q.explanation}
                </div>
                <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#101A27] border border-[#26384D] text-[#38BDF8] font-medium text-[11px]">
                  <FileText className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span><strong>Source:</strong> {q.source_pdf_ref}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Manual Question */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Question Manually"
        description="Add a new question to the selected subject and module question bank."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#94A3B8] mb-1">
                Question Type
              </label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs"
                value={formType}
                onChange={e => setFormType(e.target.value as QuestionType)}
              >
                <option value="multiple_choice" className="bg-[#101A27]">Multiple Choice</option>
                <option value="identification" className="bg-[#101A27]">Identification</option>
                <option value="true_false" className="bg-[#101A27]">True or False</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#94A3B8] mb-1">
                Difficulty
              </label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs"
                value={formDifficulty}
                onChange={e => setFormDifficulty(e.target.value as QuestionDifficulty)}
              >
                <option value="easy" className="bg-[#101A27]">Easy</option>
                <option value="medium" className="bg-[#101A27]">Medium</option>
                <option value="hard" className="bg-[#101A27]">Hard</option>
              </select>
            </div>
          </div>

          <Input
            label="Topic / Category"
            placeholder="e.g. OSI Physical Layer, TCP 3-Way Handshake"
            value={formTopic}
            onChange={e => setFormTopic(e.target.value)}
          />

          <Textarea
            label="Question Text"
            placeholder="Type question stem..."
            required
            rows={2}
            value={formText}
            onChange={e => setFormText(e.target.value)}
          />

          {/* Type-specific inputs */}
          {formType === 'multiple_choice' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-[#94A3B8]">
                Answer Choices (Select the correct option)
              </label>
              <div className="space-y-2">
                {formChoices.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-mc"
                      checked={formCorrectAnswer === c && c.length > 0}
                      onChange={() => setFormCorrectAnswer(c)}
                      className="accent-[#1685E8]"
                    />
                    <Input
                      placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                      required
                      value={c}
                      onChange={e => {
                        const updated = [...formChoices];
                        updated[i] = e.target.value;
                        setFormChoices(updated);
                        if (formCorrectAnswer === c) setFormCorrectAnswer(e.target.value);
                      }}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {formType === 'identification' && (
            <div className="space-y-3">
              <Input
                label="Correct Answer"
                placeholder="Exact term or answer..."
                required
                value={formCorrectAnswer}
                onChange={e => setFormCorrectAnswer(e.target.value)}
              />
              <Input
                label="Alternative Accepted Answers (Comma-separated)"
                placeholder="e.g. acronyms, alternate spellings"
                value={formAltAnswers}
                onChange={e => setFormAltAnswers(e.target.value)}
                helperText="Will be automatically normalized during grading (case-insensitive, whitespace trimmed)."
              />
            </div>
          )}

          {formType === 'true_false' && (
            <div>
              <label className="block text-xs font-semibold uppercase text-[#94A3B8] mb-1">
                Correct Answer
              </label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-xs"
                value={formCorrectAnswer || 'True'}
                onChange={e => setFormCorrectAnswer(e.target.value)}
              >
                <option value="True" className="bg-[#101A27]">True</option>
                <option value="False" className="bg-[#101A27]">False</option>
              </select>
            </div>
          )}

          <Textarea
            label="Explanation & Source Context"
            placeholder="Cite why this answer is correct..."
            required
            rows={2}
            value={formExplanation}
            onChange={e => setFormExplanation(e.target.value)}
          />

          <Input
            label="Source PDF Reference"
            placeholder="e.g. Module 1 Reviewer.pdf (Section 1.2)"
            value={formSourceRef}
            onChange={e => setFormSourceRef(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white shadow-xs transition-all cursor-pointer"
            >
              Save Question
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Question */}
      {editingQuestion && (
        <Modal
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          title="Edit Question"
          description="Update question stem, choices, or explanation."
          maxWidth="2xl"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <Input
              label="Topic / Category"
              value={editingQuestion.topic || ''}
              onChange={e => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
            />

            <Textarea
              label="Question Text"
              required
              rows={2}
              value={editingQuestion.question_text}
              onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
            />

            {editingQuestion.question_type === 'multiple_choice' && editingQuestion.choices && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-[#94A3B8]">
                  Choices (Select correct)
                </label>
                {editingQuestion.choices.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="edit-mc-correct"
                      checked={editingQuestion.correct_answer === c}
                      onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: c })}
                      className="accent-[#1685E8]"
                    />
                    <Input
                      value={c}
                      onChange={e => {
                        const copy = [...editingQuestion.choices!];
                        copy[i] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, choices: copy });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {editingQuestion.question_type !== 'multiple_choice' && (
              <Input
                label="Correct Answer"
                required
                value={editingQuestion.correct_answer}
                onChange={e => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })}
              />
            )}

            <Textarea
              label="Explanation"
              rows={2}
              value={editingQuestion.explanation}
              onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
            />

            <Input
              label="Source PDF Ref"
              value={editingQuestion.source_pdf_ref}
              onChange={e => setEditingQuestion({ ...editingQuestion, source_pdf_ref: e.target.value })}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white shadow-xs transition-all cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: JSON Import */}
      {isImportModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsImportModalOpen(false)}
          title="Import Approved Questions from JSON"
          description="Paste JSON array of questions to bulk add to the question bank."
          maxWidth="2xl"
        >
          <form onSubmit={handleImportJson} className="space-y-4">
            <Textarea
              label="JSON Array"
              placeholder={`[\n  {\n    "question_type": "multiple_choice",\n    "question_text": "What is...?",\n    "choices": ["A", "B", "C", "D"],\n    "correct_answer": "A",\n    "explanation": "..."\n  }\n]`}
              rows={10}
              required
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              className="font-mono text-xs"
            />

            {importError && (
              <p className="text-xs text-rose-400 font-semibold">{importError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white shadow-xs transition-all cursor-pointer"
              >
                Import Questions
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Topic-based AI Question Generator */}
      <TopicQuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        initialSubjectId={selectedSubjectId}
        initialModuleId={selectedModuleId}
        onQuestionsSaved={loadData}
      />
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#94A3B8]">Loading questions...</div>}>
      <QuestionsManagerContent />
    </Suspense>
  );
}
