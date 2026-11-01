'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudyMateStore } from '@/lib/store';
import { Flashcard, Subject, Module } from '@/lib/types';
import { Layers, Plus, Trash2, Edit, Search, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

function FlashcardsAdminContent() {
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get('moduleId');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [sourceRef, setSourceRef] = useState('');

  const loadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const f = StudyMateStore.getFlashcards();
    setSubjects(s);
    setModules(m);
    setFlashcards(f);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCards = flashcards.filter(c => {
    if (selectedSubjectId && c.subject_id !== selectedSubjectId) return false;
    if (selectedModuleId && c.module_id !== selectedModuleId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.front_text.toLowerCase().includes(q) && !c.back_text.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedModuleId) {
      alert('Please select a Subject and Module for this flashcard.');
      return;
    }

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      subject_id: selectedSubjectId,
      module_id: selectedModuleId,
      front_text: frontText.trim(),
      back_text: backText.trim(),
      source_ref: sourceRef.trim() || 'Manual Reference',
      approval_status: 'approved',
      created_at: new Date().toISOString(),
    };

    StudyMateStore.saveFlashcard(newCard);
    setIsCreateOpen(false);
    setFrontText('');
    setBackText('');
    setSourceRef('');
    loadData();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    StudyMateStore.saveFlashcard(editingCard);
    setEditingCard(null);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this flashcard?')) {
      StudyMateStore.deleteFlashcard(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-purple-600" />
            Flashcard Collection Management
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Author and organize interactive study flashcards by subject and module with front terms and back definitions.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Flashcard
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900/80 mb-1">
                Subject
              </label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-950 text-xs font-medium"
                value={selectedSubjectId}
                onChange={e => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedModuleId('');
                }}
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900/80 mb-1">
                Week Title
              </label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-950 text-xs font-medium"
                value={selectedModuleId}
                onChange={e => setSelectedModuleId(e.target.value)}
              >
                <option value="">All Weeks</option>
                {modules
                  .filter(m => !selectedSubjectId || m.subject_id === selectedSubjectId)
                  .map(m => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="relative flex items-end">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 bottom-3" />
              <Input
                placeholder="Search flashcard text..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.length === 0 ? (
          <div className="col-span-full text-center py-12 text-xs text-purple-500">
            No flashcards found for this selection.
          </div>
        ) : (
          filteredCards.map(c => {
            const mod = modules.find(m => m.id === c.module_id);
            return (
              <Card key={c.id} className="p-5 border-purple-100 flex flex-col justify-between hover:border-purple-300 transition-all space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                      Module {mod?.module_number || 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCard(c)}
                        className="text-purple-600 hover:text-purple-900 h-7 w-7"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
                        className="text-rose-500 hover:text-rose-700 h-7 w-7"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400">Front (Term / Question)</span>
                    <h4 className="text-sm font-bold text-purple-950 mt-0.5">{c.front_text}</h4>
                  </div>

                  <div className="pt-2 border-t border-purple-50">
                    <span className="text-[10px] uppercase font-bold text-purple-400">Back (Definition / Answer)</span>
                    <p className="text-xs text-purple-800 leading-relaxed mt-0.5">{c.back_text}</p>
                  </div>
                </div>

                <div className="text-[10px] text-purple-400 pt-2 border-t border-purple-50 truncate">
                  Source: {c.source_ref}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal: Create Flashcard */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Flashcard"
        description="Create a term and definition flashcard for the selected module."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Front: Term or Question"
            placeholder="e.g. Bandwidth"
            required
            value={frontText}
            onChange={e => setFrontText(e.target.value)}
          />
          <Textarea
            label="Back: Definition or Explanation"
            placeholder="e.g. The maximum data transfer rate of a network channel measured in bps..."
            required
            rows={3}
            value={backText}
            onChange={e => setBackText(e.target.value)}
          />
          <Input
            label="Source Reference"
            placeholder="e.g. Module 1 Reviewer - Section 1.1"
            value={sourceRef}
            onChange={e => setSourceRef(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Flashcard
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Flashcard */}
      {editingCard && (
        <Modal
          isOpen={true}
          onClose={() => setEditingCard(null)}
          title="Edit Flashcard"
          description="Update front term or back definition."
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="Front: Term or Question"
              required
              value={editingCard.front_text}
              onChange={e => setEditingCard({ ...editingCard, front_text: e.target.value })}
            />
            <Textarea
              label="Back: Definition or Explanation"
              required
              rows={3}
              value={editingCard.back_text}
              onChange={e => setEditingCard({ ...editingCard, back_text: e.target.value })}
            />
            <Input
              label="Source Reference"
              value={editingCard.source_ref}
              onChange={e => setEditingCard({ ...editingCard, source_ref: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditingCard(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default function FlashcardsAdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-purple-600">Loading flashcards...</div>}>
      <FlashcardsAdminContent />
    </Suspense>
  );
}
