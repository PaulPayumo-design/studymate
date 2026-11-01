'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Question, Subject, Module, ApprovalStatus } from '@/lib/types';
import {
  ToggleLeft,
  Plus,
  Search,
  Filter,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Check,
  CheckSquare,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ApprovalStatusBadge } from '@/components/ui/Badge';
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
      choices: ['True', 'False'],
      correct_answer: formCorrectAnswer,
      explanation: formExplanation.trim() || 'Verified True or False factual statement.',
      topic: formTopic.trim() || 'General Concept',
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
    if (confirm('Delete this True/False question from the bank?')) {
      StudyMateStore.deleteQuestion(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    StudyMateStore.updateQuestionStatus(id, newStatus);
    loadData();
  };

  const filteredModules = modules.filter(m => m.subject_id === selectedSubjectId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentModule = modules.find(m => m.id === selectedModuleId);

  const approvedCount = filteredQuestions.filter(q => q.approval_status === 'approved').length;
  const pendingCount = filteredQuestions.filter(q => q.approval_status === 'pending').length;
  const trueCount = filteredQuestions.filter(q => q.correct_answer === 'True').length;
  const falseCount = filteredQuestions.filter(q => q.correct_answer === 'False').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              Dedicated Section
            </span>
            <span className="text-xs text-purple-600">• Single Question Type Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-2.5">
            <ToggleLeft className="w-7 h-7 text-purple-600" />
            True or False Management
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Manage binary verification questions with factual statements, verified True or False keys, and educational explanations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsGeneratorOpen(true)}
            className="gap-1.5 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-500/20"
          >
            <Sparkles className="w-4 h-4 text-lavender-200" />
            Generate True/False via AI
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 text-xs border-purple-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Add True or False
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-purple-600 font-semibold block">Total True/False Items</span>
          <span className="text-2xl font-black text-purple-950 mt-1 block">{filteredQuestions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-emerald-600 font-semibold block">Approved (Ready for Exam)</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{approvedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-purple-600 font-semibold block">Answer Balance</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              True: {trueCount}
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              False: {falseCount}
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-indigo-600 font-semibold block">Distinct Topics</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{availableTopics.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-purple-100 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-purple-900 mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={e => handleSubjectFilterChange(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} – {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-purple-900 mb-1">Week (1 to 10)</label>
              <select
                value={selectedModuleId}
                onChange={e => setSelectedModuleId(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Weeks (1-10)</option>
                {filteredModules.map(m => (
                  <option key={m.id} value={m.id}>
                    Week {m.module_number}: {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-purple-900 mb-1">Topic</label>
              <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Topics</option>
                {availableTopics.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-purple-900 mb-1">Correct Answer</label>
              <select
                value={selectedAnswerFilter}
                onChange={e => setSelectedAnswerFilter(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">True & False</option>
                <option value="True">True Only</option>
                <option value="False">False Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-purple-900 mb-1">Approval Status</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search True or False statements, topic, or explanation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-purple-200 rounded-xl text-xs text-purple-950 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-purple-100 shadow-xs space-y-3">
            <ToggleLeft className="w-12 h-12 text-purple-300 mx-auto" />
            <h3 className="text-base font-bold text-purple-950">No True or False Questions Found</h3>
            <p className="text-xs text-purple-600 max-w-md mx-auto">
              There are no True or False questions matching your filters. Generate a balanced set from topics using AI or author one manually.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsGeneratorOpen(true)}
              className="gap-1.5 text-xs mx-auto mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate True/False with AI
            </Button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const mod = modules.find(m => m.id === q.module_id);
            const isTrue = q.correct_answer === 'True';

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-200 shadow-xs space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <ApprovalStatusBadge status={q.approval_status} />
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black border ${
                        isTrue
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-purple-100 text-purple-900 border-purple-300'
                      }`}
                    >
                      Answer: {q.correct_answer}
                    </span>
                    {q.topic && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[11px] font-bold text-purple-700 border border-purple-100">
                        {q.topic}
                      </span>
                    )}
                    {mod && (
                      <span className="text-[11px] font-medium text-purple-500">
                        Week {mod.module_number}: {mod.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {q.approval_status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Approve"
                        onClick={() => handleStatusChange(q.id, 'approved')}
                        className="w-8 h-8 rounded-lg text-emerald-600 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    )}
                    {q.approval_status === 'approved' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Reject"
                        onClick={() => handleStatusChange(q.id, 'rejected')}
                        className="w-8 h-8 rounded-lg text-amber-600 hover:bg-amber-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit"
                      onClick={() => setEditingQuestion(q)}
                      className="w-8 h-8 rounded-lg text-purple-600 hover:bg-purple-100"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => handleDelete(q.id)}
                      className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Statement Prompt */}
                <p className="text-sm font-semibold text-purple-950 leading-snug">
                  {`"${q.question_text}"`}
                </p>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100/60 text-xs text-purple-700 leading-relaxed">
                    <span className="font-bold text-purple-950">Explanation & Verification: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Topic-Based AI Generator Modal */}
      <TopicQuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        targetType="true_false"
        initialSubjectId={selectedSubjectId}
        initialModuleId={selectedModuleId}
        onQuestionsSaved={loadData}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add True or False Question"
        description={`Author a binary verification statement for ${currentSubject?.code || 'Subject'} – ${currentModule?.title || 'Module'}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">Topic / Category</label>
            <Input
              value={formTopic}
              onChange={e => setFormTopic(e.target.value)}
              placeholder="e.g. Data Link Framing, CRC Checksum"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">Statement Text</label>
            <Textarea
              rows={3}
              value={formText}
              onChange={e => setFormText(e.target.value)}
              placeholder="Enter the factual statement to be evaluated as True or False..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1.5">Correct Answer</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                  formCorrectAnswer === 'True'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50'
                }`}
              >
                <input
                  type="radio"
                  name="createTf"
                  checked={formCorrectAnswer === 'True'}
                  onChange={() => setFormCorrectAnswer('True')}
                  className="sr-only"
                />
                True
              </label>

              <label
                className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                  formCorrectAnswer === 'False'
                    ? 'bg-purple-100 border-purple-400 text-purple-950 ring-2 ring-purple-500/20'
                    : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50'
                }`}
              >
                <input
                  type="radio"
                  name="createTf"
                  checked={formCorrectAnswer === 'False'}
                  onChange={() => setFormCorrectAnswer('False')}
                  className="sr-only"
                />
                False
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">Explanation</label>
            <Textarea
              rows={2}
              value={formExplanation}
              onChange={e => setFormExplanation(e.target.value)}
              placeholder="Why is this statement True or False?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-purple-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save True/False
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingQuestion && (
        <Modal
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          title="Edit True or False Question"
          maxWidth="lg"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">Topic</label>
              <Input
                value={editingQuestion.topic || ''}
                onChange={e => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">Statement Text</label>
              <Textarea
                rows={3}
                value={editingQuestion.question_text}
                onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1.5">Correct Answer</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    editingQuestion.correct_answer === 'True'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="editTf"
                    checked={editingQuestion.correct_answer === 'True'}
                    onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: 'True' })}
                    className="sr-only"
                  />
                  True
                </label>

                <label
                  className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                    editingQuestion.correct_answer === 'False'
                      ? 'bg-purple-100 border-purple-400 text-purple-950 ring-2 ring-purple-500/20'
                      : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="editTf"
                    checked={editingQuestion.correct_answer === 'False'}
                    onChange={() => setEditingQuestion({ ...editingQuestion, correct_answer: 'False' })}
                    className="sr-only"
                  />
                  False
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">Explanation</label>
              <Textarea
                rows={2}
                value={editingQuestion.explanation}
                onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-purple-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingQuestion(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Apply Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default function TrueFalsePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-purple-600 font-semibold">Loading True or False questions...</div>}>
      <TrueFalseManagerContent />
    </Suspense>
  );
}
