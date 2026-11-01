'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StudyMateStore } from '@/lib/store';
import { Settings, Database, RefreshCw, Key, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const { isSupabaseActive } = useAuth();
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = () => {
    if (confirm('Reset StudyMate database to default initial state? This re-populates the verified nursing examination suites (CMPA, NLM, MSN), 720-item question bank, and flashcards.')) {
      StudyMateStore.resetToDefault();
      setResetMessage('Local database reset to clean default state successfully.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#26384D]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-[#38BDF8]" />
            System Configuration & Database Integration
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Manage database connectivity, view Supabase synchronization status, and manage system caches.
          </p>
        </div>
      </div>

      {resetMessage && (
        <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/30 rounded-2xl text-[#10B981] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Supabase Status Card */}
      <Card className="bg-[#111C2A] border-[#26384D]">
        <CardHeader className="border-b border-[#26384D]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#F8FAFC] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#38BDF8]" />
              Supabase PostgreSQL & Auth Status
            </CardTitle>
            {isSupabaseActive ? (
              <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-full border border-[#10B981]/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#38BDF8] bg-[#1685E8]/20 px-2.5 py-1 rounded-full border border-[#1685E8]/30">
                Local Sandbox Mode
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {isSupabaseActive
              ? 'StudyMate is actively querying your Supabase project with Row Level Security.'
              : 'StudyMate is running with the built-in persistent local storage. All features are fully functional. To connect your cloud Supabase database, set the environment variables in .env.local.'}
          </p>

          <div className="p-4 bg-[#101A27] rounded-2xl border border-[#26384D] space-y-2">
            <div className="text-xs font-bold text-[#F8FAFC]">Active Database Schema File:</div>
            <div className="font-mono text-xs text-[#38BDF8] break-all bg-[#0B1420] p-2.5 rounded-xl border border-[#26384D]">
              supabase/migrations/20261101_init_studymate_schema.sql
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Run this script directly in your Supabase SQL Editor to initialize all 10 tables, triggers, and Row Level Security policies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Database Reset Action */}
      <Card className="bg-[#111C2A] border-[#26384D]">
        <CardHeader className="border-b border-[#26384D]">
          <CardTitle className="text-lg text-[#EF4444] flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#EF4444]" />
            Reset Local Sample Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Reinitializes the local storage cache with the pre-packaged nursing midterm curriculum (CMPA, NLM, MSN), approved 720-item question banks, and sample test attempts.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2 bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default Dataset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
