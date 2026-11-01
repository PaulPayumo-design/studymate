'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Mail,
  Lock,
  ShieldCheck,
  User,
  AlertCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { CatMascot } from '@/components/shared/CatMascot';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('student@studymate.local');
  const [password, setPassword] = useState('studymate123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleQuickLogin = async (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('studymate123');
    setError(null);
    setIsLoading(true);

    const res = await login(presetEmail, 'studymate123');
    setIsLoading(false);

    if (res.success) {
      if (presetEmail.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } else {
      setError(res.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F4F9FD]">
      {/* Background Soft Sky Blue Waves */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#3B82C4]/15 via-[#EAF3FB] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-tr from-[#3B82C4]/20 via-[#EAF3FB] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Paw prints at corners */}
      <div className="absolute bottom-8 left-8 flex flex-col items-start gap-2 pointer-events-none select-none">
        <CatMascot variant="paw" size={28} className="text-[#3B82C4]/30" />
        <CatMascot variant="paw" size={20} className="text-[#3B82C4]/25 ml-4" />
      </div>
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 pointer-events-none select-none">
        <CatMascot variant="paw" size={30} className="text-[#3B82C4]/30" />
        <CatMascot variant="paw" size={22} className="text-[#3B82C4]/25 mr-4" />
      </div>

      {/* Center Login Card */}
      <div className="max-w-[440px] w-full bg-white rounded-3xl border border-[#E2EEFC] p-8 sm:p-10 shadow-2xl shadow-[#142D4E]/5 space-y-6 relative my-auto">
        {/* Header with Mascot */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <CatMascot variant="login-hero" size={88} />
          </div>

          <h1 className="text-2xl font-black text-[#142D4E] tracking-tight">
            Sign In to STUDYMATE
          </h1>
          <p className="text-xs font-semibold text-[#64748B]">
            Authorized access only. Public registration is disabled.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#142D4E] mb-2">
              <Mail className="w-4 h-4 text-[#1565C0]" />
              <span>EMAIL ADDRESS</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@studymate.local"
              className="w-full px-4 py-3 rounded-2xl border border-[#BFDBFE] text-sm font-semibold text-[#142D4E] bg-white placeholder-[#94A3B8] focus:border-[#1565C0] focus:ring-2 focus:ring-[#3B82C4]/20 focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#142D4E] mb-2">
              <Lock className="w-4 h-4 text-[#1565C0]" />
              <span>PASSWORD</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="•••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-[#BFDBFE] text-sm font-semibold text-[#142D4E] bg-white placeholder-[#94A3B8] focus:border-[#1565C0] focus:ring-2 focus:ring-[#3B82C4]/20 focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1565C0] hover:bg-[#142D4E] text-white font-black text-sm tracking-wide shadow-md shadow-[#1565C0]/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            <span>Sign In</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1 before:h-px before:flex-1 before:bg-[#E2EEFC] after:h-px after:flex-1 after:bg-[#E2EEFC]">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#1565C0]">
            ONE-CLICK AUTHORIZED ACCOUNTS
          </span>
        </div>

        {/* One-Click Authorized Accounts */}
        <div className="space-y-2.5">
          {/* Admin Account */}
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@studymate.local')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#BFDBFE]/80 bg-[#F4F9FD] hover:bg-[#EAF3FB] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1565C0] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-black text-sm text-[#142D4E]">Prof. Sarah Connor</div>
                <div className="text-xs font-semibold text-[#64748B]">Administrator • Full Access</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#1565C0] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Student Account */}
          <button
            type="button"
            onClick={() => handleQuickLogin('student@studymate.local')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#BFDBFE]/80 bg-[#F4F9FD] hover:bg-[#EAF3FB] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="font-black text-sm text-[#142D4E]">Shaina</div>
                <div className="text-xs font-semibold text-[#64748B]">Student • Computer Networks</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Footer Security Note */}
        <div className="text-center pt-1">
          <p className="text-xs font-semibold text-[#64748B] flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#1565C0]" />
            <span>Row-Level Security & Role-Based Access Control</span>
          </p>
        </div>
      </div>
    </div>
  );
}
