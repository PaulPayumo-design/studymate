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
      <div className="p-4 border-b border-purple-50 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
          Administrator Console
        </span>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-purple-600 hover:bg-purple-50"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
        {ADMIN_NAV_ITEMS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.category && (
              <p className="px-3.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-400 mb-1.5">
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
                      ? 'bg-purple-600 text-white shadow-xs font-semibold'
                      : 'text-purple-800 hover:bg-purple-50/80 hover:text-purple-950'
                  )}
                >
                  <Icon className={cn('shrink-0', item.isSubItem ? 'w-3.5 h-3.5' : 'w-4 h-4', isActive ? 'text-white' : 'text-purple-500')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-purple-50 bg-purple-50/40 m-3 rounded-2xl">
        <p className="text-xs font-semibold text-purple-900">StudyMate Control Center</p>
        <p className="text-[11px] text-purple-600 mt-0.5">Strict PDF-sourced question banking & student authorization</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop & Tablet Landscape Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-purple-100 flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Floating Menu Trigger */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-800 text-white px-4 py-3 rounded-full shadow-lg shadow-purple-600/35 font-bold text-xs transition-all active:scale-95"
        >
          <Menu className="w-4 h-4" />
          <span>Admin Menu</span>
        </button>
      </div>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col shadow-2xl z-10 animate-slide-right">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}