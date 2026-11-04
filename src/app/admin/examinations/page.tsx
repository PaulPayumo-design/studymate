'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { Subject, Module, Question, ExamMode, QuestionExamSet } from '@/lib/types';
import {
  FileCheck2,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TopicQuestionGeneratorModal } from '@/components/admin/TopicQuestionGeneratorModal';

export default function ExaminationsAdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

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
    }
  }, []);

  const handleSelectSubject = (subId: string) => {
    setSelectedSubjectId(subId);
  };

  const subjectModules = modules.filter(m => m.subject_id === selectedSubjectId);

  const openGeneratorForMode = (moduleId: string, mode: QuestionExamSet) => {
    setGeneratorModuleId(moduleId);
    setGeneratorExamSet(mode);
    setIsGeneratorOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 min-w-0 w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#26384D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-[#38BDF8]" />
            Examination Suites & Question Bank Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Configure 200 questions per examination mode across all custom Week Titles (Multiple Choice, Identification, True/False, Mixed Mode).
          </p>
        </div>
      </div>

      {/* Select Subject */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111C2A] p-4 rounded-2xl border border-[#26384D]">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#38BDF8] mb-1">
            Select Active Subject
          </label>
          <select
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-[#26384D] bg-[#101A27] text-[#F8FAFC] text-sm font-semibold focus:outline-none focus:border-[#38BDF8]"
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

        <div className="text-xs text-[#94A3B8] font-medium">
          Showing <strong className="text-[#F8FAFC]">{subjectModules.length}</strong> Week Title Collections configured for this subject.
        </div>
      </div>

      {/* 200 Questions Per Examination Mode Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#F8FAFC] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#38BDF8]" />
            Independent Week Title Examination Sets (200 Items Per Mode)
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Every Week Title requires four independent 200-question sets. All questions are generated from topics and must be admin-approved.
          </p>
        </div>

        <div className="space-y-6">
          {subjectModules.map(mod => {
            const mcStatus = StudyMateStore.getExamModeReadiness(mod.id, 'multiple_choice');
            const idStatus = StudyMateStore.getExamModeReadiness(mod.id, 'identification');
            const tfStatus = StudyMateStore.getExamModeReadiness(mod.id, 'true_false');
            const mixStatus = StudyMateStore.getExamModeReadiness(mod.id, 'mixed');

            return (
              <Card key={mod.id} className="bg-[#111C2A] border-[#26384D] overflow-hidden shadow-xs">
                <CardHeader className="bg-[#0B1420]/80 pb-3 border-b border-[#26384D]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#38BDF8] bg-[#1685E8]/20 border border-[#1685E8]/30 px-2 py-0.5 rounded-md">
                          Week {mod.module_number}
                        </span>
                        <h3 className="font-extrabold text-base text-[#F8FAFC]">
                          {mod.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">
                        {mod.description || 'Assigned study curriculum and examination suite.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGeneratorForMode(mod.id, 'mixed')}
                        className="text-xs gap-1.5 border-[#26384D] text-[#38BDF8] hover:bg-[#1685E8]/10 hover:border-[#1685E8] bg-[#101A27]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                        AI Generator
                      </Button>
                      <Link href={`/admin/questions?moduleId=${mod.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27]"
                        >
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
                    <div className="p-4 rounded-2xl border bg-[#101A27] border-[#26384D] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">Mode 1</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mcStatus.isReady ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                          }`}>
                            {mcStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#F8FAFC] mt-1">Multiple Choice Only</h4>
                        <div className="text-lg font-extrabold text-[#F8FAFC] mt-2">
                          {mcStatus.approvedCount} <span className="text-xs font-medium text-[#94A3B8]">/ 200 Items</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#26384D] flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'multiple_choice')}
                          className="w-full text-[11px] py-1 h-auto border-[#26384D] text-[#38BDF8] hover:bg-[#1685E8]/10"
                        >
                          Generate 200 Qs
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=multiple_choice`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2 text-[#94A3B8] hover:text-[#F8FAFC]">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Mode 2: Identification */}
                    <div className="p-4 rounded-2xl border bg-[#101A27] border-[#26384D] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">Mode 2</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            idStatus.isReady ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                          }`}>
                            {idStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#F8FAFC] mt-1">Identification Only</h4>
                        <div className="text-lg font-extrabold text-[#F8FAFC] mt-2">
                          {idStatus.approvedCount} <span className="text-xs font-medium text-[#94A3B8]">/ 200 Items</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#26384D] flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'identification')}
                          className="w-full text-[11px] py-1 h-auto border-[#26384D] text-[#38BDF8] hover:bg-[#1685E8]/10"
                        >
                          Generate 200 Qs
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=identification`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2 text-[#94A3B8] hover:text-[#F8FAFC]">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Mode 3: True or False */}
                    <div className="p-4 rounded-2xl border bg-[#101A27] border-[#26384D] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">Mode 3</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tfStatus.isReady ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                          }`}>
                            {tfStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#F8FAFC] mt-1">True or False Only</h4>
                        <div className="text-lg font-extrabold text-[#F8FAFC] mt-2">
                          {tfStatus.approvedCount} <span className="text-xs font-medium text-[#94A3B8]">/ 200 Items</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#26384D] flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'true_false')}
                          className="w-full text-[11px] py-1 h-auto border-[#26384D] text-[#38BDF8] hover:bg-[#1685E8]/10"
                        >
                          Generate 200 Qs
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=true_false`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2 text-[#94A3B8] hover:text-[#F8FAFC]">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Mode 4: Mixed Examination (67 MC, 67 ID, 66 TF) */}
                    <div className="p-4 rounded-2xl border bg-[#101A27] border-[#1685E8]/40 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">Mode 4 (Mixed)</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mixStatus.isReady ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                          }`}>
                            {mixStatus.isReady ? 'Ready ✓' : 'Insufficient'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#F8FAFC] mt-1">Balanced Synthesis</h4>
                        <div className="text-lg font-extrabold text-[#F8FAFC] mt-2">
                          {mixStatus.approvedCount} <span className="text-xs font-medium text-[#94A3B8]">/ 200 Items</span>
                        </div>
                        {mixStatus.breakdown && (
                          <div className="text-[10px] text-[#38BDF8] pt-1 space-x-1 font-semibold">
                            <span>MC: {mixStatus.breakdown.multiple_choice.approved}/67</span>
                            <span className="text-[#94A3B8]">•</span>
                            <span>ID: {mixStatus.breakdown.identification.approved}/67</span>
                            <span className="text-[#94A3B8]">•</span>
                            <span>TF: {mixStatus.breakdown.true_false.approved}/66</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#26384D] flex items-center justify-between gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openGeneratorForMode(mod.id, 'mixed')}
                          className="w-full text-[11px] py-1 h-auto bg-[#1685E8] hover:bg-[#1170c4] text-white border-0"
                        >
                          Generate Mixed (67/67/66)
                        </Button>
                        <Link href={`/admin/questions?moduleId=${mod.id}&examSet=mixed`} className="shrink-0">
                          <Button variant="ghost" size="sm" className="text-[11px] py-1 h-auto px-2 text-[#94A3B8] hover:text-[#F8FAFC]">
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
