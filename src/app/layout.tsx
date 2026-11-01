import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/shared/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'PAW STUDY - Private Flashcard & Examination System',
  description: 'Private study and examination platform with strict PDF-sourced question banking, interactive flashcards, and 60-item weekly examination suites.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F4F9FD] text-[#142D4E] font-sans">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-[#E2EEFC]" />}>
            <Header />
          </Suspense>
          <main className="flex-1 flex">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
