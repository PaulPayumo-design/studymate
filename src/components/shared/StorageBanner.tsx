'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Database, CheckCircle2, Key } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function StorageBanner() {
  const { isSupabaseActive } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#EAF3FB]/90 border-b border-[#BFDBFE]/80 px-4 py-2 text-xs text-[#142D4E] flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          {isSupabaseActive ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Supabase Cloud Database Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#142D4E] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
              <Database className="w-3.5 h-3.5 text-[#1565C0]" />
              Active Mode: Local Sandbox & Persistent Browser Storage
            </span>
          )}
          <span className="hidden md:inline text-[#64748B]">
            {isSupabaseActive
              ? 'Real-time PostgreSQL database & authentication are fully engaged.'
              : 'Full functionality enabled: Preloaded 5-module Computer Networks, 30-item exam bank, PDF generator & flashcards.'}
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 font-semibold text-[#1565C0] hover:text-[#142D4E] underline decoration-[#93C5FD] hover:decoration-[#142D4E] transition-colors"
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
        <div className="space-y-4 text-sm text-[#142D4E]">
          <div className="p-4 bg-[#EAF3FB] rounded-2xl border border-[#BFDBFE]">
            <h4 className="font-semibold text-[#142D4E] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1565C0]" />
              Status: {isSupabaseActive ? 'Connected to Cloud' : 'Running in Local Offline Sandbox'}
            </h4>
            <p className="text-xs text-[#64748B] mt-1">
              {isSupabaseActive
                ? 'Your project is syncing with Supabase PostgreSQL and Row Level Security.'
                : 'StudyMate is running with built-in persistent local storage. All features (PDF uploading, question generation, 4 exam modes, 60-item comprehensive exams, flashcard flips) work immediately.'}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-xs text-[#142D4E] uppercase tracking-wider">
              Persistent Local Storage Details
            </h5>
            <p className="text-xs text-[#64748B] leading-relaxed">
              In offline / local mode, your PDF extracted questions, created modules, student exam attempts, and flashcard progress are automatically saved to your browser&apos;s persistent LocalStorage. Data survives page refreshes and browser restarts.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
