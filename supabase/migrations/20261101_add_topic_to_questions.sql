-- Migration: Add topic column to questions table
-- Supports topic-based AI question generation and classification

alter table if exists public.questions 
add column if not exists topic text not null default '';

create index if not exists idx_questions_topic on public.questions(topic);
create index if not exists idx_questions_type_approval on public.questions(question_type, approval_status);
