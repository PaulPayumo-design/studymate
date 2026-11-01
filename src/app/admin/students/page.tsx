'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudyMateStore } from '@/lib/store';
import { UserProfile, ExamAttempt } from '@/lib/types';
import { Users, UserPlus, ShieldCheck, Mail, Calendar, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function StudentsManagerPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = () => {
    setStudents(StudyMateStore.getStudents());
    setAttempts(StudyMateStore.getExamAttempts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const created = StudyMateStore.createStudent(fullName, email);
      setFullName('');
      setEmail('');
      setIsCreateOpen(false);
      setSuccess(`Student account for "${created.full_name}" has been authorized successfully.`);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to authorize student account.';
      setError(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#26384D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#38BDF8]" />
            Authorized Student Accounts
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Private system access control. Only the administrator may authorize and issue student credentials. Public registration is permanently closed.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-[#1685E8] hover:bg-[#1170c4] text-white border-0"
        >
          <UserPlus className="w-4 h-4" />
          Authorize New Student
        </Button>
      </div>

      {success && (
        <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/30 rounded-2xl text-[#10B981] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Students List */}
      <Card className="bg-[#111C2A] border-[#26384D]">
        <CardHeader className="border-b border-[#26384D]">
          <CardTitle className="text-[#F8FAFC]">Enrolled Student Directory ({students.length})</CardTitle>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Students authorized to study flashcards and take weekly examinations across all 4 modes.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#26384D] text-[#38BDF8] uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Student Name</th>
                  <th className="pb-3 px-3">Email Address</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">Date Authorized</th>
                  <th className="pb-3 px-3">Exams Taken</th>
                  <th className="pb-3 px-3">Average Score</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26384D]">
                {students.map(student => {
                  const studentAttempts = attempts.filter(a => a.student_id === student.id);
                  const avgScore =
                    studentAttempts.length > 0
                      ? (
                          studentAttempts.reduce((sum, a) => sum + a.percentage, 0) /
                          studentAttempts.length
                        ).toFixed(1)
                      : 'None';

                  return (
                    <tr key={student.id} className="hover:bg-[#101A27] transition-colors">
                      <td className="py-3.5 px-3 font-bold text-[#F8FAFC] flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1685E8]/20 text-[#38BDF8] border border-[#1685E8]/30 font-bold flex items-center justify-center text-xs">
                          {student.full_name.charAt(0)}
                        </div>
                        {student.full_name}
                      </td>
                      <td className="py-3.5 px-3 text-[#38BDF8] font-mono">
                        {student.email}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30 text-[11px]">
                          Authorized Student
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[#94A3B8]">
                        {formatDate(student.created_at)}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#F8FAFC]">
                        {studentAttempts.length} Attempts
                      </td>
                      <td className="py-3.5 px-3">
                        {avgScore !== 'None' ? (
                          <span className="font-bold text-[#F8FAFC]">{avgScore}%</span>
                        ) : (
                          <span className="text-[#94A3B8]/60">No attempts yet</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link href={`/admin/results?studentId=${student.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1 h-7 border-[#26384D] text-[#38BDF8] hover:bg-[#1685E8]/10"
                          >
                            View History
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Authorize New Student */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setError(null);
        }}
        title="Authorize New Student Account"
        description="Creates an authorized student record. Public self-registration is disabled."
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-xl text-[#EF4444] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Student Full Name"
            placeholder="e.g. Maria Santos"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. maria@studymate.local"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            helperText="The student will sign in using this authorized email."
          />

          <div className="p-3 bg-[#101A27] rounded-xl border border-[#26384D] text-xs text-[#94A3B8] space-y-1">
            <p className="font-semibold text-[#F8FAFC]">Role Permissions:</p>
            <p>• Access assigned subjects and modules</p>
            <p>• Interactive flashcard flip study</p>
            <p>• Sit for 60-item weekly module exams across 4 modes</p>
            <p>• No access to admin management console or question keys</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateOpen(false)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-[#1685E8] hover:bg-[#1170c4] text-white border-0"
            >
              Authorize Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
