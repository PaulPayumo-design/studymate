'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudyMateStore } from '@/lib/store';
import { Question, Subject, Module } from '@/lib/types';
import {
  ListChecks,
  Plus,
  Search,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ApprovalStatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { TopicQuestionGeneratorModal } from '@/components/admin/TopicQuestionGeneratorModal';

function MultipleChoiceManagerContent() {
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');
  const initialSubjectId = searchParams.get('subjectId');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state for manual creation
  const [formText, setFormText] = useState('');
  const [formChoices, setFormChoices] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formTopic, setFormTopic] = useState('');
  const [formExplanation, setFormExplanation] = useState('');

  const loadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions({ type: 'multiple_choice' });
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
    setSelectedModuleId('');
    setSelectedTopic('all');
  };

  // Distinct topics in the current selection
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
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedStatus !== 'all' && q.approval_status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.question_text.toLowerCase().includes(query);
      const matchChoices = q.choices?.some(c => c.toLowerCase().includes(query));
      const matchTopic = q.topic?.toLowerCase().includes(query);
      const matchExpl = q.explanation.toLowerCase().includes(query);
      if (!matchText && !matchChoices && !matchTopic && !matchExpl) return false;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedModuleId) {
      alert('Please select a Subject and Module first.');
      return;
    }

    const cleanedChoices = formChoices.map(c => c.trim()).filter(Boolean);
    if (cleanedChoices.length < 2) {
      alert('Please provide at least 2 choices.');
      return;
    }

    const correctAnswer = formChoices[formCorrectIndex]?.trim() || cleanedChoices[0];

    const newQuestion: Question = {
      id: `q-mc-${Date.now()}`,
      subject_id: selectedSubjectId,
      module_id: selectedModuleId,
      question_type: 'multiple_choice',
      question_text: formText.trim(),
      choices: formChoices.map(c => c.trim()),
      correct_answer: correctAnswer,
      explanation: formExplanation.trim() || 'Verified Multiple Choice question.',
      topic: formTopic.trim() || 'General Topic',
      source_pdf_ref: 'Manual Authoring',
      approval_status: 'approved',
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
    setFormCorrectIndex(0);
    setFormTopic('');
    setFormExplanation('');
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    StudyMateStore.saveQuestion(editingQuestion);
    setEditingQuestion(null);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this multiple choice question from the bank?')) {
      StudyMateStore.deleteQuestion(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    StudyMateStore.updateQuestionStatus(id, newStatus);
    loadData();
  };

  const filteredModules = modules.filter(m => m.subject_id === selectedSubjectId);
  const approvedCount = filteredQuestions.filter(q => q.approval_status === 'approved').length;
  const pendingCount = filteredQuestions.filter(q => q.approval_status === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#F8FAFC]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26384D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] bg-[#111C2A] border border-[#26384D] px-2 py-0.5 rounded-md">
              Dedicated Section
            </span>
            <span className="text-xs text-[#94A3B8]">• Single Question Type Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <ListChecks className="w-7 h-7 text-[#1685E8]" />
            Multiple Choice Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Create, generate with AI from topics, review 4-option choices, and organize Multiple Choice items for exams.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            Generate MC via AI
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#111C2A] text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#38BDF8]" />
            Add Multiple Choice
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#94A3B8] font-semibold block">Total MC Items</span>
          <span className="text-2xl font-black text-[#F8FAFC] mt-1 block">{filteredQuestions.length}</span>
        </div>
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#10B981] font-semibold block">Approved (Ready for Exam)</span>
          <span className="text-2xl font-black text-[#10B981] mt-1 block">{approvedCount}</span>
        </div>
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#F59E0B] font-semibold block">Pending Review</span>
          <span className="text-2xl font-black text-[#F59E0B] mt-1 block">{pendingCount}</span>
        </div>
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#38BDF8] font-semibold block">Distinct Topics</span>
          <span className="text-2xl font-black text-[#38BDF8] mt-1 block">{availableTopics.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#26384D] bg-[#111C2A] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={e => handleSubjectFilterChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#101A27] border border-[#26384D] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1685E8]"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-[#101A27]">
                  {s.code} – {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Week (1 to 10)</label>
            <select
              value={selectedModuleId}
              onChange={e => setSelectedModuleId(e.target.value)}
              className="w-full px-3 py-2 bg-[#101A27] border border-[#26384D] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1685E8]"
            >
              <option value="" className="bg-[#101A27]">All Weeks (1-10)</option>
              {filteredModules.map(m => (
                <option key={m.id} value={m.id} className="bg-[#101A27]">
                  Week {m.module_number}: {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 bg-[#101A27] border border-[#26384D] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1685E8]"
            >
              <option value="all" className="bg-[#101A27]">All Topics</option>
              {availableTopics.map(t => (
                <option key={t} value={t} className="bg-[#101A27]">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Approval Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#101A27] border border-[#26384D] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1685E8]"
            >
              <option value="all" className="bg-[#101A27]">All Statuses</option>
              <option value="approved" className="bg-[#101A27]">Approved</option>
              <option value="pending" className="bg-[#101A27]">Pending</option>
              <option value="rejected" className="bg-[#101A27]">Rejected</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Multiple Choice questions, choices, topic, or explanation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#101A27] border border-[#26384D] rounded-xl text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus:outline-none focus:ring-2 focus:ring-[#1685E8]"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-[#111C2A] rounded-3xl border border-[#26384D] shadow-xs space-y-3">
            <ListChecks className="w-12 h-12 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-bold text-[#F8FAFC]">No Multiple Choice Questions Found</h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
              There are no Multiple Choice questions matching your filters. Use the AI Generator from Topics to create new items or add one manually.
            </p>
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white mx-auto mt-2 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate MC with AI
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const mod = modules.find(m => m.id === q.module_id);

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-[#111C2A] border border-[#26384D] hover:border-[#38BDF8]/50 shadow-xs space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-lg bg-[#1685E8]/20 text-[#38BDF8] text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <ApprovalStatusBadge status={q.approval_status} />
                    {q.topic && (
                      <span className="px-2 py-0.5 rounded-md bg-[#101A27] text-[11px] font-bold text-[#38BDF8] border border-[#26384D]">
                        {q.topic}
                      </span>
                    )}
                    {mod && (
                      <span className="text-[11px] font-medium text-[#94A3B8]">
                        Week {mod.module_number}: {mod.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {q.approval_status === 'pending' && (
                      <button
                        title="Approve"
                        onClick={() => handleStatusChange(q.id, 'approved')}
                        className="p-1.5 rounded-lg text-[#10B981] hover:bg-emerald-950/40 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {q.approval_status === 'approved' && (
                      <button
                        title="Reject"
                        onClick={() => handleStatusChange(q.id, 'rejected')}
                        className="p-1.5 rounded-lg text-[#F59E0B] hover:bg-amber-950/40 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      title="Edit"
                      onClick={() => setEditingQuestion(q)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#101A27] transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-[#F8FAFC] leading-snug">
                  {q.question_text}
                </p>

                {/* Choices Display (4 Choices) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(q.choices || []).map((choice, cIdx) => {
                    const isCorrect = choice.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
                    return (
                      <div
                        key={cIdx}
                        className={`p-2.5 rounded-xl text-xs flex items-center gap-2.5 border transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-[#101A27] border-[#26384D] text-[#94A3B8]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-[#10B981] text-white' : 'bg-[#111C2A] text-[#38BDF8]'
                          }`}
                        >
                          {String.fromCharCode(65 + cIdx)}
                        </span>
                        <span className="flex-1">{choice}</span>
                        {isCorrect && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="pt-2 border-t border-[#26384D] text-xs text-[#94A3B8] leading-relaxed">
                    <span className="font-bold text-[#F8FAFC]">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Manual Question */}
      {isCreateModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          title="Add Multiple Choice Question"
          description="Manually author a 4-option question item."
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Topic</label>
              <Input
                placeholder="e.g. OSI Model, Routing Protocols"
                value={formTopic}
                onChange={e => setFormTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">
                Question Text <span className="text-rose-400">*</span>
              </label>
              <Textarea
                rows={3}
                required
                placeholder="Type the question stem here..."
                value={formText}
                onChange={e => setFormText(e.target.value)}
              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-[#94A3B8]">
                Answer Choices (Select the radio of the correct choice)
              </label>
              {formChoices.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#101A27] text-[#38BDF8] text-xs font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Input
                    required
                    placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                    value={c}
                    onChange={e => {
                      const copy = [...formChoices];
                      copy[i] = e.target.value;
                      setFormChoices(copy);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="radio"
                    name="correct-mc-choice"
                    checked={formCorrectIndex === i}
                    onChange={() => setFormCorrectIndex(i)}
                    className="accent-[#1685E8] w-4 h-4 cursor-pointer shrink-0"
                    title="Mark as correct answer"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Explanation</label>
              <Textarea
                rows={2}
                placeholder="Explain why this choice is correct..."
                value={formExplanation}
                onChange={e => setFormExplanation(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#26384D]">
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
                Save Multiple Choice
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Edit Question */}
      {editingQuestion && (
        <Modal
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          title="Edit Multiple Choice Question"
          description="Update choices, correct selection, or explanation."
          maxWidth="2xl"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Topic</label>
              <Input
                value={editingQuestion.topic || ''}
                onChange={e => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Question Text</label>
              <Textarea
                rows={3}
                required
                value={editingQuestion.question_text}
                onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-[#94A3B8]">Choices & Correct Answer</label>
              {(editingQuestion.choices || []).map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#101A27] text-[#38BDF8] text-xs font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Input
                    value={c}
                    onChange={e => {
                      const copy = [...(editingQuestion.choices || [])];
                      const oldVal = copy[i];
                      copy[i] = e.target.value;
                      const wasCorrect = editingQuestion.correct_answer === oldVal;
                      setEditingQuestion({
                        ...editingQuestion,
                        choices: copy,
                        correct_answer: wasCorrect ? e.target.value : editingQuestion.correct_answer,
                      });
                    }}
                    className="flex-1"
                  />
                  <input
                    type="radio"
                    name="edit-correct-mc"
                    checked={editingQuestion.correct_answer === c}
                    onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: c })}
                    className="accent-[#1685E8] w-4 h-4 cursor-pointer shrink-0"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Explanation</label>
              <Textarea
                rows={2}
                value={editingQuestion.explanation}
                onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#26384D]">
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

      {/* AI Modal */}
      <TopicQuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        targetType="multiple_choice"
        initialSubjectId={selectedSubjectId}
        initialModuleId={selectedModuleId}
        onQuestionsSaved={loadData}
      />
    </div>
  );
}

export default function MultipleChoiceManagerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#94A3B8]">Loading Multiple Choice console...</div>}>
      <MultipleChoiceManagerContent />
    </Suspense>
  );
}
