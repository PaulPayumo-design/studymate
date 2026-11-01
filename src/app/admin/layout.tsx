'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ShieldAlert, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, switchRole } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname === '/admin';

  // Guard: if current user is student, show access warning with role switch
  if (role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[#080D16]">
        <div className="max-w-md w-full bg-[#111C2A] p-8 rounded-3xl border border-[#26384D] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Administrator Access Restricted</h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            You are currently logged in as a Student (<span className="font-semibold text-[#F8FAFC]">{user?.email}</span>).
            Administrator console access requires verified managerial privileges.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => switchRole('admin')}
              className="w-full gap-2 bg-[#1685E8] hover:bg-[#1170C6] text-white"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Switch to Administrator Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)] bg-[#080D16]">
      <Suspense fallback={<aside className="w-64 bg-[#0B1420] border-r border-[#26384D]" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#080D16] text-[#F8FAFC]">
        {children}
      </div>
    </div>
  );
}
