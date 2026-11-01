'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module } from '@/lib/types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const loadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    setSubjects(s);
    setModules(m);
    // Expand all subjects by default so all suites are visible
    if (s.length > 0 && Object.keys(expandedSubjects).length === 0) {
      const allExpanded: Record<string, boolean> = {};
      s.forEach(sub => { allExpanded[sub.id] = true; });
      setExpandedSubjects(allExpanded);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleExpand = (subId: string) => {
    setExpandedSubjects(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    StudyMateStore.createSubject(newTitle, newCode, newDescription);
    setNewTitle('');
    setNewCode('');
    setNewDescription('');
    setIsCreateOpen(false);
    loadData();
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    StudyMateStore.updateSubject(editingSubject.id, {
      title: editingSubject.title,
      code: editingSubject.code,
      description: editingSubject.description,
    });
    setEditingSubject(null);
    loadData();
  };

  const handleDeleteSubject = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? All associated modules, questions, and flashcards will also be removed.`)) {
      StudyMateStore.deleteSubject(id);
      loadData();
    }
  };

  const handleUpdateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    StudyMateStore.updateModule(editingModule.id, {
      title: editingModule.title,
      description: editingModule.description,
      exam_time_limit_minutes: editingModule.exam_time_limit_minutes,
    });
    setEditingModule(null);
    loadData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
            Subjects & Weeks Management
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Organize academic subjects. Each subject provisions up to 10 weeks with individual reviewers, flashcards, and 30-item question targets.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Subject
        </Button>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        {subjects.map(subject => {
          const subModules = modules.filter(m => m.subject_id === subject.id);
          const isExpanded = Boolean(expandedSubjects[subject.id]);

          return (
            <Card key={subject.id} className="border-purple-200">
              <div className="p-5 flex items-center justify-between bg-white hover:bg-purple-50/30 transition-colors">
                <div
                  className="flex items-center gap-3.5 cursor-pointer flex-1"
                  onClick={() => toggleExpand(subject.id)}
                >
                  <button className="text-purple-400 hover:text-purple-700">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                        {subject.code}
                      </span>
                      <h3 className="font-bold text-base text-purple-950">{subject.title}</h3>
                    </div>
                    <p className="text-xs text-purple-600/90 mt-0.5 line-clamp-1">
                      {subject.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-4">
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg hidden sm:inline">
                    {subModules.length} Weeks (Max 10)
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSubject(subject)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Edit Subject Details"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSubject(subject.id, subject.title)}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Weeks List inside Subject */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-purple-50 bg-[#fdfcff] space-y-3">
                  <div className="flex items-center justify-between pt-3 pb-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800">
                      Standard Curriculum Weeks (1 to {subModules.length})
                    </h4>
                    <span className="text-[11px] text-purple-500">
                      Target: 30 Questions Per Week (Allowance up to Week 10)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {subModules.map(mod => (
                      <div
                        key={mod.id}
                        className="p-4 bg-white rounded-2xl border border-purple-100/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-purple-200 transition-all"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs bg-purple-600 text-white px-2 py-0.5 rounded-md">
                              Week {mod.module_number}
                            </span>
                            <h5 className="font-bold text-sm text-purple-950">{mod.title}</h5>
                          </div>
                          <p className="text-xs text-purple-600/80 line-clamp-1">{mod.description}</p>
                          <div className="flex items-center gap-4 text-[11px] text-purple-500 pt-1">
                            <span className="flex items-center gap-1 font-medium">
                              <HelpCircle className="w-3 h-3 text-purple-600" />
                              Approved: {mod.approved_question_count || 0} / 30 Qs
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-violet-600" />
                              {mod.flashcard_count || 0} Flashcards
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              {mod.exam_time_limit_minutes} Min Exam
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-blue-600" />
                              {mod.pdf_reviewer ? 'PDF Attached' : 'No PDF'}
                            </span>
                          </div>
                        </div>

                        {/* Week Actions */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <Link href={`/admin/modules?moduleId=${mod.id}`}>
                            <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                              <Sliders className="w-3.5 h-3.5" />
                              Configure 30-Item Distribution
                            </Button>
                          </Link>
                          <Link href={`/admin/reviewers?moduleId=${mod.id}&subjectId=${subject.id}`}>
                            <Button variant="outline" size="sm" className="text-xs gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              Reviewer
                            </Button>
                          </Link>
                          <Link href={`/admin/questions?moduleId=${mod.id}&subjectId=${subject.id}`}>
                            <Button variant="outline" size="sm" className="text-xs gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Questions
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingModule(mod)}
                            title="Edit Week Info"
                            className="text-purple-500 hover:text-purple-800"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modal: Create Subject */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Academic Subject"
        description="Creates a new subject with curriculum weeks (supports up to Week 10)."
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <Input
            label="Subject Code"
            placeholder="e.g. CS-301 or NET-101"
            required
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
          />
          <Input
            label="Subject Title"
            placeholder="e.g. Operating Systems & Architecture"
            required
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <Textarea
            label="Description / Curriculum Summary"
            placeholder="Enter scope and curriculum notes for this subject..."
            rows={3}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          />
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-700">
            Note: StudyMate will automatically provision curriculum weeks (with an allowance up to Week 10) ready for Topic AI Generation and PDF uploads.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Subject & Provision Weeks
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Subject */}
      {editingSubject && (
        <Modal
          isOpen={true}
          onClose={() => setEditingSubject(null)}
          title="Edit Subject"
          description="Update subject code, title, and description."
        >
          <form onSubmit={handleUpdateSubject} className="space-y-4">
            <Input
              label="Subject Code"
              required
              value={editingSubject.code}
              onChange={e => setEditingSubject({ ...editingSubject, code: e.target.value })}
            />
            <Input
              label="Subject Title"
              required
              value={editingSubject.title}
              onChange={e => setEditingSubject({ ...editingSubject, title: e.target.value })}
            />
            <Textarea
              label="Description"
              rows={3}
              value={editingSubject.description}
              onChange={e => setEditingSubject({ ...editingSubject, description: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditingSubject(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Edit Week */}
      {editingModule && (
        <Modal
          isOpen={true}
          onClose={() => setEditingModule(null)}
          title={`Edit Week ${editingModule.module_number}`}
          description="Update title, description, and examination timer."
        >
          <form onSubmit={handleUpdateModule} className="space-y-4">
            <Input
              label="Week Title"
              required
              value={editingModule.title}
              onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
            />
            <Textarea
              label="Week Scope & Description"
              rows={3}
              value={editingModule.description}
              onChange={e => setEditingModule({ ...editingModule, description: e.target.value })}
            />
            <Input
              label="Individual Exam Time Limit (Minutes)"
              type="number"
              min={5}
              max={180}
              required
              value={editingModule.exam_time_limit_minutes}
              onChange={e => setEditingModule({ ...editingModule, exam_time_limit_minutes: parseInt(e.target.value) || 30 })}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditingModule(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Week
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
