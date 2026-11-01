'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { evaluateAnswer, normalizeAnswer } from '@/lib/scoring';
import { Question, Subject, Module, ApprovalStatus } from '@/lib/types';
import {
  PenTool,
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
  Tag,
  TestTube,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ApprovalStatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { TopicQuestionGeneratorModal } from '@/components/admin/TopicQuestionGeneratorModal';

function IdentificationManagerContent() {
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

  // Live Answer Evaluator Simulator State
  const [testQuestionId, setTestQuestionId] = useState<string | null>(null);
  const [testInput, setTestInput] = useState<string>('');

  // Form state for manual creation
  const [formText, setFormText] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState('');
  const [formAltAnswers, setFormAltAnswers] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formExplanation, setFormExplanation] = useState('');

  const loadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions({ type: 'identification' });
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
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.question_text.toLowerCase().includes(query);
      const matchAns = q.correct_answer.toLowerCase().includes(query);
      const matchAlts = q.alternative_answers?.some(a => a.toLowerCase().includes(query));
      const matchTopic = q.topic?.toLowerCase().includes(query);
      const matchExpl = q.explanation.toLowerCase().includes(query);
      if (!matchText && !matchAns && !matchAlts && !matchTopic && !matchExpl) return false;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedModuleId) {
      alert('Please select a Subject and Module first.');
      return;
    }

    const alts = formAltAnswers
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newQuestion: Question = {
      id: `q-id-${Date.now()}`,
      subject_id: selectedSubjectId,
      module_id: selectedModuleId,
      question_type: 'identification',
      question_text: formText.trim(),
      correct_answer: formCorrectAnswer.trim(),
      alternative_answers: alts,
      explanation: formExplanation.trim() || 'Verified Identification term.',
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
    setFormCorrectAnswer('');
    setFormAltAnswers('');
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
    if (confirm('Delete this identification question from the bank?')) {
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
            <PenTool className="w-7 h-7 text-purple-600" />
            Identification Management
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Manage terminology and concept definitions with canonical answers, accepted synonyms, and case/whitespace-normalized grading.
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
            Generate Identification via AI
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 text-xs border-purple-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Identification
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-purple-600 font-semibold block">Total Identification</span>
          <span className="text-2xl font-black text-purple-950 mt-1 block">{filteredQuestions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-emerald-600 font-semibold block">Approved (Ready for Exam)</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{approvedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-amber-600 font-semibold block">Pending Review</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-xs text-indigo-600 font-semibold block">Distinct Topics</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{availableTopics.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-purple-100 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
              placeholder="Search Identification questions, answer terms, alternative synonyms, or topic..."
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
            <PenTool className="w-12 h-12 text-purple-300 mx-auto" />
            <h3 className="text-base font-bold text-purple-950">No Identification Questions Found</h3>
            <p className="text-xs text-purple-600 max-w-md mx-auto">
              There are no Identification questions matching your filters. Generate a set from topics using AI or add one manually.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsGeneratorOpen(true)}
              className="gap-1.5 text-xs mx-auto mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Identification with AI
            </Button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const mod = modules.find(m => m.id === q.module_id);
            const isTestingThis = testQuestionId === q.id;
            const evalResult = isTestingThis && testInput.trim() ? evaluateAnswer(testInput, q) : null;

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
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Test normalization with sample student input"
                      onClick={() => {
                        setTestQuestionId(isTestingThis ? null : q.id);
                        setTestInput('');
                      }}
                      className={`h-8 px-2.5 rounded-lg text-xs gap-1 ${
                        isTestingThis ? 'bg-purple-100 text-purple-900' : 'text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <TestTube className="w-3.5 h-3.5" />
                      Test Scoring
                    </Button>

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

                {/* Question Definition / Prompt */}
                <p className="text-sm font-semibold text-purple-950 leading-snug">
                  {q.question_text}
                </p>

                {/* Answers Section */}
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-900">Canonical Answer:</span>
                    <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                      {q.correct_answer}
                    </span>
                  </div>

                  {q.alternative_answers && q.alternative_answers.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="text-purple-600 font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3 text-purple-500" />
                        Accepted Synonyms / Alternates:
                      </span>
                      {q.alternative_answers.map((alt, aIdx) => (
                        <span
                          key={aIdx}
                          className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-800 text-[11px] font-medium"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-purple-600/90 pt-1 border-t border-purple-100/60 flex items-center gap-2">
                    <span className="font-semibold text-purple-900">Normalization Rules:</span>
                    <span>Case-insensitive</span>
                    <span>•</span>
                    <span>Whitespace-trimmed & collapsed</span>
                    <span>•</span>
                    <span>Punctuation stripped</span>
                  </div>
                </div>

                {/* Live Answer Testing Simulator */}
                {isTestingThis && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                        <TestTube className="w-3.5 h-3.5 text-indigo-600" />
                        Live Student Input Grading Simulator
                      </span>
                      <span className="text-[11px] text-indigo-600 font-medium">Type any variation to verify</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Try: "${q.correct_answer.toLowerCase()}" or with extra spaces...`}
                        value={testInput}
                        onChange={e => setTestInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                      {evalResult && (
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 ${
                            evalResult.isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {evalResult.isCorrect ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {evalResult.isCorrect ? 'MATCH: Correct' : 'MISMATCH: Incorrect'}
                        </span>
                      )}
                    </div>

                    {testInput.trim() && (
                      <p className="text-[11px] text-indigo-700">
                        Normalized student input: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-200">{`"${normalizeAnswer(testInput)}"`}</code>
                      </p>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="pt-2 border-t border-purple-50 text-xs text-purple-600/90 leading-relaxed">
                    <span className="font-bold text-purple-900">Explanation: </span>
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
        targetType="identification"
        initialSubjectId={selectedSubjectId}
        initialModuleId={selectedModuleId}
        onQuestionsSaved={loadData}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Identification Question"
        description={`Author an Identification term for ${currentSubject?.code || 'Subject'} – ${currentModule?.title || 'Module'}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">Topic / Category</label>
            <Input
              value={formTopic}
              onChange={e => setFormTopic(e.target.value)}
              placeholder="e.g. Transport Protocols, Subnetting"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">Definition / Question Prompt</label>
            <Textarea
              rows={3}
              value={formText}
              onChange={e => setFormText(e.target.value)}
              placeholder="Enter the prompt that describes the concept or term..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">Canonical Correct Answer</label>
            <Input
              value={formCorrectAnswer}
              onChange={e => setFormCorrectAnswer(e.target.value)}
              placeholder="e.g. Transmission Control Protocol"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">
              Accepted Alternate Answers (Comma-separated)
            </label>
            <Input
              value={formAltAnswers}
              onChange={e => setFormAltAnswers(e.target.value)}
              placeholder="e.g. TCP, Transmission Control Protocol (TCP)"
            />
            <p className="text-[11px] text-purple-600 mt-1">
              Answers are automatically case-insensitive and whitespace-normalized when students take exams.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">Explanation</label>
            <Textarea
              rows={2}
              value={formExplanation}
              onChange={e => setFormExplanation(e.target.value)}
              placeholder="Context or explanation of the term..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-purple-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Identification
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingQuestion && (
        <Modal
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          title="Edit Identification Question"
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
              <label className="block text-xs font-bold text-purple-900 mb-1">Question Prompt</label>
              <Textarea
                rows={3}
                value={editingQuestion.question_text}
                onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">Canonical Correct Answer</label>
              <Input
                value={editingQuestion.correct_answer}
                onChange={e => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Accepted Alternate Answers (Comma-separated)
              </label>
              <Input
                value={(editingQuestion.alternative_answers || []).join(', ')}
                onChange={e =>
                  setEditingQuestion({
                    ...editingQuestion,
                    alternative_answers: e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean),
                  })
                }
              />
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

export default function IdentificationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-purple-600 font-semibold">Loading Identification questions...</div>}>
      <IdentificationManagerContent />
    </Suspense>
  );
}
