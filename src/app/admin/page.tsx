'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import {
  BookOpen,
  FolderTree,
  HelpCircle,
  Layers,
  FileText,
  FileCheck2,
  Users,
  ArrowRight,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  ListChecks,
  PenTool,
  ToggleLeft,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Subject, Module, Question, Flashcard, UploadedReviewer, ExamAttempt, UserProfile } from '@/lib/types';

export default function AdminDashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [reviewers, setReviewers] = useState<UploadedReviewer[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);

  useEffect(() => {
    setSubjects(StudyMateStore.getSubjects());
    setModules(StudyMateStore.getModules());
    setQuestions(StudyMateStore.getQuestions());
    setFlashcards(StudyMateStore.getFlashcards());
    setReviewers(StudyMateStore.getReviewers());
    setAttempts(StudyMateStore.getExamAttempts());
    setStudents(StudyMateStore.getStudents());
  }, []);

  const approvedQuestions = questions.filter(q => q.approval_status === 'approved').length;
  const pendingQuestions = questions.filter(q => q.approval_status === 'pending').length;

  const kpis = [
    { label: 'Total Subjects', value: subjects.length, icon: BookOpen, color: 'text-[#38BDF8]', bg: 'bg-[#1685E8]/15', href: '/admin/subjects' },
    { label: 'Total Weeks', value: modules.length, icon: FolderTree, color: 'text-[#38BDF8]', bg: 'bg-[#1685E8]/15', href: '/admin/modules' },
    { label: 'Questions (Approved)', value: `${approvedQuestions} / ${questions.length}`, sub: `${pendingQuestions} pending review`, isApproved: true, icon: HelpCircle, color: 'text-[#38BDF8]', bg: 'bg-[#1685E8]/15', href: '/admin/questions' },
    { label: 'Flashcards', value: flashcards.length, icon: Layers, color: 'text-[#38BDF8]', bg: 'bg-[#1685E8]/15', href: '/admin/flashcards' },
    { label: 'PDF Reviewers', value: reviewers.length, icon: FileText, color: 'text-[#38BDF8]', bg: 'bg-[#1685E8]/15', href: '/admin/reviewers' },
    { label: 'Exam Attempts', value: attempts.length, icon: FileCheck2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', href: '/admin/results' },
    { label: 'Authorized Students', value: students.length, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/15', href: '/admin/students' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto text-[#F8FAFC] min-w-0 w-full overflow-hidden">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26384D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            System overview, curriculum structure, PDF reviewers, question bank distribution, and student examination analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/reviewers">
            <button className="inline-flex items-center gap-2 bg-[#1685E8] hover:bg-[#1270c7] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              <span>Upload PDF Reviewer</span>
            </button>
          </Link>
          <Link href="/admin/questions">
            <button className="inline-flex items-center gap-2 bg-[#101A27] hover:bg-[#111C2A] text-[#F8FAFC] border border-[#26384D] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer">
              <PlusCircle className="w-4 h-4 text-[#38BDF8]" />
              <span>Question Bank</span>
            </button>
          </Link>
          <Link href="/admin/students">
            <button className="inline-flex items-center gap-2 bg-[#101A27] hover:bg-[#111C2A] text-[#F8FAFC] border border-[#26384D] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer">
              <Users className="w-4 h-4 text-[#38BDF8]" />
              <span>Authorize Student</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link key={idx} href={kpi.href} className="group">
              <div className="p-4 h-full rounded-2xl bg-[#101A27] border border-[#26384D] hover:border-[#38BDF8]/60 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-3">
                  <div className="text-lg sm:text-xl font-black text-[#F8FAFC]">{kpi.value}</div>
                  <div className={cn("text-[11px] font-medium truncate", kpi.isApproved ? "text-[#38BDF8] font-semibold" : "text-[#94A3B8]")}>
                    {kpi.label}
                  </div>
                  {kpi.sub && <div className="text-[10px] text-[#F59E0B] font-semibold truncate mt-0.5">{kpi.sub}</div>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dedicated Assessment Sections Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/questions/multiple-choice"
          className="group p-5 rounded-2xl bg-[#101A27] border border-[#26384D] hover:border-[#1685E8] shadow-xs transition-all flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#1685E8]/20 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#1685E8] group-hover:text-white transition-colors">
              <ListChecks className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#38BDF8] bg-[#111C2A] px-2.5 py-0.5 rounded-full border border-[#26384D]">
              Exam Mode 1
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
              Multiple Choice Management
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              {questions.filter(q => q.question_type === 'multiple_choice').length} questions • Topic AI Generator & choice review
            </p>
          </div>
          <div className="text-xs font-semibold text-[#38BDF8] flex items-center gap-1 pt-2 border-t border-[#26384D]">
            Open MC Console <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/questions/identification"
          className="group p-5 rounded-2xl bg-[#101A27] border border-[#26384D] hover:border-[#1685E8] shadow-xs transition-all flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#1685E8]/20 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#1685E8] group-hover:text-white transition-colors">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#38BDF8] bg-[#111C2A] px-2.5 py-0.5 rounded-full border border-[#26384D]">
              Exam Mode 2
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
              Identification Management
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              {questions.filter(q => q.question_type === 'identification').length} questions • Canonical answers & normalized grading
            </p>
          </div>
          <div className="text-xs font-semibold text-[#38BDF8] flex items-center gap-1 pt-2 border-t border-[#26384D]">
            Open ID Console <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/questions/true-false"
          className="group p-5 rounded-2xl bg-[#101A27] border border-[#26384D] hover:border-[#1685E8] shadow-xs transition-all flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#1685E8]/20 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#1685E8] group-hover:text-white transition-colors">
              <ToggleLeft className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#38BDF8] bg-[#111C2A] px-2.5 py-0.5 rounded-full border border-[#26384D]">
              Exam Mode 3
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
              True or False Management
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              {questions.filter(q => q.question_type === 'true_false').length} questions • Binary factual verification & review
            </p>
          </div>
          <div className="text-xs font-semibold text-[#38BDF8] flex items-center gap-1 pt-2 border-t border-[#26384D]">
            Open TF Console <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Curriculum & 30-item Weekly Status */}
      <div className="p-6 rounded-2xl bg-[#111C2A] border border-[#26384D] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#26384D]/70">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Subject Curriculum & 30-Item Weekly Status</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Each subject supports up to 10 weeks. Target is 30 approved questions per week.
            </p>
          </div>
          <Link href="/admin/subjects">
            <button className="bg-[#101A27] hover:bg-[#1685E8]/20 text-[#F8FAFC] border border-[#26384D] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer">
              Manage Subjects & Weeks
            </button>
          </Link>
        </div>

        <div className="space-y-4">
          {subjects.map(subject => {
            const subModules = modules.filter(m => m.subject_id === subject.id);
            return (
              <div key={subject.id} className="p-5 rounded-2xl bg-[#0B1420] border border-[#26384D] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold bg-[#1685E8]/20 text-[#38BDF8] border border-[#1685E8]/40 px-2 py-0.5 rounded-md">
                      {subject.code}
                    </span>
                    <h4 className="font-bold text-base text-[#F8FAFC]">{subject.title}</h4>
                  </div>
                  <span className="text-xs text-[#38BDF8] font-medium">
                    {subModules.length} Weeks Configured
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {subModules.map(mod => {
                    const modReviewer = reviewers.find(r => r.module_id === mod.id);
                    const modQuestions = questions.filter(q => q.module_id === mod.id);
                    const approved = modQuestions.filter(q => q.approval_status === 'approved').length;
                    const isComplete = approved >= 30;

                    return (
                      <div key={mod.id} className="p-3.5 bg-[#111C2A] rounded-xl border border-[#26384D] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#F8FAFC]">Week {mod.module_number}</span>
                          {isComplete ? (
                            <span className="text-[10px] font-bold text-[#10B981] bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-[#10B981]" /> 30/30
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#94A3B8] bg-[#101A27] border border-[#26384D] px-1.5 py-0.5 rounded-full">
                              {approved}/30 Qs
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#F8FAFC] font-medium line-clamp-1">{mod.title}</p>
                        <div className="pt-1 flex items-center justify-between text-[11px] border-t border-[#26384D]/60">
                          <span className="text-[#38BDF8] text-[10px] font-medium">{modReviewer ? 'PDF Uploaded' : 'No Reviewer'}</span>
                          <Link href={`/admin/modules?moduleId=${mod.id}`} className="text-[#38BDF8] font-semibold text-[10px] hover:underline">
                            Config →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Student Examination Results */}
      <div className="p-6 rounded-2xl bg-[#111C2A] border border-[#26384D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#26384D]/70">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Recent Student Examination Attempts</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Live records of students taking individual weekly tests across all examination modes.
            </p>
          </div>
          <Link href="/admin/results">
            <button className="bg-[#101A27] hover:bg-[#1685E8]/20 text-[#F8FAFC] border border-[#26384D] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer">
              View All Results
            </button>
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#94A3B8]">
            No student examination attempts recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#26384D] text-[#94A3B8] uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Student</th>
                  <th className="pb-3 px-3">Examination</th>
                  <th className="pb-3 px-3">Mode</th>
                  <th className="pb-3 px-3">Score</th>
                  <th className="pb-3 px-3">Percentage</th>
                  <th className="pb-3 px-3">Duration</th>
                  <th className="pb-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26384D]/60">
                {attempts.slice(0, 5).map(att => (
                  <tr key={att.id} className="hover:bg-[#101A27]/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#F8FAFC]">
                      {att.student_name}
                      <div className="text-[10px] text-[#94A3B8] font-normal">{att.student_email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-[#F8FAFC]">
                        {att.is_comprehensive ? 'Comprehensive Examination (60-Item)' : att.module_title}
                      </span>
                      <div className="text-[10px] text-[#94A3B8]">{att.subject_title}</div>
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <span className="bg-[#1685E8]/20 text-[#38BDF8] border border-[#1685E8]/40 px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block">
                        {att.exam_mode.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#F8FAFC]">
                      {att.score} / {att.total_items}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] border ${
                        att.percentage >= 75
                          ? 'bg-emerald-950/70 text-[#10B981] border-emerald-500/30'
                          : 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                      }`}>
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#94A3B8]">
                      {Math.floor(att.time_spent_seconds / 60)}m {att.time_spent_seconds % 60}s
                    </td>
                    <td className="py-3 px-3 text-[#94A3B8]">
                      {formatDate(att.submitted_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
