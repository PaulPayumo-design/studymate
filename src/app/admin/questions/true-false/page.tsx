'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudyMateStore } from '@/lib/store';
import { Question, Subject, Module } from '@/lib/types';
import {
  ToggleLeft,
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

function TrueFalseManagerContent() {
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
  const [selectedAnswerFilter, setSelectedAnswerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state for manual creation
  const [formText, setFormText] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<'True' | 'False'>('True');
  const [formTopic, setFormTopic] = useState('');
  const [formExplanation, setFormExplanation] = useState('');

  const loadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions({ type: 'true_false' });
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

  // Distinct topics
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
    if (selectedAnswerFilter !== 'all' && q.correct_answer !== selectedAnswerFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.question_text.toLowerCase().includes(query);
      const matchTopic = q.topic?.toLowerCase().includes(query);
      const matchExpl = q.explanation.toLowerCase().includes(query);
      if (!matchText && !matchTopic && !matchExpl) return false;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedModuleId) {
      alert('Please select a Subject and Module first.');
      return;
    }

    const newQuestion: Question = {
      id: `q-tf-${Date.now()}`,
      subject_id: selectedSubjectId,
      module_id: selectedModuleId,
      question_type: 'true_false',
      question_text: formText.trim(),
      correct_answer: formCorrectAnswer,
      explanation: formExplanation.trim() || 'Verified factual statement.',
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
    setFormCorrectAnswer('True');
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
    if (confirm('Delete this true/false question from the bank?')) {
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
  const trueCount = filteredQuestions.filter(q => q.correct_answer === 'True').length;
  const falseCount = filteredQuestions.filter(q => q.correct_answer === 'False').length;

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
            <ToggleLeft className="w-7 h-7 text-[#1685E8]" />
            True or False Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Create, verify factual accuracy, and manage binary True or False statements with verified source explanations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            Generate True/False via AI
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#111C2A] text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#38BDF8]" />
            Add True/False
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#94A3B8] font-semibold block">Total True/False</span>
          <span className="text-2xl font-black text-[#F8FAFC] mt-1 block">{filteredQuestions.length}</span>
        </div>
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#10B981] font-semibold block">True Statements</span>
          <span className="text-2xl font-black text-[#10B981] mt-1 block">{trueCount}</span>
        </div>
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#F59E0B] font-semibold block">False Statements</span>
          <span className="text-2xl font-black text-[#F59E0B] mt-1 block">{falseCount}</span>
        </div>
        <div className="bg-[#111C2A] p-4 rounded-2xl border border-[#26384D] shadow-xs">
          <span className="text-xs text-[#38BDF8] font-semibold block">Approved Items</span>
          <span className="text-2xl font-black text-[#38BDF8] mt-1 block">{approvedCount}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[#26384D] bg-[#111C2A] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
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
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Statement Answer</label>
            <select
              value={selectedAnswerFilter}
              onChange={e => setSelectedAnswerFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#101A27] border border-[#26384D] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#1685E8]"
            >
              <option value="all" className="bg-[#101A27]">All Statements</option>
              <option value="True" className="bg-[#101A27]">True Only</option>
              <option value="False" className="bg-[#101A27]">False Only</option>
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
            placeholder="Search True or False statements, topic keywords, or explanation..."
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
            <ToggleLeft className="w-12 h-12 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-bold text-[#F8FAFC]">No True or False Questions Found</h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
              There are no True or False statements matching your filters. Generate a set from topics using AI or author one manually.
            </p>
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white mx-auto mt-2 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate True/False with AI
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const mod = modules.find(m => m.id === q.module_id);
            const isTrue = q.correct_answer === 'True';

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
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                        isTrue
                          ? 'bg-emerald-950/70 text-[#10B981] border border-emerald-500/30'
                          : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {q.correct_answer}
                    </span>
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

                {/* Question Statement */}
                <p className="text-sm font-semibold text-[#F8FAFC] leading-snug">
                  {q.question_text}
                </p>

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
          title="Add True or False Statement"
          description="Author a binary factual statement with verified answer and explanation."
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Topic</label>
              <Input
                placeholder="e.g. Subnetting, IPv6 Addressing"
                value={formTopic}
                onChange={e => setFormTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">
                Statement Text <span className="text-rose-400">*</span>
              </label>
              <Textarea
                rows={3}
                required
                placeholder="Type the binary factual statement here..."
                value={formText}
                onChange={e => setFormText(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                Correct Truth Value <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 p-3 rounded-xl border border-[#26384D] bg-[#101A27] text-xs font-bold text-[#F8FAFC] cursor-pointer hover:border-[#10B981]">
                  <input
                    type="radio"
                    name="correct-tf"
                    checked={formCorrectAnswer === 'True'}
                    onChange={() => setFormCorrectAnswer('True')}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                  <span>True (Factually Accurate)</span>
                </label>

                <label className="inline-flex items-center gap-2 p-3 rounded-xl border border-[#26384D] bg-[#101A27] text-xs font-bold text-[#F8FAFC] cursor-pointer hover:border-rose-500">
                  <input
                    type="radio"
                    name="correct-tf"
                    checked={formCorrectAnswer === 'False'}
                    onChange={() => setFormCorrectAnswer('False')}
                    className="accent-rose-500 w-4 h-4 cursor-pointer"
                  />
                  <span>False (Factually Inaccurate)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Explanation</label>
              <Textarea
                rows={2}
                placeholder="Explain why this statement is True or False..."
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
                Save True/False
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
          title="Edit True or False Question"
          description="Update statement phrasing, correct answer, or explanation."
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
              <label className="block text-xs font-bold text-[#94A3B8] mb-1">Statement Text</label>
              <Textarea
                rows={3}
                required
                value={editingQuestion.question_text}
                onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">Correct Truth Value</label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 p-3 rounded-xl border border-[#26384D] bg-[#101A27] text-xs font-bold text-[#F8FAFC] cursor-pointer">
                  <input
                    type="radio"
                    name="edit-correct-tf"
                    checked={editingQuestion.correct_answer === 'True'}
                    onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: 'True' })}
                    className="accent-[#10B981] w-4 h-4"
                  />
                  <span>True</span>
                </label>

                <label className="inline-flex items-center gap-2 p-3 rounded-xl border border-[#26384D] bg-[#101A27] text-xs font-bold text-[#F8FAFC] cursor-pointer">
                  <input
                    type="radio"
                    name="edit-correct-tf"
                    checked={editingQuestion.correct_answer === 'False'}
                    onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: 'False' })}
                    className="accent-rose-500 w-4 h-4"
                  />
                  <span>False</span>
                </label>
              </div>
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
        targetType="true_false"
        initialSubjectId={selectedSubjectId}
        initialModuleId={selectedModuleId}
        onQuestionsSaved={loadData}
      />
    </div>
  );
}

export default function TrueFalseManagerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#94A3B8]">Loading True or False console...</div>}>
      <TrueFalseManagerContent />
    </Suspense>
  );
}
