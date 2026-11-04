import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatQuestionTextForDisplay(text: string): string {
  if (!text) return '';

  return text
    // 1. Remove Case / Scenario / Clinical Case headings at the start of question
    .replace(
      /^(?:Clinical\s+Case|Administrative\s+Case|Case|Diagnostic\s+Scenario|Management\s+Scenario|Clinical\s+Verification\s+Scenario|Policy\s+Verification\s+Scenario|Verification\s+Scenario|Scenario|Item\s+\d+\s*\([^)]*\))\s*#?\d*[:.-]\s*/i,
      ''
    )
    // 2. Remove Study Collection title mentions like "in CMPA_W6-10_MIDTERMS?", etc.
    .replace(
      /\s*(?:in|for)\s+["']?(?:CMPA_W6-10_MIDTERMS|NLM_W7-11_MIDTERMS|MS_W7-10_MIDTERMS)["']?\??/gi,
      ''
    )
    .replace(
      /["']?(?:CMPA_W6-10_MIDTERMS|NLM_W7-11_MIDTERMS|MS_W7-10_MIDTERMS)["']?\??/gi,
      ''
    )
    // 3. Clean up punctuation artifacts
    .replace(/\?\.\s*/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
