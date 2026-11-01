# STUDYMATE 🎓
### Private Flashcard and Examination System

STUDYMATE is a private, web-based educational platform designed for local Windows 11 development. It allows educators and administrators to upload PDF reviewers, extract grounded question banks, organize interactive 3D flashcards, and administer rigorous examinations across laptops, tablets, and mobile devices.

---

## 🌟 Key Features

1. **Role-Based Access Control**:
   - **Administrator**: Full management console, curriculum structuring, PDF uploads, strict source question generation, student account authorization, and examination analytics.
   - **Student**: Personalized learning dashboard, interactive 3D flashcards, 30-item module exams across 4 modes, and 60-item Comprehensive Examinations.
   - **Private System**: Public self-registration is closed. Student accounts are authorized and created exclusively by the Administrator.

2. **Strict PDF Reviewer Management**:
   - Upload PDF reviewers for each module (e.g. `Module 1.pdf` through `Module 5.pdf`).
   - Server-side readable text extraction via `unpdf`.
   - In-app text viewer with word counts and live keyword search.
   - Strict source requirement: Question generator derives questions, answers, and explanations strictly from the uploaded PDF text without hallucination or outside facts.
   - Candidate question review and approval workflow (never automatically approved).

3. **Question Bank Management (Target: 30 Questions Per Module)**:
   - Supports 3 core question types:
     - **Multiple Choice**: 4 choices with distractor audit.
     - **Identification**: Typed answers with case-insensitivity, whitespace normalization, and fuzzy typo flagging for manual review.
     - **True or False**: Direct factual statement verification.
   - Configurable 30-question distribution per module:
     - 10 Multiple Choice
     - 5 Identification
     - 5 True or False
     - 10 configurable additional items totaling exactly 30 questions.
   - JSON export and JSON bulk import.

4. **Interactive Flashcard System**:
   - 3D perspective flip cards (Term on front, Definition on back).
   - Flip with click or `Spacebar` key.
   - Navigate with `Previous` and `Next` (or Arrow keys).
   - Shuffle deck capability.
   - Mark as **Known** or **Need Review** with persistent mastery tracking.

5. **4 Examination Evaluation Modes**:
   - **Mode 1**: Multiple Choice Only.
   - **Mode 2**: Identification Only.
   - **Mode 3**: True or False Only.
   - **Mode 4**: Mixed Mode (combines all 3 formats with randomized sequence).

6. **60-Item Comprehensive Examination**:
   - Synthesizes 12 questions from each of the 5 modules (= 60 items).
   - Zero question duplication within an attempt.
   - Checks question bank sufficiency before allowing students to start.
   - Countdown timer with auto-submission and warning alerts.

7. **Dual-Layer Database Architecture**:
   - **Cloud PostgreSQL & Auth**: Ready for Supabase via `@supabase/ssr` with complete SQL migration and Row Level Security policies.
   - **Offline Local Sandbox**: Persistent browser cache with preloaded 5-module Computer Networks curriculum and 30-item question banks ready to test immediately out of the box.

---

## 🚀 Getting Started (Windows 11)

### 1. Prerequisites
- Node.js v18+ or v22+
- npm v10+

### 2. Run Locally
```powershell
# In D:\studymate
npm run dev
```
Open your browser at:
```
http://localhost:3000
```

### 3. Demo Accounts
The local sandbox includes ready-to-test credentials:
- **Administrator**: `admin@studymate.local` (Prof. Sarah Connor)
- **Student**: `student@studymate.local` (Alex Rivera)
- **Student**: `maria@studymate.local` (Maria Santos)

You can also switch roles at any time using the **"Switch Role"** toggle in the top header.

---

## 🗄️ Database & Supabase Integration

When you are ready to connect a cloud Supabase project:

1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Open the **SQL Editor** in your Supabase dashboard and execute the migration script:
   ```
   supabase/migrations/20261101_init_studymate_schema.sql
   ```
4. StudyMate will automatically detect the connection and synchronize live PostgreSQL tables.

---

## 📂 Project Structure

```
d:\studymate\
├── supabase/
│   └── migrations/
│       └── 20261101_init_studymate_schema.sql  # Complete PostgreSQL schema & RLS
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx               # Secure role login
│   │   ├── admin/
│   │   │   ├── page.tsx                        # Admin dashboard & KPIs
│   │   │   ├── subjects/page.tsx               # Subjects & 5-module manager
│   │   │   ├── modules/page.tsx                # 30-item question distribution configurator
│   │   │   ├── reviewers/page.tsx              # PDF upload, text extraction, preview
│   │   │   ├── questions/page.tsx              # Question bank CRUD & JSON import/export
│   │   │   ├── flashcards/page.tsx             # Flashcard editor
│   │   │   ├── examinations/page.tsx           # 60-item comprehensive exam settings
│   │   │   ├── students/page.tsx               # Student account authorization
│   │   │   ├── results/page.tsx                # Student attempt analytics
│   │   │   └── settings/page.tsx               # System & cache settings
│   │   ├── student/
│   │   │   ├── page.tsx                        # Student dashboard
│   │   │   ├── subjects/page.tsx               # Assigned curriculum
│   │   │   ├── flashcards/page.tsx             # 3D interactive flip study session
│   │   │   ├── exams/page.tsx                  # Module exam launcher
│   │   │   ├── exams/take/page.tsx             # Active exam room (timer, palette, submit)
│   │   │   ├── comprehensive/page.tsx          # 60-item comprehensive exam entrance
│   │   │   ├── results/page.tsx                # Student attempt history
│   │   │   ├── results/[attemptId]/page.tsx    # Detailed report & revealed answer keys
│   │   │   └── profile/page.tsx                # Student profile & stats
│   │   ├── api/pdf/extract/route.ts            # Server-side PDF parser & generator
│   │   └── globals.css                         # Lavender color palette & 3D card CSS
│   ├── components/
│   │   ├── ui/                                 # Button, Card, Badge, Modal, Input
│   │   ├── shared/                             # Header, StorageBanner
│   │   ├── admin/                              # AdminSidebar
│   │   └── student/                            # StudentSidebar
│   └── lib/
│       ├── types.ts                            # Full TypeScript interfaces
│       ├── scoring.ts                          # Answer normalization & fuzzy checking
│       ├── pdf-extractor.ts                    # unpdf parser & segmenter
│       ├── question-generator.ts               # Strict source-grounded question extractor
│       ├── store/index.ts                      # Persistent state layer (Supabase / Local)
│       └── mock-data.ts                        # Seed data (5 modules, 30 Qs per module)
```
