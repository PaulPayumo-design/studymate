'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, UserCheck, LogOut, ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { CatMascot } from './CatMascot';

export function Header() {
  const { user, role, switchRole, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

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
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isAdmin
          ? 'bg-[#0B1420]/95 border-[#26384D] text-[#F8FAFC]'
          : 'bg-white/95 border-[#E2EEFC] text-[#142D4E] shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand: Circular PawStudy Cat Nurse Logo Only */}
        <Link
          href={role === 'admin' ? '/admin' : '/student'}
          className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1685E8] rounded-full"
          title="PawStudy Home"
        >
          <CatMascot variant="logo" size={44} className="group-hover:scale-105 transition-transform shrink-0" />
        </Link>

        {/* User Info & Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Switch Role Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRoleToggle}
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl text-xs py-1.5 font-semibold ${
              isAdmin
                ? 'border-[#26384D] text-[#38BDF8] bg-[#101A27] hover:bg-[#1685E8]/10 hover:border-[#1685E8]'
                : 'border-[#BFDBFE] text-[#142D4E] hover:bg-[#EAF3FB] hover:border-[#1565C0]'
            }`}
            title="Switch between Admin and Student mode for testing"
          >
            <ArrowRightLeft className={`w-3.5 h-3.5 ${isAdmin ? 'text-[#38BDF8]' : 'text-[#1565C0]'}`} />
            Switch to {role === 'admin' ? 'Student View' : 'Admin Console'}
          </Button>

          {/* Current User Badge */}
          <div className={`flex items-center gap-2.5 pl-3 border-l ${isAdmin ? 'border-[#26384D]' : 'border-[#E2EEFC]'}`}>
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                isAdmin
                  ? 'bg-[#1685E8]/20 text-[#38BDF8] border-[#1685E8]/30'
                  : 'bg-[#EAF3FB] text-[#1565C0] border-[#BFDBFE]'
              }`}
            >
              {user?.full_name?.charAt(0) || (role === 'admin' ? 'P' : 'S')}
            </div>
            <div className="hidden md:block text-left">
              <div className={`text-xs font-bold flex items-center gap-1.5 ${isAdmin ? 'text-[#F8FAFC]' : 'text-[#142D4E]'}`}>
                <span>{user?.full_name || (role === 'admin' ? 'Paul' : 'Shaina')}</span>
                {role === 'admin' ? (
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border ${
                      isAdmin
                        ? 'bg-[#1685E8]/20 text-[#38BDF8] border-[#1685E8]/30'
                        : 'bg-[#EAF3FB] text-[#1565C0] border-[#BFDBFE]'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    Student
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className={`rounded-xl ${
                isAdmin
                  ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27]'
                  : 'text-[#64748B] hover:text-[#142D4E] hover:bg-[#EAF3FB]'
              }`}
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
