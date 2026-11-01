'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-xs font-semibold uppercase tracking-wider",
              isAdmin ? "text-[#94A3B8]" : "text-purple-900/80"
            )}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 disabled:opacity-50',
            isAdmin
              ? 'border-[#26384D] bg-[#101A27] text-[#F8FAFC] placeholder:text-[#94A3B8]/40 focus:ring-[#1685E8] focus:border-[#1685E8] disabled:bg-[#111C2A]'
              : 'border-purple-200 bg-white text-purple-950 placeholder:text-purple-300 focus:ring-purple-400 focus:border-purple-400 disabled:bg-purple-50/50',
            error && 'border-rose-400 focus:ring-rose-400 focus:border-rose-400',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className={cn("text-xs", isAdmin ? "text-[#94A3B8]" : "text-purple-500")}>{helperText}</p>
        )}
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-xs font-semibold uppercase tracking-wider",
              isAdmin ? "text-[#94A3B8]" : "text-purple-900/80"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 disabled:opacity-50 resize-y',
            isAdmin
              ? 'border-[#26384D] bg-[#101A27] text-[#F8FAFC] placeholder:text-[#94A3B8]/40 focus:ring-[#1685E8] focus:border-[#1685E8] disabled:bg-[#111C2A]'
              : 'border-purple-200 bg-white text-purple-950 placeholder:text-purple-300 focus:ring-purple-400 focus:border-purple-400 disabled:bg-purple-50/50',
            error && 'border-rose-400 focus:ring-rose-400 focus:border-rose-400',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className={cn("text-xs", isAdmin ? "text-[#94A3B8]" : "text-purple-500")}>{helperText}</p>
        )}
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
