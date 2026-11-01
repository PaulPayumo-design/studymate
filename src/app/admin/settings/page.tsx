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
    if (confirm('Reset StudyMate database to default initial state? This re-populates the 5 Computer Networks modules, 30-item question bank, and sample flashcards.')) {
      StudyMateStore.resetToDefault();
      setResetMessage('Local database reset to clean default state successfully.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-purple-600" />
            System Configuration & Database Integration
          </h1>
          <p className="text-xs sm:text-sm text-purple-600/80 mt-1">
            Manage database connectivity, view Supabase synchronization status, and manage system caches.
          </p>
        </div>
      </div>

      {resetMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Supabase Status Card */}
      <Card className="border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Supabase PostgreSQL & Auth Status
            </CardTitle>
            {isSupabaseActive ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="text-xs font-semibold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                Local Sandbox Mode
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-purple-700 leading-relaxed">
            {isSupabaseActive
              ? 'StudyMate is actively querying your Supabase project with Row Level Security.'
              : 'StudyMate is running with the built-in persistent local storage. All features are fully functional. To connect your cloud Supabase database, set the environment variables in .env.local.'}
          </p>

          <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-2">
            <div className="text-xs font-bold text-purple-950">Active Database Schema File:</div>
            <div className="font-mono text-xs text-purple-800 break-all bg-white p-2.5 rounded-xl border border-purple-200">
              supabase/migrations/20261101_init_studymate_schema.sql
            </div>
            <p className="text-[11px] text-purple-600">
              Run this script directly in your Supabase SQL Editor to initialize all 10 tables, triggers, and Row Level Security policies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Database Reset Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-rose-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-rose-600" />
            Reset Local Sample Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-purple-700 leading-relaxed">
            Reinitializes the local storage cache with the pre-packaged 5-module Computer Networks curriculum, approved 30-item question banks, and sample test attempts.
          </p>
          <Button variant="danger" size="sm" onClick={handleReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default Dataset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
