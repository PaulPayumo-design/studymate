'use client';

import React, { Suspense } from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)] min-w-0 w-full overflow-x-hidden">
      <Suspense fallback={<aside className="w-64 bg-white border-r border-[#E2EEFC]" />}>
        <StudentSidebar />
      </Suspense>
      <div className="flex-1 min-w-0 max-w-full overflow-x-hidden overflow-y-auto bg-[#F4F9FD] p-3.5 sm:p-5 lg:p-8 relative">
        {children}
      </div>
    </div>
  );
}
