'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileCheck2,
  Sparkles,
  Award,
  User,
  Menu,
  X,
} from 'lucide-react';
import { CatMascot } from '../shared/CatMascot';

const STUDENT_NAV_ITEMS = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'Subjects & Weeks', href: '/student/subjects', icon: BookOpen },
  { label: 'Flashcards', href: '/student/flashcards', icon: Layers },
  { label: 'Weekly Exams', href: '/student/exams', icon: FileCheck2 },
  { label: 'Comprehensive Exam', href: '/student/comprehensive', icon: Sparkles, highlight: true },
  { label: 'Results & History', href: '/student/results', icon: Award },
  { label: 'My Profile', href: '/student/profile', icon: User },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Automatically close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navContent = (
    <>
      <div className="p-4 border-b border-[#F0F6FD] flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#1565C0] bg-[#EAF3FB] px-2.5 py-1 rounded-lg border border-[#BFDBFE]/60">
          STUDENT LEARNING PORTAL
        </span>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#142D4E] hover:bg-[#EAF3FB]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        {STUDENT_NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-[#1565C0] text-white shadow-sm shadow-[#1565C0]/25'
                  : 'text-[#142D4E] hover:bg-[#EAF3FB] hover:text-[#1565C0]',
                item.highlight && !isActive && 'text-[#1565C0] bg-[#F4F9FD]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : item.highlight ? 'text-[#1565C0]' : 'text-[#64748B]')} />
                <span>{item.label}</span>
              </div>
              {item.highlight && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EAF3FB] text-[#1565C0] border border-[#BFDBFE]/80'
                  )}
                >
                  60-Item
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Subtle Bottom Cat Paw Decoration */}
      <div className="p-4 relative overflow-hidden flex items-end justify-between select-none pointer-events-none">
        <div className="space-y-1">
          <CatMascot variant="paw" size={28} className="text-[#3B82C4]/20" />
          <CatMascot variant="paw" size={20} className="text-[#3B82C4]/15 ml-4" />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop & Tablet Landscape Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E2EEFC] flex-col shrink-0 min-h-[calc(100vh-4rem)] relative">
        {navContent}
      </aside>

      {/* 2. Mobile Floating Menu Trigger (Only visible on small screens < md) */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 bg-[#1565C0] hover:bg-[#142D4E] text-white px-4 py-3 rounded-full shadow-lg shadow-[#1565C0]/35 font-bold text-xs transition-all active:scale-95"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* 3. Mobile Slide-Over Drawer with Backdrop (Only on small screens < md) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-[#142D4E]/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer content */}
          <aside className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col shadow-2xl z-10 animate-slide-right">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}