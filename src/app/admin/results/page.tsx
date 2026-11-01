'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudyMateStore } from '@/lib/store';
import { ExamAttempt, UserProfile, Subject } from '@/lib/types';
import { Award, Search, Filter, Eye, CheckCircle2, XCircle, Clock, Calendar, BarChart3, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatSeconds } from '@/lib/utils';

function AdminResultsContent() {
  const searchParams = useSearchParams();
  const filterStudentId = searchParams.get('studentId');

  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(filterStudentId || '');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    setAttempts(StudyMateStore.getExamAttempts());
    setStudents(StudyMateStore.getStudents());
    setSubjects(StudyMateStore.getSubjects());
    if (filterStudentId) {
      setSelectedStudentId(filterStudentId);
    }
  }, [filterStudentId]);

  const filteredAttempts = attempts.filter(att => {
    if (selectedStudentId && att.student_id !== selectedStudentId) return false;
    if (selectedExamType === 'comprehensive' && !att.is_comprehensive) return false;
    if (selectedExamType === 'module' && att.is_comprehensive) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        att.student_name?.toLowerCase().includes(q) ||
        att.subject_title?.toLowerCase().includes(q) ||
        att.module_title?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-purple-600" />
            Student Examination Analytics & History
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Review live scores, duration, weekly breakdowns, and answer logs for all authorized students across 30-item weekly tests and 60-item Comprehensive Exams.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900/80 mb-1">
                Filter by Student
              </label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-950 text-xs font-medium"
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
              >
                <option value="">All Students ({students.length})</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900/80 mb-1">
                Exam Type
              </label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-950 text-xs font-medium"
                value={selectedExamType}
                onChange={e => setSelectedExamType(e.target.value)}
              >
                <option value="all">All Examinations</option>
                <option value="module">Individual Weekly Exams (30-Item)</option>
                <option value="comprehensive">Comprehensive Exams (60-Item)</option>
              </select>
            </div>

            <div className="relative flex items-end">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 bottom-3" />
              <input
                type="text"
                placeholder="Search by student, subject, or week..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-950 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recorded Submissions ({filteredAttempts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-10 text-xs text-purple-500">
              No examination records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-purple-100 text-purple-600 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Student</th>
                    <th className="pb-3 px-3">Examination Title</th>
                    <th className="pb-3 px-3">Mode</th>
                    <th className="pb-3 px-3">Score</th>
                    <th className="pb-3 px-3">Percentage</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {filteredAttempts.map(att => (
                    <tr key={att.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-purple-950">
                        {att.student_name}
                        <div className="text-[10px] text-purple-500 font-normal">{att.student_email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-purple-900">
                          {att.is_comprehensive ? 'Comprehensive Examination (60-Item)' : (att.module_title?.replace('Module', 'Week') || 'Weekly Exam')}
                        </span>
                        <div className="text-[10px] text-purple-500">{att.subject_title}</div>
                      </td>
                      <td className="py-3 px-3 capitalize">
                        <Badge variant="purple" size="sm">
                          {att.exam_mode.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-bold text-purple-950">
                        {att.score} / {att.total_items}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                          att.percentage >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-purple-600">
                        {formatSeconds(att.time_spent_seconds)}
                      </td>
                      <td className="py-3 px-3 text-purple-500">
                        {formatDate(att.submitted_at)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveAttempt(att)}
                          className="text-xs py-1 h-7 gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Detailed Attempt Review */}
      {activeAttempt && (
        <Modal
          isOpen={true}
          onClose={() => setActiveAttempt(null)}
          title={`Exam Report: ${activeAttempt.student_name}`}
          description={`${activeAttempt.subject_title} • ${activeAttempt.is_comprehensive ? 'Comprehensive Exam (60-Item)' : (activeAttempt.module_title?.replace('Module', 'Week') || 'Weekly Exam')}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-purple-500">Score</span>
                <p className="text-xl font-extrabold text-purple-950 mt-0.5">
                  {activeAttempt.score} / {activeAttempt.total_items}
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-purple-500">Percentage</span>
                <p className={`text-xl font-extrabold mt-0.5 ${
                  activeAttempt.percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {activeAttempt.percentage}%
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-purple-500">Duration</span>
                <p className="text-xl font-extrabold text-purple-950 mt-0.5">
                  {formatSeconds(activeAttempt.time_spent_seconds)}
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-purple-500">Mode</span>
                <p className="text-sm font-bold text-purple-900 capitalize mt-1.5">
                  {activeAttempt.exam_mode.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Performance by Weekly Breakdown */}
            {activeAttempt.module_breakdown && activeAttempt.module_breakdown.length > 0 && (
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  Performance by Curriculum Week
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {activeAttempt.module_breakdown.map(mb => (
                    <div key={mb.module_id} className="p-3 bg-white rounded-xl border border-purple-100 text-xs">
                      <div className="font-bold text-purple-950">Week {mb.module_number}</div>
                      <div className="text-[11px] text-purple-600 line-clamp-1">{mb.module_title?.replace('Module', 'Week')}</div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-purple-50">
                        <span className="font-bold text-purple-950">{mb.correct_count}/{mb.total_questions}</span>
                        <span className="font-semibold text-purple-700">{mb.score_percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance by Question Type */}
            {activeAttempt.type_breakdown && (
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Performance by Question Type
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeAttempt.type_breakdown.map(tb => (
                    <div key={tb.question_type} className="p-3 bg-white rounded-xl border border-purple-100 text-xs">
                      <span className="font-bold capitalize text-purple-950">
                        {tb.question_type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-purple-600">Correct: {tb.correct_count} / {tb.total_questions}</span>
                        <span className="font-bold text-purple-800">{tb.score_percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={() => setActiveAttempt(null)}>
                Close Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AdminResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-purple-600">Loading exam results...</div>}>
      <AdminResultsContent />
    </Suspense>
  );
}
