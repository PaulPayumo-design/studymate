'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, Question, ExamMode, QuestionExamSet } from '@/lib/types';
import {
  FileCheck2,
  Sparkles,
  Sliders,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Save,
  HelpCircle,
  Plus,
  ArrowRight,
  BookOpen,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TopicQuestionGeneratorModal } from '@/components/admin/TopicQuestionGeneratorModal';

export default function ExaminationsAdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // 60-item Comprehensive Exam Distribution State
  const [compDistribution, setCompDistribution] = useState<Record<number, number>>({});
  const [comprehensiveTimer, setComprehensiveTimer] = useState(60); // 60 minutes default
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI Generator Modal State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorModuleId, setGeneratorModuleId] = useState<string>('');
  const [generatorExamSet, setGeneratorExamSet] = useState<QuestionExamSet>('multiple_choice');

  const reloadData = () => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions();
    setSubjects(s);
    setModules(m);
    setQuestions(q);
  };

  useEffect(() => {
    const s = StudyMateStore.getSubjects();
    const m = StudyMateStore.getModules();
    const q = StudyMateStore.getQuestions();
    setSubjects(s);
    setModules(m);
    setQuestions(q);
    if (s.length > 0) {
      setSelectedSubjectId(s[0].id);
      const subMods = m.filter(mod => mod.subject_id === s[0].id);
      const dist: Record<number, number> = {};
      const n = subMods.length || 10;
      const base = Math.floor(60 / n);
      let rem = 60 - base * n;
      subMods.forEach(mod => {
        dist[mod.module_number] = base + (rem > 0 ? 1 : 0);
        if (rem > 0) rem--;
      });
      setCompDistribution(dist);
    }
  }, []);

  const handleSelectSubject = (subId: string) => {
    setSelectedSubjectId(subId);
    const subMods = modules.filter(m => m.subject_id === subId);
    const dist: Record<number, number> = {};
    const n = subMods.length || 10;
    const base = Math.floor(60 / n);
    let rem = 60 - base * n;
    subMods.forEach(mod => {
      dist[mod.module_number] = base + (rem > 0 ? 1 : 0);
      if (rem > 0) rem--;
    });
    setCompDistribution(dist);
  };

  const subjectModules = modules.filter(m => m.subject_id === selectedSubjectId);

  const totalCompQuestions = Object.values(compDistribution).reduce((sum, n) => sum + Number(n || 0), 0);
  const isValidCompTotal = totalCompQuestions === 60;

  // Check question sufficiency for each week
  const sufficiencyReport = subjectModules.map(m => {
    const approvedCount = questions.filter(
      q => q.module_id === m.id && q.approval_status === 'approved'
    ).length;
    const requiredCount = compDistribution[m.module_number] || Math.floor(60 / (subjectModules.length || 10));
    return {
      module: m,
      approvedCount,
      requiredCount,
      isSufficient: approvedCount >= requiredCount,
    };
  });

  const allModulesSufficient = sufficiencyReport.every(r => r.isSufficient);

  const handleDistributionChange = (modNum: number, value: number) => {
    setCompDistribution(prev => ({
      ...prev,
      [modNum]: value,
    }));
  };

  const handleSaveComprehensive = () => {
    if (!isValidCompTotal) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const openGeneratorForMode = (moduleId: string, mode: QuestionExamSet) => {
    setGeneratorModuleId(moduleId);
    setGeneratorExamSet(mode);
    setIsGeneratorOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-purple-600" />
            Examination Suites & Question Bank Management
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Configure 60 questions per examination mode across all custom Week Titles (Multiple Choice, Identification, True/False, Mixed Mode).
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            Settings Saved
          </span>
        )}
      </div>

      {/* Select Subject */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
            Select Active Subject
          </label>
          <select
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-purple-950 text-sm font-semibold shadow-xs"
            value={selectedSubjectId}
            onChange={e => handleSelectSubject(e.target.value)}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.title}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-purple-700 font-medium">
          Showing <strong>{subjectModules.length}</strong> Week Title Collections configured for this subject.
        </div>
      </div>

      {/* Section 1: 60 Questions Per Examination Mode Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-purple-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            Independent Week Title Examination Sets (60 Items Per Mode)
          </h2>
          <p className="text-xs text-purple-600 mt-0.5">
            Every Week Title requires four independent 60-question sets. All questions are generated from topics and must be admin-approved.
          </p>
        </div>

        <div className="space-y-6">
          {subjectModules.map(mod => {
            const mcStatus = StudyMateStore.getExamModeReadiness(mod.id, 'multiple_choice');
            const idStatus = StudyMateStore.getExamModeReadiness(mod.id, 'identification');
            const tfStatus = StudyMateStore.getExamModeReadiness(mod.id, 'true_false');
            const mixStatus = StudyMateStore.getExamModeReadiness(mod.id, 'mixed');

            return (
              <Card key={mod.id} className="border-purple-200 overflow-hidden shadow-xs">
                <CardHeader className="bg-gradient-to-r from-purple-50/80 to-white pb-3 border-b border-purple-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                          Week {mod.module_number}
                        </span>
                        <h3 className="font-extrabold text-base text-purple-950">
                          {mod.title}
                        </h3>
                      </div>
                      <p className="text-xs text-purple-600/80 mt-1 line-clamp-1">
                        {mod.description || 'Assigned study curriculum and examination suite.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGeneratorForMode(mod.id, 'mixed')}
                        className="text-xs gap-1.5 border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        AI Generator
                      </Button>
                      <Link href={`/admin/questions?moduleId=${mod.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs gap-1 text-purple-700">
                          Manage Questions
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Mode 1: Multiple Choice */}
                    <div className="p-4 rounded-2xl border bg-white border-purple-100 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Mode 1</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mcStatus.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {mcStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-purple-950 mt-1">Multiple Choice Only</h4>
                        <div className="text-lg font-extrabold text-purple-900 mt-2">
                          {mcStatus.approvedCount} <span className="text-xs font-medium text-purple-600">/ 60 Items</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-purple-50 flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'multiple_choice')}
                          className="w-full text-[11px] py-1 h-auto"
                        >
                          Generate 60 Qs
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=multiple_choice`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Mode 2: Identification */}
                    <div className="p-4 rounded-2xl border bg-white border-purple-100 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Mode 2</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            idStatus.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {idStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-purple-950 mt-1">Identification Only</h4>
                        <div className="text-lg font-extrabold text-purple-900 mt-2">
                          {idStatus.approvedCount} <span className="text-xs font-medium text-purple-600">/ 60 Items</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-purple-50 flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'identification')}
                          className="w-full text-[11px] py-1 h-auto"
                        >
                          Generate 60 Qs
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=identification`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Mode 3: True or False */}
                    <div className="p-4 rounded-2xl border bg-white border-purple-100 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Mode 3</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tfStatus.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tfStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-purple-950 mt-1">True or False Only</h4>
                        <div className="text-lg font-extrabold text-purple-900 mt-2">
                          {tfStatus.approvedCount} <span className="text-xs font-medium text-purple-600">/ 60 Items</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-purple-50 flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'true_false')}
                          className="w-full text-[11px] py-1 h-auto"
                        >
                          Generate 60 Qs
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=true_false`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Mode 4: Mixed Examination (20 MC, 20 ID, 20 TF) */}
                    <div className="p-4 rounded-2xl border bg-purple-50/50 border-purple-200 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">Mode 4 (Mixed)</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mixStatus.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {mixStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-purple-950 mt-1">Balanced Synthesis</h4>
                        <div className="text-lg font-extrabold text-purple-950 mt-2">
                          {mixStatus.approvedCount} <span className="text-xs font-medium text-purple-700">/ 60 Items</span>
                        </div>
                        {mixStatus.breakdown && (
                          <div className="text-[10px] text-purple-700/90 pt-1 space-x-1 font-semibold">
                            <span>MC: {mixStatus.breakdown.multiple_choice.approved}/20</span>
                            <span>•</span>
                            <span>ID: {mixStatus.breakdown.identification.approved}/20</span>
                            <span>•</span>
                            <span>TF: {mixStatus.breakdown.true_false.approved}/20</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'mixed')}
                          className="w-full text-[11px] py-1 h-auto"
                        >
                          Generate Mixed (20/20/20)
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=mixed`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 2: 60-Item Comprehensive Multi-Week Examination */}
      <Card className="border-purple-200 mt-8">
        <CardHeader className="bg-purple-50/40">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md uppercase">
                Comprehensive Synthesis
              </span>
              <CardTitle className="text-xl mt-1">
                60-Item Comprehensive Multi-Week Examination ({subjectModules.length} Weeks)
              </CardTitle>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isValidCompTotal
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              Total Allocated: {totalCompQuestions} / 60 Items
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-1">
            Synthesizes questions across all configured curriculum weeks into a single 60-item timed test.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {subjectModules.map(mod => {
              const report = sufficiencyReport.find(r => r.module.id === mod.id);
              const num = mod.module_number;
              return (
                <div key={mod.id} className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950 truncate max-w-[100px]">{mod.title}</span>
                    {report?.isSufficient ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">
                        {report.approvedCount} Qs
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full shrink-0">
                        Only {report?.approvedCount || 0}
                      </span>
                    )}
                  </div>
                  <Input
                    label="Allocated Items"
                    type="number"
                    min={0}
                    max={60}
                    value={compDistribution[num] || 0}
                    onChange={e => handleDistributionChange(num, parseInt(e.target.value) || 0)}
                    className="text-xs font-bold text-purple-950"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-xs">
              <Input
                label="Comprehensive Examination Time Limit (Minutes)"
                type="number"
                min={15}
                max={180}
                value={comprehensiveTimer}
                onChange={e => setComprehensiveTimer(parseInt(e.target.value) || 60)}
                helperText="Standard recommendation: 60 minutes (1 minute per item)."
              />
            </div>

            <Button
              variant="primary"
              onClick={handleSaveComprehensive}
              disabled={!isValidCompTotal}
              className="gap-2 shrink-0 self-end"
            >
              <Save className="w-4 h-4" />
              Save Comprehensive Exam Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Question Generator Modal */}
      <TopicQuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        initialSubjectId={selectedSubjectId}
        initialModuleId={generatorModuleId}
        initialExamSet={generatorExamSet}
        onQuestionsSaved={reloadData}
      />
    </div>
  );
}
