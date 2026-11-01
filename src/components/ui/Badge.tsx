import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionType, QuestionDifficulty, ApprovalStatus } from '@/lib/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'primary' | 'purple' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#EAF3FB] text-[#1565C0] border-[#BFDBFE]/70',
    outline: 'border border-[#BFDBFE] text-[#142D4E] bg-white',
    primary: 'bg-[#1565C0] text-white border-transparent',
    purple: 'bg-[#1565C0] text-white border-transparent',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function QuestionTypeBadge({ type }: { type: QuestionType }) {
  switch (type) {
    case 'multiple_choice':
      return <Badge variant="primary">Multiple Choice</Badge>;
    case 'identification':
      return <Badge variant="info">Identification</Badge>;
    case 'true_false':
      return <Badge variant="warning">True or False</Badge>;
  }
}

export function DifficultyBadge({ difficulty }: { difficulty?: QuestionDifficulty }) {
  if (!difficulty) return null;
  switch (difficulty) {
    case 'easy':
      return <Badge variant="success">Easy</Badge>;
    case 'medium':
      return <Badge variant="info">Medium</Badge>;
    case 'hard':
      return <Badge variant="danger">Hard</Badge>;
  }
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'rejected':
      return <Badge variant="danger">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge variant="warning">Pending Review</Badge>;
  }
}

export const ApprovalStatusBadge = ApprovalBadge;
