'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Module, Subject, Question } from '@/lib/types';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Save,
  Plus,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

function WeeklyConfiguratorContent() {
  const searchParams = useSearchParams();
  const requestedModuleId = searchParams.get('moduleId');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  // Editable week details
  const [weekTitle, setWeekTitle] = useState('');
  const [weekDescription, setWeekDescription] = useState('');

  // Configurable distribution state
  const [mcBase, setMcBase] = useState(10);
  const [idBase, setIdBase] = useState(10);
  const [tfBase, setTfBase] = useState(10);

  const [addMc, setAddMc] = useState(0);
  const [addId, setAddId] = useState(0);
  const [addTf, setAddTf] = useState(0);

  const [timeLimit, setTimeLimit] = useState(30);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadModuleConfig = useCallback((mod: Module) => {
    setWeekTitle(mod.title);
    setWeekDescription(mod.description || '');
    setTimeLimit(mod.exam_time_limit_minutes || 30);
    const dist = mod.question_distribution || {
      multiple_choice: 10,
      identification: 10,
      true_false: 10,
      additional_mc: 0,
      additional_id: 0,
      additional_tf: 0,
    };
    setMcBase(dist.multiple_choice ?? 10);
    setIdBase(dist.identification ?? 10);
    setTfBase(dist.true_false ?? 10);
    setAddMc(dist.additional_mc ?? 0);
    setAddId(dist.additional_id ?? 0);
    setAddTf(dist.additional_tf ?? 0);
  }, []);

  const loadData = useCallback(() => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions();

    setSubjects(s);
    setModules(m);
    setQuestions(q);

    if (requestedModuleId) {
      const match = m.find(mod => mod.id === requestedModuleId);
      if (match) {
        setSelectedSubjectId(match.subject_id);
        setSelectedModuleId(match.id);
        loadModuleConfig(match);
        return;
      }
    }

    if (s.length > 0) {
      const subId = selectedSubjectId || s[0].id;
      setSelectedSubjectId(subId);
      const subMods = m.filter(mod => mod.subject_id === subId);
      if (subMods.length > 0) {
        const activeMod = subMods.find(mod => mod.id === selectedModuleId) || subMods[0];
        setSelectedModuleId(activeMod.id);
        loadModuleConfig(activeMod);
      }
    }
  }, [requestedModuleId, selectedSubjectId, selectedModuleId, loadModuleConfig]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubjectChange = (newSubId: string) => {
    setSelectedSubjectId(newSubId);
    const subMods = modules.filter(m => m.subject_id === newSubId);
    if (subMods.length > 0) {
      setSelectedModuleId(subMods[0].id);
      loadModuleConfig(subMods[0]);
    } else {
      setSelectedModuleId('');
    }
  };

  const handleModuleChange = (newModId: string) => {
    setSelectedModuleId(newModId);
    const match = modules.find(m => m.id === newModId);
    if (match) {
      loadModuleConfig(match);
    }
  };

  const subjectWeeks = modules.filter(m => m.subject_id === selectedSubjectId).sort((a, b) => a.module_number - b.module_number);
  const activeModule = modules.find(m => m.id === selectedModuleId);
  const activeSubject = subjects.find(s => s.id === selectedSubjectId);
  const activeQuestions = questions.filter(q => q.module_id === selectedModuleId);
  const approvedQuestions = activeQuestions.filter(q => q.approval_status === 'approved');

  const currentMcApproved = approvedQuestions.filter(q => q.question_type === 'multiple_choice').length;
  const currentIdApproved = approvedQuestions.filter(q => q.question_type === 'identification').length;
  const currentTfApproved = approvedQuestions.filter(q => q.question_type === 'true_false').length;

  // Calculation
  const targetMcTotal = Number(mcBase) + Number(addMc);
  const targetIdTotal = Number(idBase) + Number(addId);
  const targetTfTotal = Number(tfBase) + Number(addTf);
  const grandTotal = targetMcTotal + targetIdTotal + targetTfTotal;

  const isValidTotal = grandTotal === 30;

  // Add next week (allowance up to Week 10)
  const handleAddWeek = () => {
    if (subjectWeeks.length >= 10) {
      alert('Allowance cap reached: A subject can have a maximum of 10 weeks.');
      return;
    }

    try {
      const nextNum = subjectWeeks.length + 1;
      const created = StudyMateStore.addWeek(
        selectedSubjectId,
        `Week ${nextNum}: Topic Outline`,
        `Curriculum topics, reviewer notes, and examination questions for Week ${nextNum}.`
      );
      loadData();
      setSelectedModuleId(created.id);
      loadModuleConfig(created);
      setActionMsg(`Successfully added Week ${nextNum} (Allowance: ${nextNum}/10).`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleDeleteWeek = (id: string, weekNum: number) => {
    if (confirm(`Are you sure you want to delete Week ${weekNum}? All questions associated with this week will remain in the database or can be reassigned.`)) {
      StudyMateStore.deleteWeek(id);
      loadData();
      setActionMsg(`Week ${weekNum} removed.`);
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  const handleSave = () => {
    if (!isValidTotal || !activeModule) return;

    StudyMateStore.updateModule(activeModule.id, {
      title: weekTitle.trim() || activeModule.title,
      description: weekDescription.trim() || activeModule.description,
      exam_time_limit_minutes: timeLimit,
      exam_question_count: 30,
      question_distribution: {
        multiple_choice: mcBase,
        identification: idBase,
        true_false: tfBase,
        additional_mc: Number(addMc),
        additional_id: Number(addId),
        additional_tf: Number(addTf),
      },
    });

    setSaveSuccess(true);
    loadData();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              Curriculum Architecture
            </span>
            <span className="text-xs text-purple-600 font-semibold">• Allowance up to Week 10</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-purple-600" />
            Weekly Curriculum & Question Targets
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Manage your subject weeks from Week 1 up to Week 10. Each week targets 30 approved questions (10 Multiple Choice, 10 Identification, 10 True/False).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              Week Settings Saved
            </span>
          )}
          {actionMsg && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              {actionMsg}
            </span>
          )}
        </div>
      </div>

      {/* Select Subject */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
            Select Subject
          </label>
          <select
            className="w-full px-4 py-2 bg-purple-50/60 rounded-xl border border-purple-200 text-purple-950 text-sm font-semibold focus:ring-2 focus:ring-purple-400 focus:outline-none"
            value={selectedSubjectId}
            onChange={e => handleSubjectChange(e.target.value)}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.code} – {s.title} ({modules.filter(m => m.subject_id === s.id).length} Weeks)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddWeek}
            disabled={subjectWeeks.length >= 10}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            Add Week ({subjectWeeks.length}/10)
          </Button>
        </div>
      </div>

      {/* Interactive Week Selector Bar (Weeks 1 to 10) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-purple-950 uppercase tracking-wider">
            Curriculum Weeks for {activeSubject?.code} ({subjectWeeks.length} of 10 Weeks Configured)
          </span>
          <span className="text-purple-600 font-medium">Click a week to view & configure</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {subjectWeeks.map(w => {
            const isSelected = w.id === selectedModuleId;
            const weekQCount = questions.filter(q => q.module_id === w.id && q.approval_status === 'approved').length;

            return (
              <button
                key={w.id}
                onClick={() => handleModuleChange(w.id)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-bold scale-[1.02]'
                    : 'bg-white border-purple-100 hover:border-purple-300 text-purple-900'
                }`}
              >
                <span className="text-xs font-black">W{w.module_number}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-purple-500 text-white'
                      : weekQCount >= 30
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-50 text-purple-600'
                  }`}
                >
                  {weekQCount}/30
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeModule && (
        <div className="space-y-6">
          {/* Week Overview & Title Editor */}
          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50/40">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    {activeSubject?.code} • Week {activeModule.module_number} of 10
                  </span>
                  <CardTitle className="text-xl mt-0.5">{activeModule.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/questions?moduleId=${activeModule.id}&subjectId=${selectedSubjectId}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                      Open Question Bank
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  {activeModule.module_number > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWeek(activeModule.id, activeModule.module_number)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Week
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">Week Title</label>
                  <Input
                    value={weekTitle}
                    onChange={e => setWeekTitle(e.target.value)}
                    placeholder={`e.g. Week ${activeModule.module_number}: Network Architecture`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">Week Description / Topics</label>
                  <Input
                    value={weekDescription}
                    onChange={e => setWeekDescription(e.target.value)}
                    placeholder="Brief description of key concepts tested this week"
                  />
                </div>
              </div>

              {/* Progress Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center pt-2">
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-xs text-purple-600 font-medium">Multiple Choice</div>
                  <div className="text-xl font-extrabold text-purple-950 mt-1">
                    {currentMcApproved} / {targetMcTotal}
                  </div>
                  <div className="text-[10px] text-purple-500">Target: {targetMcTotal} items</div>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-xs text-blue-700 font-medium">Identification</div>
                  <div className="text-xl font-extrabold text-blue-950 mt-1">
                    {currentIdApproved} / {targetIdTotal}
                  </div>
                  <div className="text-[10px] text-blue-500">Target: {targetIdTotal} items</div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-xs text-amber-700 font-medium">True or False</div>
                  <div className="text-xl font-extrabold text-amber-950 mt-1">
                    {currentTfApproved} / {targetTfTotal}
                  </div>
                  <div className="text-[10px] text-amber-600">Target: {targetTfTotal} items</div>
                </div>

                <div className={`p-3 rounded-xl border ${approvedQuestions.length >= 30 ? 'bg-emerald-50 border-emerald-200' : 'bg-purple-100/60 border-purple-200'}`}>
                  <div className="text-xs text-purple-900 font-medium">Total Approved</div>
                  <div className="text-xl font-extrabold text-purple-950 mt-1">
                    {approvedQuestions.length} / 30
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold">
                    {approvedQuestions.length >= 30 ? 'Target Met (30/30)' : `Needs ${Math.max(0, 30 - approvedQuestions.length)} more approved`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Target Configurator */}
          <Card>
            <CardHeader>
              <CardTitle>Configure 30-Item Distribution for Week {activeModule.module_number}</CardTitle>
              <p className="text-xs text-purple-600 mt-0.5">
                Standard baseline is 10 Multiple Choice, 10 Identification, and 10 True/False (total exactly 30 questions).
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <label className="block text-xs font-bold text-purple-950">Multiple Choice Items</label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={mcBase}
                    onChange={e => setMcBase(parseInt(e.target.value) || 0)}
                  />
                  <span className="text-[11px] text-purple-500 block">4 options recognition</span>
                </div>

                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <label className="block text-xs font-bold text-purple-950">Identification Items</label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={idBase}
                    onChange={e => setIdBase(parseInt(e.target.value) || 0)}
                  />
                  <span className="text-[11px] text-purple-500 block">Typed concepts & synonyms</span>
                </div>

                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <label className="block text-xs font-bold text-purple-950">True or False Items</label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={tfBase}
                    onChange={e => setTfBase(parseInt(e.target.value) || 0)}
                  />
                  <span className="text-[11px] text-purple-500 block">Binary factual verification</span>
                </div>
              </div>

              {/* Timer Config */}
              <div className="pt-2 border-t border-purple-100 flex items-center justify-between flex-wrap gap-4">
                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-purple-900 mb-1">
                    Weekly Examination Timer (Minutes)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={120}
                    value={timeLimit}
                    onChange={e => setTimeLimit(parseInt(e.target.value) || 30)}
                  />
                  <span className="text-[11px] text-purple-500">Time allowed for students taking Week {activeModule.module_number}&apos;s 30-item exam.</span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-purple-600 font-semibold block">Total Items Target</span>
                  <span className={`text-2xl font-black ${isValidTotal ? 'text-purple-900' : 'text-rose-600'}`}>
                    {grandTotal} / 30
                  </span>
                </div>
              </div>

              {/* Save Bar */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {isValidTotal ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Valid Target Distribution: Exactly 30 questions ({mcBase} MC + {idBase} ID + {tfBase} T/F)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Invalid sum: Currently {grandTotal} questions. Distribution must total exactly 30 questions.
                    </span>
                  )}
                  <p className="text-[11px] text-purple-600 mt-0.5">
                    Click Save to persist week settings, curriculum title, and target counts.
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!isValidTotal}
                  className="gap-2 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  Save Week Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function WeeklyConfiguratorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-purple-600">Loading weekly curriculum...</div>}>
      <WeeklyConfiguratorContent />
    </Suspense>
  );
}
