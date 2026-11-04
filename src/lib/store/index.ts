'use client';

import {
  UserProfile,
  Subject,
  Module,
  UploadedReviewer,
  Question,
  Flashcard,
  FlashcardProgress,
  ExamAttempt,
  ExamMode,
  QuestionType,
  ModuleScoreBreakdown,
  TypeScoreBreakdown,
  ExamAnswerSubmission,
  ExamModeReadiness,
  QuestionExamSet,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_SUBJECTS,
  INITIAL_MODULES,
  INITIAL_REVIEWERS,
  INITIAL_QUESTIONS,
  INITIAL_FLASHCARDS,
  INITIAL_EXAM_ATTEMPTS,
} from '../mock-data';
import { evaluateAnswer } from '../scoring';
import { generateQuestionsFromTopics } from '../question-generator-service';

const STORAGE_KEYS = {
  PROFILES: 'studymate_profiles_v3',
  CURRENT_USER: 'studymate_current_user_v3',
  SUBJECTS: 'studymate_subjects_v3',
  MODULES: 'studymate_modules_v3',
  REVIEWERS: 'studymate_reviewers_v3',
  QUESTIONS: 'studymate_questions_v3',
  FLASHCARDS: 'studymate_flashcards_v3',
  FLASHCARD_PROGRESS: 'studymate_fc_progress_v3',
  EXAM_ATTEMPTS: 'studymate_attempts_v3',
};

