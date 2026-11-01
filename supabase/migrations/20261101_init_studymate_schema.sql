-- =============================================================================
-- STUDYMATE: Database Schema & Row Level Security (PostgreSQL / Supabase)
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'student')) default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. SUBJECTS TABLE
create table if not exists public.subjects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  code text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. MODULES TABLE (5 per subject by default)
create table if not exists public.modules (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_number int not null check (module_number between 1 and 20),
  title text not null,
  description text,
  order_index int not null default 1,
  exam_time_limit_minutes int not null default 30,
  exam_question_count int not null default 30,
  mc_target int not null default 10,
  id_target int not null default 5,
  tf_target int not null default 5,
  custom_target int not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_subject_module_num unique (subject_id, module_number)
);

-- 4. UPLOADED REVIEWERS (PDF storage & extracted text)
create table if not exists public.uploaded_reviewers (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  file_name text not null,
  file_url text,
  file_size_bytes bigint not null default 0,
  extracted_text text not null default '',
  extracted_at timestamptz not null default now(),
  uploaded_by uuid references public.profiles(id) on delete set null,
  status text not null check (status in ('pending', 'processed', 'error')) default 'processed',
  created_at timestamptz not null default now()
);

-- 5. QUESTION BANK
create table if not exists public.questions (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  question_type text not null check (question_type in ('multiple_choice', 'identification', 'true_false')),
  question_text text not null,
  choices jsonb, -- Array of strings for multiple choice
  correct_answer text not null,
  alternative_answers jsonb default '[]'::jsonb, -- Array of accepted synonyms for identification
  explanation text not null default '',
  source_pdf_ref text not null default '',
  source_excerpt text,
  topic text not null default '',
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  approval_status text not null check (approval_status in ('pending', 'approved', 'rejected')) default 'pending',
  manual_verification_flag boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. FLASHCARDS
create table if not exists public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  front_text text not null,
  back_text text not null,
  source_ref text not null default '',
  approval_status text not null check (approval_status in ('pending', 'approved', 'rejected')) default 'approved',
  created_at timestamptz not null default now()
);

-- 7. FLASHCARD PROGRESS (per student)
create table if not exists public.flashcard_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade,
  status text not null check (status in ('known', 'need_review', 'unseen')) default 'unseen',
  last_reviewed_at timestamptz not null default now(),
  constraint unique_student_card unique (student_id, flashcard_id)
);

-- 8. EXAMINATIONS (Configuration templates)
create table if not exists public.examinations (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade, -- null if comprehensive
  title text not null,
  is_comprehensive boolean not null default false,
  exam_mode text not null check (exam_mode in ('multiple_choice', 'identification', 'true_false', 'mixed')),
  time_limit_minutes int not null default 30,
  total_questions int not null default 30,
  module_distribution jsonb, -- e.g. {"mod1": 12, "mod2": 12, ...}
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 9. EXAM ATTEMPTS
create table if not exists public.exam_attempts (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  examination_id uuid references public.examinations(id) on delete set null,
  is_comprehensive boolean not null default false,
  exam_mode text not null check (exam_mode in ('multiple_choice', 'identification', 'true_false', 'mixed')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  score numeric not null default 0,
  total_items int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  percentage numeric not null default 0,
  time_spent_seconds int not null default 0,
  status text not null check (status in ('in_progress', 'completed', 'abandoned')) default 'completed',
  module_breakdown jsonb default '[]'::jsonb,
  type_breakdown jsonb default '[]'::jsonb
);

-- 10. EXAM ANSWERS
create table if not exists public.exam_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  student_answer text not null default '',
  is_correct boolean not null default false,
  correct_answer_snapshot text not null,
  explanation_snapshot text not null default '',
  manual_review_flag boolean not null default false
);

-- INDEXES FOR HIGH QUERY PERFORMANCE
create index if not exists idx_modules_subject on public.modules(subject_id);
create index if not exists idx_questions_module on public.questions(module_id);
create index if not exists idx_questions_approval on public.questions(approval_status);
create index if not exists idx_flashcards_module on public.flashcards(module_id);
create index if not exists idx_flashcard_progress_student on public.flashcard_progress(student_id);
create index if not exists idx_attempts_student on public.exam_attempts(student_id);
create index if not exists idx_answers_attempt on public.exam_answers(attempt_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.modules enable row level security;
alter table public.uploaded_reviewers enable row level security;
alter table public.questions enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_progress enable row level security;
alter table public.examinations enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_answers enable row level security;

-- Helper function: Is user admin?
create or replace function public.is_admin()
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql;

-- 1. PROFILES POLICIES
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins can insert and update profiles" on public.profiles
  for all using (public.is_admin());

-- 2. SUBJECTS & MODULES POLICIES
create policy "Authenticated users can read subjects" on public.subjects
  for select using (auth.role() = 'authenticated');

create policy "Admins can modify subjects" on public.subjects
  for all using (public.is_admin());

create policy "Authenticated users can read modules" on public.modules
  for select using (auth.role() = 'authenticated');

create policy "Admins can modify modules" on public.modules
  for all using (public.is_admin());

-- 3. REVIEWERS POLICIES
create policy "Authenticated users can view reviewers" on public.uploaded_reviewers
  for select using (auth.role() = 'authenticated');

create policy "Admins can manage reviewers" on public.uploaded_reviewers
  for all using (public.is_admin());

-- 4. QUESTIONS POLICIES
create policy "Students can view approved questions" on public.questions
  for select using (auth.role() = 'authenticated' and approval_status = 'approved');

create policy "Admins can manage all questions" on public.questions
  for all using (public.is_admin());

-- 5. FLASHCARDS POLICIES
create policy "Authenticated can read approved flashcards" on public.flashcards
  for select using (auth.role() = 'authenticated' and approval_status = 'approved');

create policy "Admins can manage flashcards" on public.flashcards
  for all using (public.is_admin());

-- 6. FLASHCARD PROGRESS POLICIES
create policy "Students can view and modify own flashcard progress" on public.flashcard_progress
  for all using (auth.uid() = student_id);

create policy "Admins can view all student flashcard progress" on public.flashcard_progress
  for select using (public.is_admin());

-- 7. EXAMINATIONS POLICIES
create policy "Authenticated can view examinations" on public.examinations
  for select using (auth.role() = 'authenticated' and is_active = true);

create policy "Admins can manage examinations" on public.examinations
  for all using (public.is_admin());

-- 8. EXAM ATTEMPTS & ANSWERS POLICIES
create policy "Students can view and create own attempts" on public.exam_attempts
  for all using (auth.uid() = student_id);

create policy "Admins can view all exam attempts" on public.exam_attempts
  for select using (public.is_admin());

create policy "Students can view and insert own exam answers" on public.exam_answers
  for all using (
    exists (
      select 1 from public.exam_attempts
      where exam_attempts.id = exam_answers.attempt_id
      and exam_attempts.student_id = auth.uid()
    )
  );

create policy "Admins can view all exam answers" on public.exam_answers
  for select using (public.is_admin());
