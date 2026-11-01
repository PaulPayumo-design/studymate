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
  Award,
  ArrowRight,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  Clock,
  ListChecks,
  PenTool,
  ToggleLeft,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
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
    { label: 'Total Subjects', value: subjects.length, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100', href: '/admin/subjects' },
    { label: 'Total Weeks', value: modules.length, icon: FolderTree, color: 'text-indigo-600', bg: 'bg-indigo-100', href: '/admin/modules' },
    { label: 'Questions (Approved)', value: `${approvedQuestions} / ${questions.length}`, sub: `${pendingQuestions} pending review`, icon: HelpCircle, color: 'text-purple-700', bg: 'bg-lavender-100', href: '/admin/questions' },
    { label: 'Flashcards', value: flashcards.length, icon: Layers, color: 'text-violet-600', bg: 'bg-violet-100', href: '/admin/flashcards' },
    { label: 'PDF Reviewers', value: reviewers.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', href: '/admin/reviewers' },
    { label: 'Exam Attempts', value: attempts.length, icon: FileCheck2, color: 'text-emerald-600', bg: 'bg-emerald-100', href: '/admin/results' },
    { label: 'Authorized Students', value: students.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100', href: '/admin/students' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            System overview, curriculum structure, PDF reviewers, question bank distribution, and student examination analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/reviewers">
            <Button variant="primary" size="sm" className="gap-2">
              <UploadCloud className="w-4 h-4" />
              Upload PDF Reviewer
            </Button>
          </Link>
          <Link href="/admin/questions">
            <Button variant="outline" size="sm" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Question Bank
            </Button>
          </Link>
          <Link href="/admin/students">
            <Button variant="secondary" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Authorize Student
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link key={idx} href={kpi.href} className="group">
              <Card className="p-4 h-full hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-300 group-hover:text-purple-600 transition-colors" />
                </div>
                <div className="mt-3">
                  <div className="text-lg sm:text-xl font-extrabold text-purple-950">{kpi.value}</div>
                  <div className="text-[11px] font-medium text-purple-600 truncate">{kpi.label}</div>
                  {kpi.sub && <div className="text-[10px] text-amber-600 font-semibold truncate mt-0.5">{kpi.sub}</div>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Dedicated Assessment Sections Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/questions/multiple-choice"
          className="group p-5 rounded-2xl bg-gradient-to-br from-white to-purple-50/50 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ListChecks className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Exam Mode 1
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
              Multiple Choice Management
            </h3>
            <p className="text-xs text-purple-600 mt-1">
              {questions.filter(q => q.question_type === 'multiple_choice').length} questions • Topic AI Generator & choice review
            </p>
          </div>
          <div className="text-xs font-semibold text-purple-700 flex items-center gap-1 pt-1 border-t border-purple-100/60">
            Open MC Console <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/questions/identification"
          className="group p-5 rounded-2xl bg-gradient-to-br from-white to-purple-50/50 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Exam Mode 2
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
              Identification Management
            </h3>
            <p className="text-xs text-purple-600 mt-1">
              {questions.filter(q => q.question_type === 'identification').length} questions • Canonical answers & normalized grading
            </p>
          </div>
          <div className="text-xs font-semibold text-purple-700 flex items-center gap-1 pt-1 border-t border-purple-100/60">
            Open ID Console <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/questions/true-false"
          className="group p-5 rounded-2xl bg-gradient-to-br from-white to-purple-50/50 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ToggleLeft className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Exam Mode 3
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
              True or False Management
            </h3>
            <p className="text-xs text-purple-600 mt-1">
              {questions.filter(q => q.question_type === 'true_false').length} questions • Binary factual verification & review
            </p>
          </div>
          <div className="text-xs font-semibold text-purple-700 flex items-center gap-1 pt-1 border-t border-purple-100/60">
            Open TF Console <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Curriculum & 30-item Weekly Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subject Curriculum & 30-Item Weekly Status</CardTitle>
            <p className="text-xs text-purple-600 mt-0.5">
              Each subject supports up to 10 weeks. Target is 30 approved questions per week.
            </p>
          </div>
          <Link href="/admin/subjects">
            <Button variant="outline" size="sm" className="text-xs">
              Manage Subjects & Weeks
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjects.map(subject => {
              const subModules = modules.filter(m => m.subject_id === subject.id);
              return (
                <div key={subject.id} className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                        {subject.code}
                      </span>
                      <h4 className="font-bold text-base text-purple-950">{subject.title}</h4>
                    </div>
                    <span className="text-xs text-purple-600">
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
                        <div key={mod.id} className="p-3.5 bg-white rounded-xl border border-purple-100 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-900">Week {mod.module_number}</span>
                            {isComplete ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> 30/30
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">
                                {approved}/30 Qs
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-purple-950 font-medium line-clamp-1">{mod.title}</p>
                          <div className="pt-1 flex items-center justify-between text-[11px] text-purple-500 border-t border-purple-50">
                            <span>{modReviewer ? 'PDF Uploaded' : 'No Reviewer'}</span>
                            <Link href={`/admin/modules?moduleId=${mod.id}`} className="text-purple-700 font-semibold hover:underline">
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
        </CardContent>
      </Card>

      {/* Recent Student Examination Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Student Examination Attempts</CardTitle>
            <p className="text-xs text-purple-600 mt-0.5">
              Live records of students taking individual weekly tests and the 60-item Comprehensive Exam.
            </p>
          </div>
          <Link href="/admin/results">
            <Button variant="outline" size="sm" className="text-xs">
              View All Results
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <div className="text-center py-8 text-xs text-purple-500">
              No student examination attempts recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-purple-100 text-purple-600 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Student</th>
                    <th className="pb-3 px-3">Examination</th>
                    <th className="pb-3 px-3">Mode</th>
                    <th className="pb-3 px-3">Score</th>
                    <th className="pb-3 px-3">Percentage</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {attempts.slice(0, 5).map(att => (
                    <tr key={att.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-purple-950">
                        {att.student_name}
                        <div className="text-[10px] text-purple-500 font-normal">{att.student_email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-purple-900">
                          {att.is_comprehensive ? 'Comprehensive Examination (60-Item)' : att.module_title}
                        </span>
                        <div className="text-[10px] text-purple-500">{att.subject_title}</div>
                      </td>
                      <td className="py-3 px-3 capitalize">
                        <Badge variant="purple" size="sm">{att.exam_mode.replace('_', ' ')}</Badge>
                      </td>
                      <td className="py-3 px-3 font-bold text-purple-950">
                        {att.score} / {att.total_items}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold px-2 py-0.5 rounded-full ${
                          att.percentage >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-purple-600">
                        {Math.floor(att.time_spent_seconds / 60)}m {att.time_spent_seconds % 60}s
                      </td>
                      <td className="py-3 px-3 text-purple-500">
                        {formatDate(att.submitted_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