// One-time purge of obsolete v1/v2 storage data
if (typeof window !== 'undefined') {
  try {
    const legacyKeys = [
      'studymate_profiles_v1',
      'studymate_current_user_v1',
      'studymate_subjects_v1',
      'studymate_modules_v1',
      'studymate_reviewers_v1',
      'studymate_questions_v1',
      'studymate_flashcards_v1',
      'studymate_fc_progress_v1',
      'studymate_attempts_v1',
      'studymate_profiles_v2',
      'studymate_current_user_v2',
      'studymate_subjects_v2',
      'studymate_modules_v2',
      'studymate_reviewers_v2',
      'studymate_questions_v2',
      'studymate_flashcards_v2',
      'studymate_fc_progress_v2',
      'studymate_attempts_v2',
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage for key ${key}:`, err);
  }
}

export class StudyMateStore {
  // Profiles
  static getProfiles(): UserProfile[] {
    let list = getLocal<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const hasSarah = list.some(p => p.full_name === 'Prof. Sarah Connor');
    if (hasSarah) {
      list = list.map(p => p.full_name === 'Prof. Sarah Connor' ? { ...p, full_name: 'Paul' } : p);
      setLocal(STORAGE_KEYS.PROFILES, list);
    }
    return list;
  }

  static getStudents(): UserProfile[] {
    return this.getProfiles().filter(p => p.role === 'student');
  }

  static createStudent(fullName: string, email: string): UserProfile {
    const profiles = this.getProfiles();
    if (profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('A user with this email address already exists.');
    }

    const newStudent: UserProfile = {
      id: `usr-${Date.now()}`,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: 'student',
      created_at: new Date().toISOString(),
    };

    const updated = [...profiles, newStudent];
    setLocal(STORAGE_KEYS.PROFILES, updated);
    return newStudent;
  }

  static getCurrentUser(): UserProfile {
    const profiles = this.getProfiles();
    const stored = getLocal<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (stored) {
      if (stored.full_name === 'Prof. Sarah Connor') {
        stored.full_name = 'Paul';
        setLocal(STORAGE_KEYS.CURRENT_USER, stored);
      }
      const match = profiles.find(p => p.id === stored.id);
      if (match) return match;
    }
    // Default to the Admin user for initial setup
    return profiles[0] || INITIAL_PROFILES[0];
  }

  static setCurrentUser(user: UserProfile): void {
    setLocal(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Subjects
  static getSubjects(): Subject[] {
    let subjects = getLocal<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    
    // Purge legacy obsolete subjects (CN-101, CS-201, sub-cn-01, sub-ds-02)
    const legacySubjectIds = new Set(['sub-cn-01', 'sub-ds-02']);
    const legacyCodes = new Set(['CN-101', 'CS-201']);
    const hasLegacy = subjects.some(s => legacySubjectIds.has(s.id) || legacyCodes.has(s.code));
    if (hasLegacy) {
      subjects = subjects.filter(s => !legacySubjectIds.has(s.id) && !legacyCodes.has(s.code));
      setLocal(STORAGE_KEYS.SUBJECTS, subjects);
    }

    const existingIds = new Set(subjects.map(s => s.id));
    const missing = INITIAL_SUBJECTS.filter(s => !existingIds.has(s.id));
    if (missing.length > 0) {
      subjects = [...subjects, ...missing];
      setLocal(STORAGE_KEYS.SUBJECTS, subjects);
    }
    const modules = this.getModules();
    return subjects.map(s => ({
      ...s,
      modules_count: modules.filter(m => m.subject_id === s.id).length,
    }));
  }

  static getSubjectById(id: string): Subject | undefined {
    return this.getSubjects().find(s => s.id === id);
  }

  static createSubject(title: string, code: string, description: string): Subject {
    const subjects = this.getSubjects();
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      created_by: this.getCurrentUser().id,
      created_at: new Date().toISOString(),
      modules_count: 10,
      weeks_count: 10,
    };

    setLocal(STORAGE_KEYS.SUBJECTS, [newSubject, ...subjects]);

    // Create 10 default weeks (Week 1 to Week 10) for this subject as requested
    const defaultModules: Module[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
      id: `mod-${newSubject.id}-${num}`,
      subject_id: newSubject.id,
      module_number: num,
      title: `Week ${num}`,
      description: `Study curriculum and reviewer topics for Week ${num} of ${newSubject.title}`,
      order_index: num,
      exam_time_limit_minutes: 30,
      exam_question_count: 200,
      question_distribution: {
        multiple_choice: 10,
        identification: 10,
        true_false: 10,
      },
      created_at: new Date().toISOString(),
    }));

    const existingModules = this.getModules();
    setLocal(STORAGE_KEYS.MODULES, [...existingModules, ...defaultModules]);

    return newSubject;
  }

  static updateSubject(id: string, updates: Partial<Subject>): Subject {
    const subjects = this.getSubjects();
    const index = subjects.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Subject not found');

    const updated = { ...subjects[index], ...updates, updated_at: new Date().toISOString() };
    subjects[index] = updated;
    setLocal(STORAGE_KEYS.SUBJECTS, subjects);
    return updated;
  }

  static deleteSubject(id: string): void {
    const subjects = this.getSubjects().filter(s => s.id !== id);
    setLocal(STORAGE_KEYS.SUBJECTS, subjects);

    // Cascade delete modules, questions, flashcards, reviewers
    const modules = this.getModules().filter(m => m.subject_id !== id);
    setLocal(STORAGE_KEYS.MODULES, modules);

    const questions = this.getQuestions().filter(q => q.subject_id !== id);
    setLocal(STORAGE_KEYS.QUESTIONS, questions);

    const flashcards = this.getFlashcards().filter(f => f.subject_id !== id);
    setLocal(STORAGE_KEYS.FLASHCARDS, flashcards);
  }

  // Weeks (Modules) Management (Allowance up to Week 10)
  static getModules(subjectId?: string): Module[] {
    let modules = getLocal<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);

    // Purge legacy obsolete modules (mod-cn-*, mod-ds-*, sub-cn-01, sub-ds-02)
    const hasLegacy = modules.some(
      m => m.subject_id === 'sub-cn-01' || m.subject_id === 'sub-ds-02' || m.id.startsWith('mod-cn-') || m.id.startsWith('mod-ds-')
    );
    if (hasLegacy) {
      modules = modules.filter(
        m => m.subject_id !== 'sub-cn-01' && m.subject_id !== 'sub-ds-02' && !m.id.startsWith('mod-cn-') && !m.id.startsWith('mod-ds-')
      );
      setLocal(STORAGE_KEYS.MODULES, modules);
    }

    // Merge any missing initial weeks from INITIAL_MODULES (e.g. custom Week Titles)
    const existingIds = new Set(modules.map(m => m.id));
    const missing = INITIAL_MODULES.filter(m => !existingIds.has(m.id));
    if (missing.length > 0) {
      modules = [...modules, ...missing];
      setLocal(STORAGE_KEYS.MODULES, modules);
    }

    const questions = this.getQuestions();
    const flashcards = this.getFlashcards();
    const reviewers = this.getReviewers();

    const enriched = modules.map(m => {
      const modQuestions = questions.filter(q => q.module_id === m.id);
      const modApproved = modQuestions.filter(q => q.approval_status === 'approved');
      const modFlashcards = flashcards.filter(f => f.module_id === m.id);
      const modReviewer = reviewers.find(r => r.module_id === m.id);

      return {
        ...m,
        exam_question_count: 200,
        question_count: modQuestions.length,
        approved_question_count: modApproved.length,
        flashcard_count: modFlashcards.length,
        pdf_reviewer: modReviewer || null,
      };
    });

    if (subjectId) {
      return enriched.filter(m => m.subject_id === subjectId).sort((a, b) => a.order_index - b.order_index);
    }
    return enriched;
  }

  static getModuleById(id: string): Module | undefined {
    return this.getModules().find(m => m.id === id);
  }

  static updateModule(id: string, updates: Partial<Module>): Module {
    const modules = getLocal<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    const index = modules.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Module not found');

    const updated = { ...modules[index], ...updates, updated_at: new Date().toISOString() };
    modules[index] = updated;
    setLocal(STORAGE_KEYS.MODULES, modules);
    return updated;
  }

  static addWeek(subjectId: string, title?: string, description?: string): Module {
    const modules = getLocal<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    const subjectWeeks = modules.filter(m => m.subject_id === subjectId);
    if (subjectWeeks.length >= 10) {
      throw new Error('Allowance limit reached: Maximum 10 weeks allowed per subject.');
    }

    const nextNumber = subjectWeeks.length > 0 ? Math.max(...subjectWeeks.map(w => w.module_number)) + 1 : 1;
    const newWeek: Module = {
      id: `mod-${subjectId}-${nextNumber}`,
      subject_id: subjectId,
      module_number: nextNumber,
      title: title?.trim() || `Week ${nextNumber}`,
      description: description?.trim() || `Curriculum topics and review for Week ${nextNumber}`,
      order_index: nextNumber,
      exam_time_limit_minutes: 30,
      exam_question_count: 200,
      question_distribution: {
        multiple_choice: 10,
        identification: 10,
        true_false: 10,
      },
      created_at: new Date().toISOString(),
    };

    const updated = [...modules, newWeek];
    setLocal(STORAGE_KEYS.MODULES, updated);

    // Update subject week count
    const subjects = this.getSubjects();
    const subIdx = subjects.findIndex(s => s.id === subjectId);
    if (subIdx >= 0) {
      subjects[subIdx].modules_count = subjectWeeks.length + 1;
      subjects[subIdx].weeks_count = subjectWeeks.length + 1;
      setLocal(STORAGE_KEYS.SUBJECTS, subjects);
    }

    return newWeek;
  }

  static deleteWeek(id: string): void {
    const week = this.getModuleById(id);
    const modules = getLocal<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES).filter(m => m.id !== id);
    setLocal(STORAGE_KEYS.MODULES, modules);

    if (week) {
      const subjects = this.getSubjects();
      const subIdx = subjects.findIndex(s => s.id === week.subject_id);
      if (subIdx >= 0) {
        const remaining = modules.filter(m => m.subject_id === week.subject_id).length;
        subjects[subIdx].modules_count = remaining;
        subjects[subIdx].weeks_count = remaining;
        setLocal(STORAGE_KEYS.SUBJECTS, subjects);
      }
    }
  }

  // Reviewers
  static getReviewers(): UploadedReviewer[] {
    const list = getLocal<UploadedReviewer[]>(STORAGE_KEYS.REVIEWERS, INITIAL_REVIEWERS);
    return list.filter(r => r.subject_id !== 'sub-cn-01' && r.subject_id !== 'sub-ds-02' && !r.id.startsWith('rev-cn'));
  }

  static saveReviewer(reviewer: UploadedReviewer): void {
    const reviewers = this.getReviewers().filter(r => r.module_id !== reviewer.module_id);
    setLocal(STORAGE_KEYS.REVIEWERS, [reviewer, ...reviewers]);
  }

  static removeReviewer(moduleId: string): void {
    const reviewers = this.getReviewers().filter(r => r.module_id !== moduleId);
    setLocal(STORAGE_KEYS.REVIEWERS, reviewers);
  }

  // Questions
  static normalizeTextForDuplicateCheck(text: string): string {
    return (text || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static isDuplicateQuestion(subjectId: string, moduleId: string, questionText: string, excludeId?: string): boolean {
    const norm = this.normalizeTextForDuplicateCheck(questionText);
    if (!norm) return false;
    const questions = this.getQuestions();
    return questions.some(q => {
      if (excludeId && q.id === excludeId) return false;
      if (q.subject_id === subjectId && q.module_id === moduleId) {
        return this.normalizeTextForDuplicateCheck(q.question_text) === norm;
      }
      return false;
    });
  }

  static getQuestions(filters?: {
    subjectId?: string;
    moduleId?: string;
    type?: QuestionType;
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    topic?: string;
    examSet?: QuestionExamSet;
  }): Question[] {
    let list = getLocal<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);

    // Purge legacy obsolete questions
    const hasLegacy = list.some(
      q => q.subject_id === 'sub-cn-01' || q.subject_id === 'sub-ds-02' || q.id.startsWith('q-cn')
    );
    if (hasLegacy) {
      list = list.filter(
        q => q.subject_id !== 'sub-cn-01' && q.subject_id !== 'sub-ds-02' && !q.id.startsWith('q-cn')
      );
    }

    const initialMap = new Map(INITIAL_QUESTIONS.map(q => [q.id, q]));
    let needsUpdate = false;

    // Check if initial questions need refresh (e.g. upgraded to 200 items per mode = 600 total per module)
    const cmpaCount = list.filter(q => q.module_id === 'mod-cmpa-midterms').length;
    const nlmCount = list.filter(q => q.module_id === 'mod-nlm-midterms').length;
    const msCount = list.filter(q => q.module_id === 'mod-ms-midterms').length;

    if (cmpaCount < 600 || nlmCount < 600 || msCount < 600) {
      const customQuestions = list.filter(q => !initialMap.has(q.id));
      list = [...INITIAL_QUESTIONS, ...customQuestions];
      needsUpdate = true;
    } else {
      const existingIds = new Set(list.map(q => q.id));
      const missing = INITIAL_QUESTIONS.filter(q => !existingIds.has(q.id));
      if (missing.length > 0) {
        list = [...list, ...missing];
        needsUpdate = true;
      }

      // Sync balanced choices for initial questions if they differ from stored cache
      for (let i = 0; i < list.length; i++) {
        const initQ = initialMap.get(list[i].id);
        if (initQ && initQ.question_type === 'multiple_choice' && initQ.choices) {
          if (JSON.stringify(list[i].choices) !== JSON.stringify(initQ.choices)) {
            list[i] = { ...list[i], choices: initQ.choices, correct_answer: initQ.correct_answer };
            needsUpdate = true;
          }
        }
      }
    }

    if (needsUpdate || hasLegacy) {
      setLocal(STORAGE_KEYS.QUESTIONS, list);
    }

    if (filters?.subjectId) list = list.filter(q => q.subject_id === filters.subjectId);
    if (filters?.moduleId) list = list.filter(q => q.module_id === filters.moduleId);
    if (filters?.type) list = list.filter(q => q.question_type === filters.type);
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(q => q.approval_status === filters.status);
    }
    if (filters?.topic && filters.topic !== 'all') {
      list = list.filter(q => q.topic?.toLowerCase().includes(filters.topic!.toLowerCase()));
    }
    if (filters?.examSet) {
      list = list.filter(q => q.exam_set === filters.examSet);
    }

    return list;
  }

  static getQuestionById(id: string): Question | undefined {
    return this.getQuestions().find(q => q.id === id);
  }

  static saveQuestion(question: Question): Question {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === question.id);
    if (index >= 0) {
      questions[index] = { ...question, updated_at: new Date().toISOString() };
    } else {
      questions.unshift(question);
    }
    setLocal(STORAGE_KEYS.QUESTIONS, questions);
    return question;
  }

  static saveQuestionsBulk(newQuestions: Question[], preventDuplicates = true): { addedCount: number; duplicateCount: number } {
    const existing = this.getQuestions();
    const existingNorms = new Set(
      existing.map(q => `${q.subject_id}::${q.module_id}::${this.normalizeTextForDuplicateCheck(q.question_text)}`)
    );

    const toAdd: Question[] = [];
    let duplicateCount = 0;

    for (const q of newQuestions) {
      const key = `${q.subject_id}::${q.module_id}::${this.normalizeTextForDuplicateCheck(q.question_text)}`;
      if (preventDuplicates && existingNorms.has(key)) {
        duplicateCount++;
        continue;
      }
      existingNorms.add(key);
      toAdd.push(q);
    }

    const updated = [...toAdd, ...existing];
    setLocal(STORAGE_KEYS.QUESTIONS, updated);
    return { addedCount: toAdd.length, duplicateCount };
  }

  static deleteQuestion(id: string): void {
    const questions = this.getQuestions().filter(q => q.id !== id);
    setLocal(STORAGE_KEYS.QUESTIONS, questions);
  }

  static updateQuestionStatus(id: string, status: 'approved' | 'rejected'): void {
    const question = this.getQuestionById(id);
    if (question) {
      this.saveQuestion({ ...question, approval_status: status });
    }
  }

  // Flashcards
  static getFlashcards(subjectId?: string, moduleId?: string): Flashcard[] {
    let list = getLocal<Flashcard[]>(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARDS);
    list = list.filter(f => f.subject_id !== 'sub-cn-01' && f.subject_id !== 'sub-ds-02' && !f.id.startsWith('fc-cn'));

    // Automatically merge missing flashcards from INITIAL_FLASHCARDS
    const existingIds = new Set(list.map(f => f.id));
    const missing = INITIAL_FLASHCARDS.filter(f => !existingIds.has(f.id));
    if (missing.length > 0) {
      list = [...list, ...missing];
      setLocal(STORAGE_KEYS.FLASHCARDS, list);
    }

    if (subjectId) list = list.filter(f => f.subject_id === subjectId);
    if (moduleId) list = list.filter(f => f.module_id === moduleId);
    return list;
  }

  static saveFlashcard(flashcard: Flashcard): void {
    const cards = this.getFlashcards();
    const index = cards.findIndex(c => c.id === flashcard.id);
    if (index >= 0) {
      cards[index] = flashcard;
    } else {
      cards.unshift(flashcard);
    }
    setLocal(STORAGE_KEYS.FLASHCARDS, cards);
  }

  static saveFlashcardsBulk(newCards: Flashcard[]): void {
    const cards = this.getFlashcards();
    setLocal(STORAGE_KEYS.FLASHCARDS, [...newCards, ...cards]);
  }

  static deleteFlashcard(id: string): void {
    const cards = this.getFlashcards().filter(f => f.id !== id);
    setLocal(STORAGE_KEYS.FLASHCARDS, cards);
  }

  // Flashcard Progress
  static getFlashcardProgress(studentId: string): Record<string, 'known' | 'need_review' | 'unseen'> {
    const allProgress = getLocal<FlashcardProgress[]>(STORAGE_KEYS.FLASHCARD_PROGRESS, []);
    const studentProgress = allProgress.filter(p => p.student_id === studentId);
    const map: Record<string, 'known' | 'need_review' | 'unseen'> = {};
    studentProgress.forEach(p => {
      map[p.flashcard_id] = p.status;
    });
    return map;
  }

  static setFlashcardProgress(
    studentId: string,
    flashcardId: string,
    status: 'known' | 'need_review'
  ): void {
    const allProgress = getLocal<FlashcardProgress[]>(STORAGE_KEYS.FLASHCARD_PROGRESS, []);
    const index = allProgress.findIndex(
      p => p.student_id === studentId && p.flashcard_id === flashcardId
    );
    const updatedItem: FlashcardProgress = {
      id: index >= 0 ? allProgress[index].id : `fcp-${Date.now()}`,
      student_id: studentId,
      flashcard_id: flashcardId,
      status,
      last_reviewed_at: new Date().toISOString(),
    };

    if (index >= 0) {
      allProgress[index] = updatedItem;
    } else {
      allProgress.push(updatedItem);
    }
    setLocal(STORAGE_KEYS.FLASHCARD_PROGRESS, allProgress);
  }

  // Exam Attempts & Scoring
  static getExamAttempts(studentId?: string): ExamAttempt[] {
    const attempts = getLocal<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS, INITIAL_EXAM_ATTEMPTS);
    if (studentId) {
      return attempts.filter(a => a.student_id === studentId);
    }
    return attempts;
  }

  static getExamAttemptById(id: string): ExamAttempt | undefined {
    return this.getExamAttempts().find(a => a.id === id);
  }

  /**
   * Retrieves readiness status for an examination mode on a specific Week Title
   * Strict 200-question requirement per examination mode
   */
  static getExamModeReadiness(moduleId: string, mode: ExamMode): ExamModeReadiness {
    const allApproved = this.getQuestions({ moduleId, status: 'approved' });

    if (mode === 'multiple_choice') {
      const mcApproved = allApproved.filter(q => q.question_type === 'multiple_choice');
      const seen = new Set<string>();
      const distinct = mcApproved.filter(q => {
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (seen.has(norm)) return false;
        seen.add(norm);
        return true;
      });
      const count = distinct.length;
      return {
        mode: 'multiple_choice',
        title: 'Multiple Choice Examination',
        description: 'Dedicated 200-item multiple choice examination with 4 options per question.',
        requiredItems: 200,
        approvedCount: count,
        isReady: count >= 200,
      };
    }

    if (mode === 'identification') {
      const idApproved = allApproved.filter(q => q.question_type === 'identification');
      const seen = new Set<string>();
      const distinct = idApproved.filter(q => {
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (seen.has(norm)) return false;
        seen.add(norm);
        return true;
      });
      const count = distinct.length;
      return {
        mode: 'identification',
        title: 'Identification Examination',
        description: 'Dedicated 200-item identification examination with automated normalization.',
        requiredItems: 200,
        approvedCount: count,
        isReady: count >= 200,
      };
    }

    if (mode === 'true_false') {
      const tfApproved = allApproved.filter(q => q.question_type === 'true_false');
      const seen = new Set<string>();
      const distinct = tfApproved.filter(q => {
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (seen.has(norm)) return false;
        seen.add(norm);
        return true;
      });
      const count = distinct.length;
      return {
        mode: 'true_false',
        title: 'True or False Examination',
        description: 'Dedicated 200-item factual verification examination based directly on assigned topics.',
        requiredItems: 200,
        approvedCount: count,
        isReady: count >= 200,
      };
    }

    // Mixed Examination (Mode 4: 67 MC, 67 ID, 66 TF = 200 items)
    const mcDistinct = new Set<string>();
    const idDistinct = new Set<string>();
    const tfDistinct = new Set<string>();

    for (const q of allApproved) {
      const norm = this.normalizeTextForDuplicateCheck(q.question_text);
      if (q.question_type === 'multiple_choice') mcDistinct.add(norm);
      else if (q.question_type === 'identification') idDistinct.add(norm);
      else if (q.question_type === 'true_false') tfDistinct.add(norm);
    }

    const mcCount = mcDistinct.size;
    const idCount = idDistinct.size;
    const tfCount = tfDistinct.size;

    const totalApproved = Math.min(67, mcCount) + Math.min(67, idCount) + Math.min(66, tfCount);
    const isReady = mcCount >= 67 && idCount >= 67 && tfCount >= 66;

    return {
      mode: 'mixed',
      title: 'Mixed Examination',
      description: 'Balanced 200-item synthesis: exactly 67 Multiple Choice, 67 Identification, and 66 True or False questions.',
      requiredItems: 200,
      approvedCount: totalApproved,
      isReady,
      breakdown: {
        multiple_choice: { approved: mcCount, required: 67 },
        identification: { approved: idCount, required: 67 },
        true_false: { approved: tfCount, required: 66 },
      },
    };
  }

  /**
   * Retrieves exactly 200 distinct approved questions for the specified examination mode.
   * Leverages approved question banks and supplements from curriculum topics to ensure 200 questions.
   */
  static getApprovedQuestionsForExam(moduleId: string, mode: ExamMode): Question[] {
    const allApproved = this.getQuestions({ moduleId, status: 'approved' });
    const moduleItem = this.getModuleById(moduleId);
    const topics = moduleItem?.topics || '';
    const subject = moduleItem ? this.getSubjectById(moduleItem.subject_id) : null;
    const subjectTitle = subject?.title || 'Subject';
    const moduleTitle = moduleItem?.title || 'Module';

    if (mode === 'multiple_choice') {
      const pool = allApproved.filter(q => q.question_type === 'multiple_choice');
      const seen = new Set<string>();
      const distinct: Question[] = [];
      for (const q of pool) {
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (!seen.has(norm)) {
          seen.add(norm);
          distinct.push(q);
        }
      }

      if (distinct.length < 200 && topics) {
        const needed = 200 - distinct.length;
        const extra = generateQuestionsFromTopics({
          subjectTitle,
          moduleTitle,
          topics,
          examSet: 'multiple_choice',
          counts: { multiple_choice: needed, identification: 0, true_false: 0 },
        });

        for (const g of extra) {
          if (distinct.length >= 200) break;
          const norm = this.normalizeTextForDuplicateCheck(g.question_text);
          if (!seen.has(norm)) {
            seen.add(norm);
            distinct.push({
              id: g.id,
              subject_id: moduleItem ? moduleItem.subject_id : '',
              module_id: moduleId,
              question_type: 'multiple_choice',
              exam_set: 'multiple_choice',
              question_text: g.question_text,
              choices: g.choices,
              correct_answer: g.correct_answer,
              explanation: g.explanation,
              source_pdf_ref: g.source_ref || `${moduleTitle} Reviewer`,
              topic: g.topic,
              approval_status: 'approved',
            });
          }
        }
      }

      return distinct.sort(() => Math.random() - 0.5).slice(0, 200);
    }

    if (mode === 'identification') {
      const pool = allApproved.filter(q => q.question_type === 'identification');
      const seen = new Set<string>();
      const distinct: Question[] = [];
      for (const q of pool) {
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (!seen.has(norm)) {
          seen.add(norm);
          distinct.push(q);
        }
      }

      if (distinct.length < 200 && topics) {
        const needed = 200 - distinct.length;
        const extra = generateQuestionsFromTopics({
          subjectTitle,
          moduleTitle,
          topics,
          examSet: 'identification',
          counts: { multiple_choice: 0, identification: needed, true_false: 0 },
        });

        for (const g of extra) {
          if (distinct.length >= 200) break;
          const norm = this.normalizeTextForDuplicateCheck(g.question_text);
          if (!seen.has(norm)) {
            seen.add(norm);
            distinct.push({
              id: g.id,
              subject_id: moduleItem ? moduleItem.subject_id : '',
              module_id: moduleId,
              question_type: 'identification',
              exam_set: 'identification',
              question_text: g.question_text,
              correct_answer: g.correct_answer,
              alternative_answers: g.alternative_answers,
              explanation: g.explanation,
              source_pdf_ref: g.source_ref || `${moduleTitle} Reviewer`,
              topic: g.topic,
              approval_status: 'approved',
            });
          }
        }
      }

      return distinct.sort(() => Math.random() - 0.5).slice(0, 200);
    }

    if (mode === 'true_false') {
      const pool = allApproved.filter(q => q.question_type === 'true_false');
      const seen = new Set<string>();
      const distinct: Question[] = [];
      for (const q of pool) {
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (!seen.has(norm)) {
          seen.add(norm);
          distinct.push(q);
        }
      }

      if (distinct.length < 200 && topics) {
        const needed = 200 - distinct.length;
        const extra = generateQuestionsFromTopics({
          subjectTitle,
          moduleTitle,
          topics,
          examSet: 'true_false',
          counts: { multiple_choice: 0, identification: 0, true_false: needed },
        });

        for (const g of extra) {
          if (distinct.length >= 200) break;
          const norm = this.normalizeTextForDuplicateCheck(g.question_text);
          if (!seen.has(norm)) {
            seen.add(norm);
            distinct.push({
              id: g.id,
              subject_id: moduleItem ? moduleItem.subject_id : '',
              module_id: moduleId,
              question_type: 'true_false',
              exam_set: 'true_false',
              question_text: g.question_text,
              choices: ['True', 'False'],
              correct_answer: g.correct_answer,
              explanation: g.explanation,
              source_pdf_ref: g.source_ref || `${moduleTitle} Reviewer`,
              topic: g.topic,
              approval_status: 'approved',
            });
          }
        }
      }

      return distinct.sort(() => Math.random() - 0.5).slice(0, 200);
    }

    // Mixed Examination: 67 Multiple Choice + 67 Identification + 66 True or False = 200 items
    const selectDistinctByType = (type: QuestionType, targetCount: number) => {
      const dedicated = allApproved.filter(q => q.question_type === type && q.exam_set === 'mixed');
      const others = allApproved.filter(q => q.question_type === type && q.exam_set !== 'mixed');

      const seen = new Set<string>();
      const result: Question[] = [];

      for (const q of dedicated) {
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (!seen.has(norm)) {
          seen.add(norm);
          result.push(q);
        }
      }

      for (const q of others) {
        if (result.length >= targetCount) break;
        const norm = this.normalizeTextForDuplicateCheck(q.question_text);
        if (!seen.has(norm)) {
          seen.add(norm);
          result.push(q);
        }
      }

      if (result.length < targetCount && topics) {
        const extra = generateQuestionsFromTopics({
          subjectTitle,
          moduleTitle,
          topics,
          examSet: 'mixed',
          counts: {
            multiple_choice: type === 'multiple_choice' ? targetCount - result.length : 0,
            identification: type === 'identification' ? targetCount - result.length : 0,
            true_false: type === 'true_false' ? targetCount - result.length : 0,
          },
        });

        for (const g of extra) {
          if (result.length >= targetCount) break;
          const norm = this.normalizeTextForDuplicateCheck(g.question_text);
          if (!seen.has(norm)) {
            seen.add(norm);
            result.push({
              id: g.id,
              subject_id: moduleItem ? moduleItem.subject_id : '',
              module_id: moduleId,
              question_type: g.question_type,
              exam_set: 'mixed',
              question_text: g.question_text,
              choices: g.choices,
              correct_answer: g.correct_answer,
              alternative_answers: g.alternative_answers,
              explanation: g.explanation,
              source_pdf_ref: g.source_ref || `${moduleTitle} Reviewer`,
              topic: g.topic,
              approval_status: 'approved',
            });
          }
        }
      }

      return result.sort(() => Math.random() - 0.5).slice(0, targetCount);
    };

    const selectedMC = selectDistinctByType('multiple_choice', 67);
    const selectedID = selectDistinctByType('identification', 67);
    const selectedTF = selectDistinctByType('true_false', 66);

    const combined = [...selectedMC, ...selectedID, ...selectedTF];
    return combined.sort(() => Math.random() - 0.5);
  }

  /**
   * Automatically scores and saves an examination attempt
   */
  static submitExamAttempt(params: {
    studentId: string;
    subjectId: string;
    moduleId?: string | null;
    isComprehensive: boolean;
    examMode: ExamMode;
    questions: Question[];
    rawAnswers: Record<string, string>; // questionId -> answerText
    timeSpentSeconds: number;
  }): ExamAttempt {
    const student = this.getProfiles().find(p => p.id === params.studentId) || this.getCurrentUser();
    const subject = this.getSubjectById(params.subjectId);
    const moduleItem = params.moduleId ? this.getModuleById(params.moduleId) : null;

    let correctCount = 0;
    const answerSubmissions: ExamAnswerSubmission[] = [];

    // Track module breakdown
    const moduleStats: Record<string, { total: number; correct: number; number: number; title: string }> = {};
    // Track type breakdown
    const typeStats: Record<QuestionType, { total: number; correct: number }> = {
      multiple_choice: { total: 0, correct: 0 },
      identification: { total: 0, correct: 0 },
      true_false: { total: 0, correct: 0 },
    };

    for (const q of params.questions) {
      const studentInput = params.rawAnswers[q.id] || '';
      const evalResult = evaluateAnswer(studentInput, q);

      if (evalResult.isCorrect) {
        correctCount++;
      }

      answerSubmissions.push({
        question_id: q.id,
        student_answer: studentInput,
        is_correct: evalResult.isCorrect,
        correct_answer_snapshot: q.correct_answer,
        explanation_snapshot: q.explanation,
        manual_review_flag: evalResult.needsManualReview,
      });

      // Update module stats
      if (!moduleStats[q.module_id]) {
        const m = this.getModuleById(q.module_id);
        moduleStats[q.module_id] = {
          total: 0,
          correct: 0,
          number: m?.module_number || 1,
          title: m?.title || `Module ${q.module_id}`,
        };
      }
      moduleStats[q.module_id].total++;
      if (evalResult.isCorrect) moduleStats[q.module_id].correct++;

      // Update type stats
      typeStats[q.question_type].total++;
      if (evalResult.isCorrect) typeStats[q.question_type].correct++;
    }

    const totalItems = params.questions.length;
    const incorrectCount = totalItems - correctCount;
    const percentage = totalItems > 0 ? Number(((correctCount / totalItems) * 100).toFixed(1)) : 0;

    const module_breakdown: ModuleScoreBreakdown[] = Object.entries(moduleStats).map(([modId, stats]) => ({
      module_id: modId,
      module_title: stats.title,
      module_number: stats.number,
      total_questions: stats.total,
      correct_count: stats.correct,
      score_percentage: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(1)) : 0,
    })).sort((a, b) => a.module_number - b.module_number);

    const type_breakdown: TypeScoreBreakdown[] = (['multiple_choice', 'identification', 'true_false'] as QuestionType[]).map(t => ({
      question_type: t,
      total_questions: typeStats[t].total,
      correct_count: typeStats[t].correct,
      score_percentage: typeStats[t].total > 0 ? Number(((typeStats[t].correct / typeStats[t].total) * 100).toFixed(1)) : 0,
    }));

    const attempt: ExamAttempt = {
      id: `att-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      student_email: student.email,
      subject_id: params.subjectId,
      subject_title: subject?.title || 'Unknown Subject',
      module_id: params.moduleId || null,
      module_title: moduleItem ? moduleItem.title : (params.isComprehensive ? 'Comprehensive Exam (5 Modules)' : null),
      is_comprehensive: params.isComprehensive,
      exam_mode: params.examMode,
      started_at: new Date(Date.now() - params.timeSpentSeconds * 1000).toISOString(),
      submitted_at: new Date().toISOString(),
      score: correctCount,
      total_items: totalItems,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      percentage,
      time_spent_seconds: params.timeSpentSeconds,
      status: 'completed',
      module_breakdown,
      type_breakdown,
      answers: answerSubmissions,
    };

    const attempts = this.getExamAttempts();
    setLocal(STORAGE_KEYS.EXAM_ATTEMPTS, [attempt, ...attempts]);

    return attempt;
  }

  /**
   * Resets the local store to initial preloaded state
   */
  static resetToDefault(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.MODULES);
    localStorage.removeItem(STORAGE_KEYS.REVIEWERS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARD_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.EXAM_ATTEMPTS);
  }
}
