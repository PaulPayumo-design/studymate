'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div
      className={cn(
        isAdmin
          ? 'bg-[#101A27] rounded-2xl border border-[#26384D] shadow-sm transition-all duration-200 overflow-hidden text-[#F8FAFC]'
          : 'bg-white rounded-2xl border border-[#E2EEFC] shadow-sm shadow-[#142D4E]/5 transition-all duration-200 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div
      className={cn(
        'p-6 border-b',
        isAdmin ? 'border-[#26384D]' : 'border-[#F0F6FD]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <h3
      className={cn(
        'text-lg font-bold tracking-tight',
        isAdmin ? 'text-[#F8FAFC]' : 'text-[#142D4E]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <p
      className={cn(
        'text-sm mt-1',
        isAdmin ? 'text-[#94A3B8]' : 'text-[#64748B]',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div
      className={cn(
        'p-6 border-t',
        isAdmin ? 'border-[#26384D]' : 'border-[#F0F6FD]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
