'use client';

import React, { Suspense } from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<aside className="w-64 bg-white border-r border-[#E2EEFC]" />}>
        <StudentSidebar />
      </Suspense>
      <div className="flex-1 overflow-y-auto bg-[#F4F9FD] p-4 sm:p-6 lg:p-8 relative">
        {children}
      </div>
    </div>
  );
}
