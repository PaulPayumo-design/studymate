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
  Award,
  User,
  Menu,
  X,
  LucideIcon,
} from 'lucide-react';
import { CatMascot } from '../shared/CatMascot';

interface StudentNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'Subjects & Weeks', href: '/student/subjects', icon: BookOpen },
  { label: 'Flashcards', href: '/student/flashcards', icon: Layers },
  { label: 'Weekly Exams', href: '/student/exams', icon: FileCheck2 },
  { label: 'Results & History', href: '/student/results', icon: Award },
  { label: 'My Profile', href: '/student/profile', icon: User },
];

function SidebarSleepingNurseCat() {
  return (
    <svg
      width="215"
      height="215"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[215px] h-auto shrink-0 select-none pointer-events-none"
    >
      {/* 1. Soft Light-Blue Oval / Cloud Background */}
      <ellipse cx="110" cy="160" rx="88" ry="50" fill="#DCEEFF" opacity="0.65" />
      <ellipse cx="145" cy="145" rx="45" ry="38" fill="#E8F4FD" opacity="0.85" />
      <ellipse cx="75" cy="148" rx="45" ry="38" fill="#E8F4FD" opacity="0.85" />

      {/* 2. Floating Pastel Blue Paw Prints (Upper Left) */}
      <g transform="translate(64, 48) rotate(-16)" fill="#93C5FD" opacity="0.7">
        <ellipse cx="8" cy="10" rx="4" ry="3.5" />
        <circle cx="3" cy="5" r="1.5" />
        <circle cx="6.5" cy="3" r="1.5" />
        <circle cx="10" cy="3" r="1.5" />
        <circle cx="13" cy="5" r="1.5" />
      </g>
      <g transform="translate(38, 62) rotate(10)" fill="#93C5FD" opacity="0.8">
        <ellipse cx="11" cy="14" rx="5.5" ry="4.8" />
        <circle cx="4" cy="7" r="2.1" />
        <circle cx="9" cy="4.5" r="2.1" />
        <circle cx="14" cy="4.5" r="2.1" />
        <circle cx="18" cy="7" r="2.1" />
      </g>

      {/* 3. Golden Sparkles (Left of Cat's Head) */}
      <line x1="48" y1="124" x2="36" y2="128" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <line x1="51" y1="114" x2="42" y2="105" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

      {/* 4. Stack of 3 Books */}
      {/* Bottom Book (Book 3) */}
      <g>
        <rect x="36" y="180" width="114" height="22" rx="6" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" />
        <rect x="138" y="180" width="46" height="22" rx="6" fill="#1565C0" stroke="#17365D" strokeWidth="2.4" />
        <line x1="46" y1="191" x2="132" y2="191" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 2" />
      </g>

      {/* Middle Book (Book 2 with bookmark ribbon) */}
      <g>
        <rect x="39" y="158" width="110" height="22" rx="6" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" />
        <rect x="135" y="158" width="44" height="22" rx="6" fill="#1565C0" stroke="#17365D" strokeWidth="2.4" />
        <line x1="49" y1="169" x2="129" y2="169" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 2" />
        {/* Blue Ribbon Bookmark with V-notch */}
        <path
          d="M96 163 L112 163 L112 188 L104 182 L96 188 Z"
          fill="#1565C0"
          stroke="#17365D"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* Top Book (Book 1) */}
      <g>
        <rect x="42" y="136" width="104" height="22" rx="6" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" />
        <rect x="132" y="136" width="42" height="22" rx="6" fill="#1565C0" stroke="#17365D" strokeWidth="2.4" />
        <line x1="52" y1="147" x2="126" y2="147" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 2" />
      </g>

      {/* 5. Cat Body Sleeping on Top Book */}
      <ellipse cx="140" cy="128" rx="28" ry="16" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" />

      {/* Cat Tail curled upward around the right side */}
      <path
        d="M165 130 C176 132, 183 142, 177 152 C172 158, 163 158, 158 156"
        stroke="#17365D"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="#FFFFFF"
      />

      {/* Cat Head */}
      <ellipse cx="94" cy="122" rx="20" ry="16" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" />

      {/* Left Ear */}
      <polygon points="76,118 80,102 91,114" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" strokeLinejoin="round" />
      <polygon points="78,117 81,106 89,113" fill="#FBCFE8" />

      {/* Right Ear */}
      <polygon points="107,114 116,102 120,118" fill="#FFFFFF" stroke="#17365D" strokeWidth="2.4" strokeLinejoin="round" />
      <polygon points="109,113 115,106 118,117" fill="#FBCFE8" />

      {/* Nurse Cap with Blue Cross */}
      <path
        d="M89 106 C89 99, 107 99, 107 106 L109 112 C109 113, 87 113, 87 112 Z"
        fill="#FFFFFF"
        stroke="#17365D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="97" y="102" width="2" height="6.5" rx="0.5" fill="#1685E8" />
      <rect x="94.5" y="104.5" width="7" height="2" rx="0.5" fill="#1685E8" />

      {/* Sleeping Eyes (^ ^) */}
      <path d="M84 122 C84 119, 89 119, 89 122" stroke="#17365D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M99 122 C99 119, 104 119, 104 122" stroke="#17365D" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Pink Blush */}
      <ellipse cx="80" cy="125" rx="3.2" ry="1.8" fill="#FB7185" opacity="0.65" />
      <ellipse cx="108" cy="125" rx="3.2" ry="1.8" fill="#FB7185" opacity="0.65" />

      {/* Nose & Mouth (w) */}
      <polygon points="94,125 93,123.5 95,123.5" fill="#17365D" />
      <path d="M94 125 C93.2 127, 91.8 127, 91 126" stroke="#17365D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M94 125 C94.8 127, 96.2 127, 97 126" stroke="#17365D" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Front Paws tucked under chin */}
      <ellipse cx="89" cy="137" rx="6.5" ry="4" fill="#FFFFFF" stroke="#17365D" strokeWidth="2" />
      <ellipse cx="102" cy="137" rx="6.5" ry="4" fill="#FFFFFF" stroke="#17365D" strokeWidth="2" />

      {/* Body Paw */}
      <ellipse cx="140" cy="138" rx="6.5" ry="4" fill="#FFFFFF" stroke="#17365D" strokeWidth="2" />

      {/* 6. Zzz Sleep Symbols (beside head) */}
      <path d="M125 106 L131 106 L125 114 L132 114" stroke="#17365D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M135 92 L143 92 L135 102 L144 102" stroke="#17365D" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M147 76 L158 76 L147 90 L159 90" stroke="#17365D" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* 7. Bottom Base Waves */}
      <path d="M0 210 C50 202, 160 216, 220 206 L220 220 L0 220 Z" fill="#DCEEFF" opacity="0.8" />
      <path d="M0 215 C70 208, 170 218, 220 212 L220 220 L0 220 Z" fill="#BFDBFE" opacity="0.6" />
    </svg>
  );
}

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
                  : 'text-[#142D4E] hover:bg-[#EAF3FB] hover:text-[#1565C0]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-[#64748B]')} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Kawaii Sleeping Nurse Cat on Stack of Books at Sidebar Bottom */}
      <div className="mt-auto pt-4 pb-0 px-2 relative overflow-hidden flex flex-col items-center justify-end select-none pointer-events-none">
        <SidebarSleepingNurseCat />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Trigger Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 rounded-2xl bg-[#1565C0] text-white shadow-lg shadow-[#1565C0]/30 hover:bg-[#0D47A1] transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col shadow-2xl transition-transform duration-200 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E2EEFC] flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>
    </>
  );
}
