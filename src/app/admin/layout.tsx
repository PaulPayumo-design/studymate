'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ShieldAlert, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, switchRole } = useAuth();

  // Guard: if current user is student, show access warning with role switch
  if (role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-purple-200 shadow-xl shadow-purple-900/5 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-purple-950">Administrator Access Restricted</h2>
          <p className="text-xs text-purple-700/80 leading-relaxed">
            You are currently logged in as a Student (<span className="font-semibold">{user?.email}</span>).
            Administrator console access requires verified managerial privileges.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => switchRole('admin')}
              className="w-full gap-2"
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
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<aside className="w-64 bg-white border-r border-purple-100" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 overflow-y-auto bg-[#faf8fd] p-6 lg:p-8">{children}</div>
    </div>
  );
}
