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
  Layers,
  Trash2,
  RefreshCw,
  Search,
  Check,
  X,
  Edit,
  Save,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, QuestionTypeBadge, DifficultyBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';

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
        throw new Error(data.error || 'Failed to extract PDF text.');
      }

      // Save reviewer to store
      const newReviewer: UploadedReviewer = {
        id: `rev-${Date.now()}`,
        subject_id: currentSubject.id,
        module_id: currentModule.id,
        file_name: data.fileName,
        file_size_bytes: data.fileSize,
        extracted_text: data.extractedText,
        extracted_at: new Date().toISOString(),
        status: 'processed',
        summary: `Extracted ${data.wordCount} words across ${data.pageCount} pages.`,
        created_at: new Date().toISOString(),
      };

      StudyMateStore.saveReviewer(newReviewer);
      setActiveReviewer(newReviewer);
      setSuggestedQuestions(data.suggestedQuestions || []);
      setSuggestedFlashcards(data.suggestedFlashcards || []);
      setSourceWarnings(data.sourceWarnings || []);
      setSufficientContent(data.sufficientContent);
      setFile(null);
      loadData();

      // Open suggested questions review modal
      setReviewModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing PDF';
      setExtractError(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApproveQuestion = (index: number) => {
    setSuggestedQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], approval_status: 'approved' };
      return updated;
    });
  };

  const handleRejectQuestion = (index: number) => {
    setSuggestedQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], approval_status: 'rejected' };
      return updated;
    });
  };

  const handleSaveReviewedContent = () => {
    // Only save approved or reviewed items into question bank
    const approvedOnly = suggestedQuestions.filter(q => q.approval_status === 'approved');
    if (approvedOnly.length > 0) {
      StudyMateStore.saveQuestionsBulk(approvedOnly);
    }

    // Save flashcards
    if (suggestedFlashcards.length > 0) {
      StudyMateStore.saveFlashcardsBulk(suggestedFlashcards);
    }

    setReviewModalOpen(false);
    loadData();
    alert(`Saved ${approvedOnly.length} approved questions and ${suggestedFlashcards.length} flashcards to the database.`);
  };

  const handleDeleteReviewer = () => {
    if (!currentModule) return;
    if (confirm(`Remove PDF reviewer for ${currentModule.title}?`)) {
      StudyMateStore.removeReviewer(currentModule.id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-purple-600" />
            PDF Reviewer Management
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Upload PDF reviewers per week. Strictly extract readable text, preview content, and review candidate questions before approval.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-purple-900/80 mb-1.5">
            Subject
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-purple-950 text-sm font-medium focus:ring-2 focus:ring-purple-400 focus:outline-none"
            value={selectedSubjectId}
            onChange={e => handleSubjectChange(e.target.value)}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-purple-900/80 mb-1.5">
            Week (1 to 10)
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-purple-950 text-sm font-medium focus:ring-2 focus:ring-purple-400 focus:outline-none"
            value={selectedModuleId}
            onChange={e => setSelectedModuleId(e.target.value)}
          >
            {modules
              .filter(m => m.subject_id === selectedSubjectId)
              .map(m => (
                <option key={m.id} value={m.id}>
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
            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 uppercase">
                    Week {currentModule.module_number}
                  </span>
                  {currentReviewer ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Processed
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      No Reviewer Attached
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg mt-1">{currentModule.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentReviewer ? (
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-950 line-clamp-1">{currentReviewer.file_name}</p>
                          <p className="text-[11px] text-purple-600">
                            {(currentReviewer.file_size_bytes / (1024 * 1024)).toFixed(2)} MB • {currentReviewer.extracted_text.split(/\s+/).length} Words
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDeleteReviewer}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete Reviewer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-xs text-purple-700/90 leading-relaxed bg-white p-3 rounded-xl border border-purple-100">
                      {currentReviewer.summary || 'PDF text parsed and ready for question generation and student flashcards.'}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveReviewer(currentReviewer);
                          setPreviewTextModalOpen(true);
                        }}
                        className="w-full text-xs gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                        Preview Extracted Text
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-purple-600/80">
                    Upload a PDF reviewer document (e.g. lecture notes, syllabus chapter) for Week {currentModule.module_number}.
                  </p>
                )}

                {/* Upload Form */}
                <form onSubmit={handleFileUploadAndExtract} className="space-y-4 pt-2 border-t border-purple-50">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-purple-900/80 mb-1.5">
                      {currentReviewer ? 'Replace / Re-upload PDF' : 'Upload PDF Document'}
                    </label>
                    <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-6 text-center bg-purple-50/30 transition-colors">
                      <UploadCloud className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="pdf-upload-input"
                      />
                      <label htmlFor="pdf-upload-input" className="cursor-pointer">
                        <span className="text-xs font-bold text-purple-700 hover:underline">
                          {file ? file.name : 'Choose PDF File'}
                        </span>
                        <p className="text-[11px] text-purple-500 mt-1">Searchable PDF format recommended</p>
                      </label>
                    </div>
                  </div>

                  {extractError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{extractError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!file}
                    isLoading={isExtracting}
                    className="w-full gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Extract Text & Generate Suggestions
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Strict Source Grounding Notice */}
            <div className="p-4 bg-purple-100/70 rounded-2xl border border-purple-200 text-xs text-purple-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-900">
                <Info className="w-4 h-4 text-purple-700" />
                Strict Source Requirement
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                All generated questions, answers, and explanations are derived strictly from the text of the uploaded PDF reviewer.
                Nothing is invented from external sources. The administrator must review and approve questions before they are committed to the question bank.
              </p>
            </div>
          </div>

          {/* Weeks Overview & Question Counts */}
          <div className="lg:col-span-7 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Reviewer Overview across Subject</CardTitle>
                <p className="text-xs text-purple-600 mt-0.5">
                  Curriculum weeks of {currentSubject?.title}. Ensure each week has its dedicated PDF reviewer attached.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules
                  .filter(m => m.subject_id === selectedSubjectId)
                  .map(mod => {
                    const r = reviewers.find(rev => rev.module_id === mod.id);
                    const isSelected = mod.id === selectedModuleId;

                    return (
                      <div
                        key={mod.id}
                        onClick={() => setSelectedModuleId(mod.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-purple-100/70 border-purple-400 shadow-xs'
                            : 'bg-white border-purple-100 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            r ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {mod.module_number}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-xs text-purple-950">Week {mod.module_number}: {mod.title}</h5>
                              {r ? (
                                <Badge variant="success" size="sm">PDF Attached</Badge>
                              ) : (
                                <Badge variant="warning" size="sm">Missing PDF</Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-purple-600 line-clamp-1 mt-0.5">
                              {r ? r.file_name : 'No reviewer uploaded yet.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div className="text-xs text-purple-700 font-semibold">
                            {r ? `${r.extracted_text.split(/\s+/).length} words` : '0 words'}
                          </div>
                          <span className="text-purple-400">→</span>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
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
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
              <Input
                placeholder="Search extracted keywords..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 font-mono text-xs text-purple-950 max-h-[55vh] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
              {activeReviewer.extracted_text}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-purple-500">
                Audited: Extracted on {new Date(activeReviewer.extracted_at).toLocaleDateString()}
              </span>
              <Button variant="primary" onClick={() => setPreviewTextModalOpen(false)}>
                Done
              </Button>
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
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs space-y-1">
                {sourceWarnings.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-purple-700">
                Approved: <strong className="text-purple-950 font-bold">{suggestedQuestions.filter(q => q.approval_status === 'approved').length}</strong> / {suggestedQuestions.length} Questions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSuggestedQuestions(prev => prev.map(q => ({ ...q, approval_status: 'approved' })));
                  }}
                  className="text-xs text-purple-700"
                >
                  Approve All
                </Button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {suggestedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    q.approval_status === 'approved'
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : q.approval_status === 'rejected'
                      ? 'bg-rose-50/40 border-rose-200 opacity-60'
                      : 'bg-white border-purple-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-purple-950">Q{idx + 1}.</span>
                      <QuestionTypeBadge type={q.question_type} />
                      <DifficultyBadge difficulty={q.difficulty} />
                      {q.manual_verification_flag && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" /> Verify Manually
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleApproveQuestion(idx)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                          q.approval_status === 'approved'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                        }`}
                        title="Approve Question"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleRejectQuestion(idx)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                          q.approval_status === 'rejected'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                        }`}
                        title="Reject Question"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-purple-950">{q.question_text}</p>

                  {q.choices && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {q.choices.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className={`p-2 rounded-lg border ${
                            c === q.correct_answer
                              ? 'bg-emerald-100/70 border-emerald-300 font-bold text-emerald-950'
                              : 'bg-purple-50/40 border-purple-100 text-purple-800'
                          }`}
                        >
                          {String.fromCharCode(65 + cIdx)}. {c}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.question_type !== 'multiple_choice' && (
                    <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-900">Correct Answer:</span>{' '}
                      <span className="text-emerald-950 font-semibold">{q.correct_answer}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-purple-600 bg-purple-50/60 p-2 rounded-lg">
                    <strong>Source Excerpt:</strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-100">
              <span className="text-xs text-purple-600">
                Only questions marked as <strong>Approved</strong> will be added to the Question Bank.
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveReviewedContent}>
                  Commit Approved to Question Bank
                </Button>
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
    <Suspense fallback={<div className="p-8 text-center text-purple-600">Loading reviewer workspace...</div>}>
      <ReviewersManagerContent />
    </Suspense>
  );
}
