'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, UserCheck, LogOut, ArrowRightLeft, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { CatMascot } from './CatMascot';

export function Header() {
  const { user, role, switchRole, logout } = useAuth();
  const router = useRouter();

  const handleRoleToggle = () => {
    if (role === 'admin') {
      switchRole('student');
      router.push('/student');
    } else {
      switchRole('admin');
      router.push('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2EEFC] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href={role === 'admin' ? '/admin' : '/student'} className="flex items-center gap-2.5 group">
          <CatMascot variant="logo" size={38} className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-[#142D4E]">
                STUDYMATE
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#EAF3FB] text-[#1565C0] px-1.5 py-0.5 rounded border border-[#BFDBFE]/70">
                PRIVATE
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-medium leading-none mt-0.5">
              Flashcards & Examination System
            </p>
          </div>
        </Link>

        {/* User Info & Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Switch Role Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRoleToggle}
            className="hidden sm:inline-flex items-center gap-1.5 border-[#BFDBFE] text-[#142D4E] hover:bg-[#EAF3FB] hover:border-[#1565C0] rounded-xl text-xs py-1.5 font-semibold"
            title="Switch between Admin and Student mode for testing"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#1565C0]" />
            Switch to {role === 'admin' ? 'Student View' : 'Admin Console'}
          </Button>

          {/* Current User Badge */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2EEFC]">
            <div className="w-8 h-8 rounded-full bg-[#EAF3FB] border border-[#BFDBFE] flex items-center justify-center text-xs font-bold text-[#1565C0]">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-[#142D4E] flex items-center gap-1.5">
                <span>{user?.full_name || 'Shaina'}</span>
                {role === 'admin' ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#1565C0] bg-[#EAF3FB] px-1.5 py-0.2 rounded-full border border-[#BFDBFE]">
                    <ShieldCheck className="w-3 h-3 text-[#1565C0]" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    Student
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] truncate max-w-[140px]">
                {user?.email || 'student@studymate.local'}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-[#64748B] hover:text-[#142D4E] hover:bg-[#EAF3FB] rounded-xl"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
