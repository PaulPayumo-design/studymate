'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, UploadedReviewer, Question, Flashcard } from '@/lib/types';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sparkles,
  HelpCircle,
  Trash2,
  Search,
  Check,
  X,
  Info,
} from 'lucide-react';
import { Badge, QuestionTypeBadge, DifficultyBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

function ReviewersManagerContent() {
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');
  const initialSubjectId = searchParams.get('subjectId');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [reviewers, setReviewers] = useState<UploadedReviewer[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  // Upload & Extraction state
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Review & Approval state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [previewTextModalOpen, setPreviewTextModalOpen] = useState(false);
  const [activeReviewer, setActiveReviewer] = useState<UploadedReviewer | null>(null);

  // Extracted suggestion bundle
  const [suggestedQuestions, setSuggestedQuestions] = useState<Question[]>([]);
  const [suggestedFlashcards, setSuggestedFlashcards] = useState<Flashcard[]>([]);
  const [sourceWarnings, setSourceWarnings] = useState<string[]>([]);
  const [sufficientContent, setSufficientContent] = useState<boolean>(true);

  // Filter & Search inside preview text
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const r = StudyMateStore.getReviewers();
    setSubjects(s);
    setModules(m);
    setReviewers(r);

    if (initialSubjectId && s.some(sub => sub.id === initialSubjectId)) {
      setSelectedSubjectId(initialSubjectId);
      if (initialModuleId && m.some(mod => mod.id === initialModuleId)) {
        setSelectedModuleId(initialModuleId);
      } else {
        const subMods = m.filter(mod => mod.subject_id === initialSubjectId);
        if (subMods.length > 0) setSelectedModuleId(subMods[0].id);
      }
    } else if (s.length > 0) {
      setSelectedSubjectId(s[0].id);
      const subMods = m.filter(mod => mod.subject_id === s[0].id);
      if (subMods.length > 0) setSelectedModuleId(subMods[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialSubjectId, initialModuleId]);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentModule = modules.find(m => m.id === selectedModuleId);
  const currentReviewer = reviewers.find(r => r.module_id === selectedModuleId);

  const handleSubjectChange = (subId: string) => {
    setSelectedSubjectId(subId);
    const subMods = modules.filter(m => m.subject_id === subId);
    if (subMods.length > 0) setSelectedModuleId(subMods[0].id);
  };

  const handleFileUploadAndExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !currentSubject || !currentModule) return;

    setIsExtracting(true);
    setExtractError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subjectId', currentSubject.id);
      formData.append('moduleId', currentModule.id);
      formData.append('moduleTitle', currentModule.title);
      formData.append('mcTarget', (currentModule.question_distribution?.multiple_choice || 10).toString());
      formData.append('idTarget', (currentModule.question_distribution?.identification || 5).toString());
      formData.append('tfTarget', (currentModule.question_distribution?.true_false || 5).toString());

      const res = await fetch('/api/pdf/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse PDF document.');
      }

      setSuggestedQuestions(data.questions || []);
      setSuggestedFlashcards(data.flashcards || []);
      setSourceWarnings(data.warnings || []);
      setSufficientContent(data.sufficient_content ?? true);

      // Create reviewer record locally in StudyMate Store
      const reviewerRecord: UploadedReviewer = {
        id: `rev-${Date.now()}`,
        subject_id: currentSubject.id,
        module_id: currentModule.id,
        file_name: data.reviewer.file_name,
        file_size_bytes: data.reviewer.file_size_bytes,
        extracted_text: data.reviewer.extracted_text,
        extracted_at: new Date().toISOString(),
        status: 'processed',
        summary: data.reviewer.summary,
        created_at: new Date().toISOString(),
      };
      StudyMateStore.saveReviewer(reviewerRecord);

      loadData();
      setReviewModalOpen(true);
    } catch (err: unknown) {
      setExtractError((err as Error).message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApproveQuestion = (idx: number) => {
    setSuggestedQuestions(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], approval_status: 'approved' };
      return updated;
    });
  };

  const handleRejectQuestion = (idx: number) => {
    setSuggestedQuestions(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], approval_status: 'rejected' };
      return updated;
    });
  };

  const handleSaveReviewedContent = () => {
    const approvedQ = suggestedQuestions.filter(q => q.approval_status === 'approved');

    // Add approved questions to store
    approvedQ.forEach(q => {
      StudyMateStore.saveQuestion(q);
    });

    // Add generated flashcards
    suggestedFlashcards.forEach(f => {
      StudyMateStore.saveFlashcard(f);
    });

    setReviewModalOpen(false);
    setFile(null);
    loadData();
  };

  const handleDeleteReviewer = () => {
    if (!currentReviewer) return;
    if (confirm(`Remove reviewer "${currentReviewer.file_name}"?`)) {
      StudyMateStore.removeReviewer(currentReviewer.module_id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26384D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#1685E8]" />
            PDF Reviewer Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Upload PDF reviewers per week. Strictly extract readable text, preview content, and review candidate questions before approval.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
            Subject
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-sm font-medium focus:ring-2 focus:ring-[#1685E8] focus:outline-none"
            value={selectedSubjectId}
            onChange={e => handleSubjectChange(e.target.value)}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id} className="bg-[#101A27] text-[#F8FAFC]">
                {s.code} - {s.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
            Week (1 to 10)
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-sm font-medium focus:ring-2 focus:ring-[#1685E8] focus:outline-none"
            value={selectedModuleId}
            onChange={e => setSelectedModuleId(e.target.value)}
          >
            {modules
              .filter(m => m.subject_id === selectedSubjectId)
              .map(m => (
                <option key={m.id} value={m.id} className="bg-[#101A27] text-[#F8FAFC]">
                  Week {m.module_number}: {m.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Main Reviewer Workspace */}
      {currentModule && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload / Current Status Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-[#26384D] bg-[#111C2A] overflow-hidden">
              <div className="p-5 border-b border-[#26384D]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38BDF8] uppercase">
                    Week {currentModule.module_number}
                  </span>
                  {currentReviewer ? (
                    <span className="text-[11px] font-bold text-[#10B981] bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Processed
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#94A3B8] bg-[#101A27] border border-[#26384D] px-2 py-0.5 rounded-full">
                      No Reviewer Attached
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mt-1">{currentModule.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                {currentReviewer ? (
                  <div className="p-4 rounded-2xl bg-[#101A27] border border-[#26384D] space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#1685E8] text-white flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#F8FAFC] line-clamp-1">{currentReviewer.file_name}</p>
                          <p className="text-[11px] text-[#94A3B8]">
                            {(currentReviewer.file_size_bytes / (1024 * 1024)).toFixed(2)} MB • {currentReviewer.extracted_text.split(/\s+/).length} Words
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleDeleteReviewer}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Reviewer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#111C2A] p-3 rounded-xl border border-[#26384D]">
                      {currentReviewer.summary || 'PDF text parsed and ready for question generation and student flashcards.'}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setActiveReviewer(currentReviewer);
                          setPreviewTextModalOpen(true);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[#111C2A] hover:bg-[#1685E8]/20 text-[#F8FAFC] border border-[#26384D] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                        Preview Extracted Text
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8]">
                    Upload a PDF reviewer document (e.g. lecture notes, syllabus chapter) for Week {currentModule.module_number}.
                  </p>
                )}

                {/* Upload Form */}
                <form onSubmit={handleFileUploadAndExtract} className="space-y-4 pt-2 border-t border-[#26384D]">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                      {currentReviewer ? 'Replace / Re-upload PDF' : 'Upload PDF Document'}
                    </label>
                    <div className="border-2 border-dashed border-[#26384D] hover:border-[#1685E8] rounded-2xl p-6 text-center bg-[#101A27] transition-colors">
                      <UploadCloud className="w-8 h-8 text-[#38BDF8] mx-auto mb-2" />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="pdf-upload-input"
                      />
                      <label htmlFor="pdf-upload-input" className="cursor-pointer">
                        <span className="text-xs font-bold text-[#38BDF8] hover:underline">
                          {file ? file.name : 'Choose PDF File'}
                        </span>
                        <p className="text-[11px] text-[#94A3B8] mt-1">Searchable PDF format recommended</p>
                      </label>
                    </div>
                  </div>

                  {extractError && (
                    <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{extractError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!file || isExtracting}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isExtracting ? 'Extracting Text & Generating...' : 'Extract Text & Generate Suggestions'}
                  </button>
                </form>
              </div>
            </div>

            {/* Strict Source Grounding Notice */}
            <div className="p-4 bg-[#101A27] rounded-2xl border border-[#26384D] text-xs text-[#F8FAFC] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#38BDF8]">
                <Info className="w-4 h-4 text-[#38BDF8]" />
                Strict Source Requirement
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                All generated questions, answers, and explanations are derived strictly from the text of the uploaded PDF reviewer.
                Nothing is invented from external sources. The administrator must review and approve questions before they are committed to the question bank.
              </p>
            </div>
          </div>

          {/* Weeks Overview & Question Counts */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-[#26384D] bg-[#111C2A] p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">Weekly Reviewer Overview across Subject</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Curriculum weeks of {currentSubject?.title}. Ensure each week has its dedicated PDF reviewer attached.
                </p>
              </div>
              <div className="space-y-3">
                {modules
                  .filter(m => m.subject_id === selectedSubjectId)
                  .map(mod => {
                    const r = reviewers.find(rev => rev.module_id === mod.id);
                    const isSelected = mod.id === selectedModuleId;

                    return (
                      <div
                        key={mod.id}
                        onClick={() => setSelectedModuleId(mod.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${isSelected
                            ? 'bg-[#1685E8]/15 border-[#1685E8] shadow-xs'
                            : 'bg-[#101A27] border-[#26384D] hover:border-[#38BDF8]/60'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${r ? 'bg-[#1685E8] text-white' : 'bg-[#111C2A] text-[#94A3B8] border border-[#26384D]'
                            }`}>
                            {mod.module_number}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-xs text-[#F8FAFC]">Week {mod.module_number}: {mod.title}</h5>
                              {r ? (
                                <Badge variant="success" size="sm">PDF Attached</Badge>
                              ) : (
                                <Badge variant="warning" size="sm">Missing PDF</Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                              {r ? r.file_name : 'No reviewer uploaded yet.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div className="text-xs text-[#38BDF8] font-semibold">
                            {r ? `${r.extracted_text.split(/\s+/).length} words` : '0 words'}
                          </div>
                          <span className="text-[#94A3B8]">→</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Preview Extracted Text */}
      {previewTextModalOpen && activeReviewer && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewTextModalOpen(false)}
          title={`Extracted Content: ${activeReviewer.file_name}`}
          description={`${activeReviewer.extracted_text.split(/\s+/).length} total readable words extracted from PDF.`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <Input
                placeholder="Search extracted keywords..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="p-4 bg-[#101A27] rounded-2xl border border-[#26384D] font-mono text-xs text-[#F8FAFC] max-h-[55vh] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
              {activeReviewer.extracted_text}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-[#94A3B8]">
                Audited: Extracted on {new Date(activeReviewer.extracted_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => setPreviewTextModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Strict Question & Flashcard Approval Drawer */}
      {reviewModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setReviewModalOpen(false)}
          title="Review & Approve Suggested Questions"
          description="Strict Grounding Rule: Every candidate question was derived strictly from your PDF. Review and approve before saving."
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {sourceWarnings.length > 0 && (
              <div className="p-3 bg-amber-950/50 border border-amber-500/40 rounded-xl text-amber-300 text-xs space-y-1">
                {sourceWarnings.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-[#38BDF8]">
                Approved: <strong className="text-[#F8FAFC] font-bold">{suggestedQuestions.filter(q => q.approval_status === 'approved').length}</strong> / {suggestedQuestions.length} Questions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSuggestedQuestions(prev => prev.map(q => ({ ...q, approval_status: 'approved' })));
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#101A27] hover:bg-[#1685E8]/20 text-[#38BDF8] border border-[#26384D] transition-colors cursor-pointer"
                >
                  Approve All
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {suggestedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${q.approval_status === 'approved'
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : q.approval_status === 'rejected'
                        ? 'bg-rose-950/30 border-rose-500/40 opacity-60'
                        : 'bg-[#101A27] border-[#26384D]'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#F8FAFC]">Q{idx + 1}.</span>
                      <QuestionTypeBadge type={q.question_type} />
                      <DifficultyBadge difficulty={q.difficulty} />
                      {q.manual_verification_flag && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-400" /> Verify Manually
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleApproveQuestion(idx)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${q.approval_status === 'approved'
                            ? 'bg-[#10B981] text-white border-[#10B981]'
                            : 'bg-[#111C2A] text-[#10B981] border-[#26384D] hover:bg-[#1685E8]/20'
                          }`}
                        title="Approve Question"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleRejectQuestion(idx)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${q.approval_status === 'rejected'
                            ? 'bg-[#EF4444] text-white border-[#EF4444]'
                            : 'bg-[#111C2A] text-rose-400 border-[#26384D] hover:bg-rose-950/40'
                          }`}
                        title="Reject Question"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-[#F8FAFC]">{q.question_text}</p>

                  {q.choices && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {q.choices.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className={`p-2 rounded-lg border ${c === q.correct_answer
                              ? 'bg-emerald-950/60 border-emerald-500/40 font-bold text-emerald-300'
                              : 'bg-[#111C2A] border-[#26384D] text-[#94A3B8]'
                            }`}
                        >
                          {String.fromCharCode(65 + cIdx)}. {c}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.question_type !== 'multiple_choice' && (
                    <div className="p-2 rounded-lg bg-[#111C2A] border border-[#26384D] text-xs">
                      <span className="font-bold text-[#10B981]">Correct Answer:</span>{' '}
                      <span className="text-[#F8FAFC] font-semibold">{q.correct_answer}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-[#94A3B8] bg-[#111C2A] p-2 rounded-lg border border-[#26384D]">
                    <strong className="text-[#38BDF8]">Source Excerpt:</strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#26384D]">
              <span className="text-xs text-[#94A3B8]">
                Only questions marked as <strong className="text-[#F8FAFC]">Approved</strong> will be added to the Question Bank.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReviewedContent}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1685E8] hover:bg-[#1270c7] text-white shadow-xs transition-all cursor-pointer"
                >
                  Commit Approved to Question Bank
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function ReviewersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#94A3B8]">Loading reviewer workspace...</div>}>
      <ReviewersManagerContent />
    </Suspense>
  );
}
