'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 backdrop-blur-sm transition-opacity",
          isAdmin ? "bg-black/75" : "bg-purple-950/40"
        )}
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full rounded-3xl z-10 my-8 transition-all transform scale-100 max-h-[90vh] flex flex-col',
          isAdmin
            ? 'bg-[#111C2A] border border-[#26384D] shadow-2xl shadow-black/60 p-6 sm:p-8 text-[#F8FAFC]'
            : 'bg-white border border-purple-100 shadow-2xl shadow-purple-900/20 p-6 sm:p-8',
          widthClasses[maxWidth]
        )}
      >
        <div className={cn("flex items-start justify-between pb-4 border-b", isAdmin ? "border-[#26384D]" : "border-purple-50")}>
          <div>
            <h3 className={cn("text-xl font-bold", isAdmin ? "text-[#F8FAFC]" : "text-purple-950")}>{title}</h3>
            {description && (
              <p className={cn("text-sm mt-1", isAdmin ? "text-[#94A3B8]" : "text-purple-600/80")}>{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className={cn(
              "rounded-full p-1.5 transition-colors -mr-2",
              isAdmin
                ? "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101A27]"
                : "text-purple-400 hover:text-purple-700 hover:bg-purple-50"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto pr-1 flex-1">{children}</div>
      </div>
    </div>
  );
}
