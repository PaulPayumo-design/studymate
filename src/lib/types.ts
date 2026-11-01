export type UserRole = 'admin' | 'student';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Subject {
  id: string;
  title: string;
  code: string;
  description: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  modules_count?: number;
  weeks_count?: number; // Up to 10 weeks
}

export interface ModuleQuestionDistribution {
  multiple_choice: number; // default 10
  identification: number;  // default 10
  true_false: number;      // default 10
  additional_mc?: number;
  additional_id?: number;
  additional_tf?: number;
}

export type WeekQuestionDistribution = ModuleQuestionDistribution;

export interface Module {
  id: string;
  subject_id: string;
  module_number: number; // 1 to 10 (Weeks 1-10)
  title: string; // e.g. "Week 1: Physical Layer" or custom title "CMPA_W6-10_MIDTERMS"
  description: string;
  topics?: string; // Curriculum topics assigned to this Week Title
  order_index: number;
  exam_time_limit_minutes: number;
  exam_question_count: number; // 60 questions per examination mode
  question_distribution: ModuleQuestionDistribution;
  pdf_reviewer?: UploadedReviewer | null;
  question_count?: number;
  approved_question_count?: number;
  flashcard_count?: number;
  study_progress?: number; // 0-100%
  created_at: string;
  updated_at?: string;
}

export type Week = Module;

export interface UploadedReviewer {
  id: string;
  subject_id: string;
  module_id: string;
  file_name: string;
  file_url?: string;
  file_size_bytes: number;
  extracted_text: string;
  extracted_at: string;
  uploaded_by?: string;
  status: 'pending' | 'processed' | 'error';
  summary?: string;
  created_at: string;
}

export type QuestionType = 'multiple_choice' | 'identification' | 'true_false';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type QuestionExamSet = 'multiple_choice' | 'identification' | 'true_false' | 'mixed';

export interface Question {
  id: string;
  subject_id: string;
  module_id: string;
  question_type: QuestionType;
  exam_set?: QuestionExamSet; // Which 60-item examination set this belongs to
  question_text: string;
  choices?: string[]; // 4 choices for multiple_choice
  correct_answer: string;
  alternative_answers?: string[]; // for identification (synonyms, alternate accepted spellings)
  explanation: string;
  source_pdf_ref: string; // e.g. "Computer Networks - Module 1.pdf" or "Topic-generated: OSI Layer 3"
  source_excerpt?: string; // Exact snippet or topic description
  topic?: string; // Related subject topic
  difficulty?: QuestionDifficulty;
  approval_status: ApprovalStatus;
  manual_verification_flag?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GeneratedQuestionItem {
  id: string;
  question_type: QuestionType;
  exam_set?: QuestionExamSet;
  question_text: string;
  choices?: string[];
  correct_answer: string;
  alternative_answers?: string[];
  explanation: string;
  topic: string;
  source_ref?: string;
}

export interface ExamModeReadiness {
  mode: ExamMode;
  title: string;
  description: string;
  requiredItems: number; // strictly 60
  approvedCount: number;
  isReady: boolean;
  breakdown?: {
    multiple_choice: { approved: number; required: number };
    identification: { approved: number; required: number };
    true_false: { approved: number; required: number };
  };
}

export interface TopicGenerationConfig {
  subject_id: string;
  module_id: string;
  subject_title: string;
  module_title: string;
  topics: string;
  target_type?: QuestionType; // When generating solely for one type
  distribution: {
    multiple_choice: number;
    identification: number;
    true_false: number;
  };
}

export interface Flashcard {
  id: string;
  subject_id: string;
  module_id: string;
  front_text: string; // Question or Term
  back_text: string;  // Answer or Definition
  source_ref: string;
  approval_status: ApprovalStatus;
  created_at: string;
}

export type FlashcardStatus = 'known' | 'need_review' | 'unseen';

export interface FlashcardProgress {
  id: string;
  student_id: string;
  flashcard_id: string;
  status: FlashcardStatus;
  last_reviewed_at: string;
}

export type ExamMode = 'multiple_choice' | 'identification' | 'true_false' | 'mixed';

export interface ExaminationConfig {
  id: string;
  subject_id: string;
  module_id?: string | null; // null if Comprehensive Exam
  title: string;
  is_comprehensive: boolean;
  exam_mode: ExamMode;
  time_limit_minutes: number;
  total_questions: number; // 30 for module, 60 for comprehensive
  module_distribution?: Record<string, number>; // { [moduleId]: count } e.g. 12 per module
  is_active: boolean;
  created_at: string;
}

export interface ExamAnswerSubmission {
  question_id: string;
  student_answer: string;
  is_correct: boolean;
  correct_answer_snapshot: string;
  explanation_snapshot: string;
  manual_review_flag?: boolean;
}

export interface ModuleScoreBreakdown {
  module_id: string;
  module_title: string;
  module_number: number;
  total_questions: number;
  correct_count: number;
  score_percentage: number;
}

export interface TypeScoreBreakdown {
  question_type: QuestionType;
  total_questions: number;
  correct_count: number;
  score_percentage: number;
}

export interface ExamAttempt {
  id: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  subject_id: string;
  subject_title?: string;
  module_id?: string | null;
  module_title?: string | null;
  examination_id?: string;
  is_comprehensive: boolean;
  exam_mode: ExamMode;
  started_at: string;
  submitted_at: string;
  score: number;
  total_items: number;
  correct_count: number;
  incorrect_count: number;
  percentage: number;
  time_spent_seconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  module_breakdown: ModuleScoreBreakdown[];
  type_breakdown: TypeScoreBreakdown[];
  answers: ExamAnswerSubmission[];
}
