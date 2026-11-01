'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  FileText,
  HelpCircle,
  Layers,
  FileCheck2,
  Users,
  Settings,
  GraduationCap,
  ListChecks,
  PenTool,
  ToggleLeft,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isSubItem?: boolean;
}

const ADMIN_NAV_ITEMS: { category?: string; items: NavItem[] }[] = [
  {
    category: 'Curriculum & Content',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
      { label: 'Weeks', href: '/admin/modules', icon: FolderTree },
      { label: 'PDF Reviewers', href: '/admin/reviewers', icon: FileText },
    ],
  },
  {
    category: 'Question Bank & AI',
    items: [
      { label: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
      { label: 'Multiple Choice', href: '/admin/questions/multiple-choice', icon: ListChecks, isSubItem: true },
      { label: 'Identification', href: '/admin/questions/identification', icon: PenTool, isSubItem: true },
      { label: 'True or False', href: '/admin/questions/true-false', icon: ToggleLeft, isSubItem: true },
      { label: 'Flashcards', href: '/admin/flashcards', icon: Layers },
      { label: 'Examinations', href: '/admin/examinations', icon: FileCheck2 },
    ],
  },
  {
    category: 'Administration',
    items: [
      { label: 'Student Results', href: '/admin/results', icon: GraduationCap },
      { label: 'Student Accounts', href: '/admin/students', icon: Users },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navContent = (
    <>
      <div className="p-4 border-b border-[#26384D] flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#38BDF8] bg-[#111C2A] border border-[#26384D] px-2.5 py-1 rounded-lg">
          Administrator Console
        </span>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#111C2A] hover:text-[#F8FAFC]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
        {ADMIN_NAV_ITEMS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.category && (
              <p className="px-3.5 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8] mb-1.5">
                {section.category}
              </p>
            )}
            {section.items.map(item => {
              const isActive =
                item.href === '/admin' || item.href === '/admin/questions'
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    item.isSubItem && 'ml-3 text-xs py-1.5',
                    isActive
                      ? 'bg-[#1685E8] text-white shadow-xs font-semibold'
                      : 'text-[#94A3B8] hover:bg-[#111C2A] hover:text-[#F8FAFC]'
                  )}
                >
                  <Icon className={cn('shrink-0', item.isSubItem ? 'w-3.5 h-3.5' : 'w-4 h-4', isActive ? 'text-white' : 'text-[#94A3B8]')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3.5 border-t border-[#26384D] bg-[#111C2A] m-3 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#1685E8] text-white flex items-center justify-center font-bold text-[10px]">
              N
            </span>
            <span className="text-xs font-semibold text-[#F8FAFC]">1 Insight</span>
          </div>
          <span className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer">✕</span>
        </div>
        <p className="text-[10px] text-[#94A3B8] mt-1.5">
          Strict PDF-sourced question banking & student authorization
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop & Tablet Landscape Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0B1420] border-r border-[#26384D] flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Floating Menu Trigger */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 bg-[#1685E8] hover:bg-[#1270c7] text-white px-4 py-3 rounded-full shadow-lg shadow-[#1685E8]/35 font-bold text-xs transition-all active:scale-95"
        >
          <Menu className="w-4 h-4" />
          <span>Admin Menu</span>
        </button>
      </div>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[#0B1420] border-r border-[#26384D] h-full flex flex-col shadow-2xl z-10 animate-slide-right">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}