'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Database, CheckCircle2, Key } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function StorageBanner() {
  const { isSupabaseActive } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      <div
        className={`px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs transition-colors ${
          isAdmin
            ? 'bg-[#0B1420] border-b border-[#26384D] text-[#F8FAFC]'
            : 'bg-[#EAF3FB]/90 border-b border-[#BFDBFE]/80 text-[#142D4E]'
        }`}
      >
        <div className="flex items-center gap-2">
          {isSupabaseActive ? (
            <span
              className={`inline-flex items-center gap-1.5 font-semibold px-2.5 py-0.5 rounded-full border ${
                isAdmin
                  ? 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/30'
                  : 'text-emerald-800 bg-emerald-100/80 border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Supabase Cloud Database Connected
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1.5 font-semibold px-2.5 py-0.5 rounded-full border ${
                isAdmin
                  ? 'text-[#38BDF8] bg-[#101A27] border-[#26384D]'
                  : 'text-[#142D4E] bg-white/90 border-[#BFDBFE]'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isAdmin ? 'text-[#38BDF8]' : 'text-[#1565C0]'}`} />
              Active Mode: Local Sandbox & Persistent Browser Storage
            </span>
          )}
          <span className={`hidden md:inline ${isAdmin ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            {isSupabaseActive
              ? 'Real-time PostgreSQL database & authentication are fully engaged.'
              : 'Full functionality enabled: Preloaded 720 verified questions, 180 flashcards & weekly examination suites.'}
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-1 font-semibold underline transition-colors ${
            isAdmin
              ? 'text-[#38BDF8] hover:text-[#F8FAFC] decoration-[#38BDF8]/50 hover:decoration-[#F8FAFC]'
              : 'text-[#1565C0] hover:text-[#142D4E] decoration-[#93C5FD] hover:decoration-[#142D4E]'
          }`}
        >
          <Key className="w-3 h-3" />
          {isSupabaseActive ? 'View Database Info' : 'Connect Supabase'}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Supabase PostgreSQL & Auth Setup"
        description="StudyMate supports both full Supabase Cloud and standalone local offline sandbox mode."
        maxWidth="2xl"
      >
        <div className={`space-y-4 text-sm ${isAdmin ? 'text-[#F8FAFC]' : 'text-[#142D4E]'}`}>
          <div
            className={`p-4 rounded-2xl border ${
              isAdmin
                ? 'bg-[#101A27] border-[#26384D]'
                : 'bg-[#EAF3FB] border-[#BFDBFE]'
            }`}
          >
            <h4 className={`font-semibold flex items-center gap-2 ${isAdmin ? 'text-[#F8FAFC]' : 'text-[#142D4E]'}`}>
              <Database className={`w-4 h-4 ${isAdmin ? 'text-[#38BDF8]' : 'text-[#1565C0]'}`} />
              Status: {isSupabaseActive ? 'Connected to Cloud' : 'Running in Local Offline Sandbox'}
            </h4>
            <p className={`text-xs mt-1 ${isAdmin ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {isSupabaseActive
                ? 'Your project is syncing with Supabase PostgreSQL and Row Level Security.'
                : 'StudyMate is running with built-in persistent local storage. All features (PDF uploading, question generation, 4 exam modes, 200-item weekly exams, flashcard flips) work immediately.'}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className={`font-semibold text-xs uppercase tracking-wider ${isAdmin ? 'text-[#38BDF8]' : 'text-[#142D4E]'}`}>
              Persistent Local Storage Details
            </h5>
            <p className={`text-xs leading-relaxed ${isAdmin ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              In offline / local mode, your PDF extracted questions, created modules, student exam attempts, and flashcard progress are automatically saved to your browser&apos;s persistent LocalStorage. Data survives page refreshes and browser restarts.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className={isAdmin ? 'bg-[#1685E8] hover:bg-[#1170c4] text-white border-0' : ''}
            >
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
