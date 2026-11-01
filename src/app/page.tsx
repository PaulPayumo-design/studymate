'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  GraduationCap,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CatMascot } from '@/components/shared/CatMascot';

export default function HomePage() {
  const { user, role, isLoading, switchRole } = useAuth();
  const router = useRouter();

  // If user is already authenticated, immediately route them to their workspace
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === 'admin' ? '/admin' : '/student');
    }
  }, [user, isLoading, router]);

  const handleEnterAs = (targetRole: 'admin' | 'student') => {
    switchRole(targetRole);
    router.push(targetRole === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F4F9FD]">
      {/* Background soft wavy corner graphics */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#1685E8]/10 via-[#EAF3FB] to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-tl from-[#1685E8]/15 via-[#EAF3FB] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Paw prints at corners */}
      <div className="absolute bottom-8 right-12 flex flex-col items-end gap-3 pointer-events-none select-none">
        <CatMascot variant="paw" size={32} className="text-[#1685E8]/25" />
        <CatMascot variant="paw" size={24} className="text-[#1685E8]/20 mr-5" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 my-auto">
        {/* Brand Mascot Hero Title: PAW STUDY PRIVATE */}
        <div className="relative inline-flex flex-col items-center justify-center mx-auto pt-4">
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <CatMascot variant="logo" size={60} className="shadow-md shadow-[#1685E8]/20 rounded-full" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#142D4E] flex items-center gap-2 select-none">
              <span>PAW</span>
              <span className="text-[#1685E8]">STUDY</span>
            </h1>
            <span className="text-xs sm:text-sm font-bold bg-[#E8F3FF] text-[#1685E8] border border-[#BFDBFE] px-3 py-1 rounded-full uppercase tracking-wider select-none">
              PRIVATE
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#64748B] font-medium mt-3 max-w-md mx-auto">
            Private Flashcard & Examination System for Nursing Students
          </p>

          {/* Brush / wave underline */}
          <div className="w-48 sm:w-64 h-1.5 bg-[#93C5FD] rounded-full mx-auto mt-4 opacity-80" />
        </div>

        {/* Two Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-2 text-left">
          {/* Administrator Card */}
          <div className="bg-white rounded-3xl p-7 border border-[#E2EEFC] shadow-xl shadow-[#142D4E]/5 hover:border-[#BFDBFE] hover:shadow-2xl hover:shadow-[#1685E8]/10 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] text-[#1685E8] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#142D4E]">Administrator</h2>
                  <span className="text-[10px] font-bold bg-[#EAF3FB] text-[#1685E8] px-2 py-0.5 rounded-full border border-[#BFDBFE]/70">
                    Console
                  </span>
                </div>
              </div>

              <ul className="text-xs text-[#64748B] space-y-2 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-[#1685E8] text-[10px]">◆</span>
                  <span>PDF text extractor & question generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1685E8] text-[10px]">◆</span>
                  <span>Approval status workflow (Never auto-approves)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1685E8] text-[10px]">◆</span>
                  <span>Authorize & manage student cohorts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleEnterAs('admin')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#142D4E] hover:bg-[#1685E8] text-white font-bold text-sm flex items-center justify-between transition-colors shadow-sm shadow-[#142D4E]/20"
            >
              <span>Launch Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Student Portal Card */}
          <div className="bg-white rounded-3xl p-7 border border-[#BFDBFE] shadow-xl shadow-[#1685E8]/10 hover:border-[#1685E8] hover:shadow-2xl hover:shadow-[#1685E8]/15 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] text-[#1685E8] flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#142D4E]">Student Portal</h2>
                  <span className="text-[10px] font-bold bg-[#EAF3FB] text-[#1685E8] px-2 py-0.5 rounded-full border border-[#BFDBFE]/70">
                    Active
                  </span>
                </div>
              </div>

              <ul className="text-xs text-[#64748B] space-y-2 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-[#1685E8] text-[10px]">◆</span>
                  <span>Interactive 3D flip card study session</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1685E8] text-[10px]">◆</span>
                  <span>4 Exam Modes: MC, Identification, T/F, Mixed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1685E8] text-[10px]">◆</span>
                  <span>60-Item Weekly Exam Suites across 4 modes</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleEnterAs('student')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#1685E8] hover:bg-[#126ec2] text-white font-bold text-sm flex items-center justify-between transition-colors shadow-sm shadow-[#1685E8]/25"
            >
              <span>Open Student Dashboard</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
