'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  GraduationCap,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { CatMascot } from '@/components/shared/CatMascot';

export default function HomePage() {
  const { switchRole } = useAuth();
  const router = useRouter();

  const handleEnterAs = (targetRole: 'admin' | 'student') => {
    switchRole(targetRole);
    router.push(targetRole === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F4F9FD]">
      {/* Background soft wavy corner graphics */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#3B82C4]/15 via-[#EAF3FB] to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-tl from-[#3B82C4]/20 via-[#EAF3FB] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Paw prints at corners */}
      <div className="absolute bottom-8 right-12 flex flex-col items-end gap-3 pointer-events-none select-none">
        <CatMascot variant="paw" size={32} className="text-[#3B82C4]/30" />
        <CatMascot variant="paw" size={24} className="text-[#3B82C4]/25 mr-5" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-10 my-auto">
        {/* Brand Mascot Hero Title */}
        <div className="relative inline-block mx-auto pt-6">
          {/* Sparkles around logo */}
          <div className="absolute -left-8 top-1 flex flex-col gap-1 items-end pointer-events-none select-none text-[#3B82C4]">
            <span className="w-1.5 h-4 bg-[#3B82C4] rounded-full rotate-[-35deg]" />
            <span className="w-2 h-4 bg-[#3B82C4] rounded-full rotate-[-65deg]" />
          </div>
          <div className="absolute -right-8 top-1 flex flex-col gap-1 items-start pointer-events-none select-none text-[#3B82C4]">
            <span className="w-1.5 h-4 bg-[#3B82C4] rounded-full rotate-[35deg]" />
            <span className="w-2 h-4 bg-[#3B82C4] rounded-full rotate-[65deg]" />
          </div>

          {/* Resting Cat Mascot on Top of Title */}
          <div className="absolute -top-11 right-6 sm:right-10 z-10 pointer-events-none">
            <CatMascot variant="brand-hero" size={90} />
          </div>

          <h1 className="text-5xl sm:text-7xl font-black italic tracking-tight text-[#142D4E] select-none">
            STUDY<span className="text-[#1565C0]">MATE</span>
          </h1>

          {/* Brush / wave underline */}
          <div className="w-48 sm:w-64 h-1.5 bg-[#93C5FD] rounded-full mx-auto mt-2 opacity-80" />
        </div>

        {/* Two Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-2 text-left">
          {/* Administrator Card */}
          <div className="bg-white rounded-3xl p-7 border border-[#E2EEFC] shadow-xl shadow-[#142D4E]/5 hover:border-[#BFDBFE] hover:shadow-2xl hover:shadow-[#1565C0]/10 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] text-[#1565C0] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#142D4E]">Administrator</h2>
                  <span className="text-[10px] font-bold bg-[#EAF3FB] text-[#1565C0] px-2 py-0.5 rounded-full border border-[#BFDBFE]/70">
                    Owner
                  </span>
                </div>
              </div>

              <ul className="text-xs text-[#142D4E]/90 space-y-2 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-[#1565C0] text-[10px]">◆</span>
                  <span>PDF text extractor & question generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1565C0] text-[10px]">◆</span>
                  <span>Approval status workflow (Never auto-approves)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1565C0] text-[10px]">◆</span>
                  <span>Authorize & create student accounts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleEnterAs('admin')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-[#142D4E] text-white font-bold text-sm flex items-center justify-between transition-colors shadow-sm shadow-[#1565C0]/20"
            >
              <span>Launch Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Student Portal Card */}
          <div className="bg-white rounded-3xl p-7 border border-[#E2EEFC] shadow-xl shadow-[#142D4E]/5 hover:border-[#BFDBFE] hover:shadow-2xl hover:shadow-[#1565C0]/10 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] text-[#1565C0] flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#142D4E]">Student Portal</h2>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    Authorized
                  </span>
                </div>
              </div>

              <ul className="text-xs text-[#142D4E]/90 space-y-2 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-[#1565C0] text-[10px]">◆</span>
                  <span>Interactive 3D flip card study session</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1565C0] text-[10px]">◆</span>
                  <span>4 Exam Modes: MC, Identification, T/F, Mixed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#1565C0] text-[10px]">◆</span>
                  <span>60-Item Comprehensive Exam (12 from 5 modules)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleEnterAs('student')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#EAF3FB] hover:bg-[#D5E8F8] text-[#142D4E] font-bold text-sm flex items-center justify-between transition-colors border border-[#BFDBFE]/80"
            >
              <span>Open Student Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#1565C0]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
