import {
  UserProfile,
  Subject,
  Module,
  UploadedReviewer,
  Question,
  Flashcard,
  ExamAttempt,
} from './types';
import { ALL_CUSTOM_WEEK_QUESTIONS } from './exam-suites-data';
import { ALL_INITIAL_FLASHCARDS } from './data/flashcards-data';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-admin-01',
    email: 'admin@studymate.local',
    full_name: 'Prof. Sarah Connor',
    role: 'admin',
    avatar_url: '',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-student-01',
    email: 'student@studymate.local',
    full_name: 'Shaina',
    role: 'student',
    avatar_url: '',
    created_at: '2026-01-12T09:30:00Z',
  },
  {
    id: 'user-student-02',
    email: 'maria@studymate.local',
    full_name: 'Maria Santos',
    role: 'student',
    avatar_url: '',
    created_at: '2026-01-15T11:00:00Z',
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-cmpa',
    title: 'Community & Maternal-Child Health Nursing (CMPA)',
    code: 'CMPA - 301',
    description: 'Community organizing participatory action research (COPAR), maternal-child care, cold chain immunization, and communicable disease control.',
    created_by: 'user-admin-01',
    created_at: '2026-01-12T08:00:00Z',
    modules_count: 1,
    weeks_count: 1,
  },
  {
    id: 'sub-nlm',
    title: 'Nursing Leadership & Management (NLM)',
    code: 'NLM - 401',
    description: 'Management functions, leadership theories, staffing acuity, delegation rights, TQM, and RA 9173 ethical-legal frameworks.',
    created_by: 'user-admin-01',
    created_at: '2026-01-12T08:00:00Z',
    modules_count: 1,
    weeks_count: 1,
  },
  {
    id: 'sub-ms',
    title: 'Medical-Surgical Nursing (MSN)',
    code: 'MSN - 302',
    description: 'Perioperative care, fluid-electrolyte & acid-base disturbances, acute coronary syndromes, shock, and acute neuro-endocrine crises.',
    created_by: 'user-admin-01',
    created_at: '2026-01-12T08:00:00Z',
    modules_count: 1,
    weeks_count: 1,
  },
];

export const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-cmpa-midterms',
    subject_id: 'sub-cmpa',
    module_number: 1,
    title: 'CMPA_W6-10_MIDTERMS',
    description: 'Official Midterm examination suite for CMPA411 (Competency Appraisal 1 - Modules #6 to #10): Nursing Care Management for Maternal and Child Health, Complications of Childbearing, Care of the Newborn, Pediatric Nursing Care of At Risk, and Community Health Nursing.',
    topics: 'Obstetrics, Oogenesis & Follicle Development, Menstrual Cycle Phases, Fetal Circulation & Shunts, Gravidity & Parity, Signs of Pregnancy, Cardinal Movements, 5 Ps of Labor, Incompetent Cervix & Cerclage, Hydatidiform Mole, Rh Incompatibility & RhoGAM, PIH & Magnesium Sulfate, GDM, Hyperemesis Gravidarum, Placenta Previa, Abruptio Placentae, Umbilical Cord Prolapse, PPH & Uterotonic Drugs, Newborn Care & APGAR, Vitamin K & Eye Prophylaxis, Heat Loss & Primitive Reflexes, Growth & Development Theories, Tetralogy of Fallot, Clubfoot Ponseti, Cleft Lip/Palate, Hirschsprung, Wilms Tumor, Asthma, ALL, DKA, Rheumatic Fever, Dengue Defervescence Warning Signs, STIs & HPV Vaccine, IMCI Color Coding, Communicable Diseases & DOTS, COPAR 4 Phases, Vaccine Procurement Formula.',
    order_index: 1,
    exam_time_limit_minutes: 60,
    exam_question_count: 60,
    question_distribution: {
      multiple_choice: 60,
      identification: 60,
      true_false: 60,
      additional_mc: 20,
      additional_id: 20,
      additional_tf: 20,
    },
    study_progress: 100,
    created_at: '2026-01-12T08:00:00Z',
  },
  {
    id: 'mod-nlm-midterms',
    subject_id: 'sub-nlm',
    module_number: 1,
    title: 'NLM_W7-11_MIDTERMS',
    description: 'Official Midterm examination suite for NCMB 419 (Nursing Leadership and Management - Weeks #7 to #11): Records Management, Healthcare Collaboration, Organizational Theory & Bureaucracy, Planning, Budgeting, Staffing & PCS, and Application of Research in Nursing Leadership.',
    topics: 'Records Management Definition & Principles, RA 10173 Data Privacy Act, Sentinel Events & Incident Reports, Kardex & 201 File, Records Lifecycle, Intra/Inter/Transdisciplinary Collaboration, Tuckman\'s Stages of Team Development, Task & Maintenance Roles, Preceptorship & Mentorship, Nurse-Physician Relationships & Peplau Phases, Max Weber Bureaucracy, Line vs Staff vs Matrix Structures, Organizing Principles (Unity of Command, Scalar, Span of Control, Exception), Planning by Henri Fayol, SWOT Analysis, Operational vs Strategic Planning, Kurt Lewin Change Theory, Budgeting Types & Methods, Time Management, Patient Care Classification System (Levels I-IV), RA 5901 Forty Hour Week Law, Reliever & Staffing Computations, Cyclical Scheduling, Nursing Research (Polit & Beck), Feasibility & Pilot Studies, Reflective Journaling, Evidence-Based Practice (EBP), Training Needs Analysis (TNA).',
    order_index: 1,
    exam_time_limit_minutes: 60,
    exam_question_count: 60,
    question_distribution: {
      multiple_choice: 60,
      identification: 60,
      true_false: 60,
      additional_mc: 20,
      additional_id: 20,
      additional_tf: 20,
    },
    study_progress: 100,
    created_at: '2026-01-12T08:00:00Z',
  },
  {
    id: 'mod-ms-midterms',
    subject_id: 'sub-ms',
    module_number: 1,
    title: 'MS_W7-10_MIDTERMS',
    description: 'Official Midterm examination suite for NCMB 418 & 312 (Medical-Surgical Nursing - Modules #7 to #10): Nursing Care of Clients with Altered Tissue Perfusion, Cardiac Dysrhythmias, Hemodynamic Monitoring, Gastrointestinal, Liver & Pancreatic Disorders, Metabolic Emergencies, and Renal Disorders.',
    topics: 'Cardiovascular A&P, Chambers, Heart Valves & Coronary Circulation, Electrophysiologic Properties & Conduction System, Cardiac Output & Stroke Volume Factors, CAD & Atherosclerosis Risk Factors & Pathophysiology, Cardiac Biomarkers (Troponin, CK-MB, Myoglobin, LDH), ECG Findings & Arrhythmias (Sinus Bradycardia/Tachycardia, AFib, AFlutter, SVT, PVCs, VT, Torsades, VF, Heart Blocks Mobitz I & II, 3rd Degree, Asystole, PEA H\'s & T\'s), Cardioversion vs Defibrillation, Hemodynamic Monitoring (CVP, PCWP, SVR, PVR, PAP, SvO2, Normal Values), Myocardial Infarction Management (OMEN, Thrombolytics, Beta-Blockers, Catheterization Care), Heart Failure (Left vs Right Signs, BNP, Pulmonary Edema HOPE, DR. BEDS, Digoxin & Diuretics), Gastrointestinal Tract A&P & Diagnostics (EGD, Colonoscopy, ERCP, Liver Biopsy), GI Bleeding (Upper vs Lower, PUD, Varices), Alcohol Withdrawal Syndrome & CIWA-AR, Delirium Tremens, Liver Cirrhosis & Paracentesis, Pancreatitis (Acute ATTACK vs Chronic CHANGE, Cullen\'s & Grey Turner\'s Signs), Metabolic Emergencies (Diabetes Mellitus Types 1 & 2, DKA, HHS, SIADH), Renal System Functions & Nephron Structures, Acute Kidney Injury (DAAMN Nephrotoxic Drugs, Phases: Onset, Oliguric, Diuretic, Recovery), Chronic Kidney Disease (GFR Stages 1-5, Uremic Signs, Renvela), Dialysis (Hemodialysis vs Peritoneal Dialysis, Peritonitis, Dialysis Disequilibrium Syndrome, AV Fistula Care).',
    order_index: 1,
    exam_time_limit_minutes: 60,
    exam_question_count: 60,
    question_distribution: {
      multiple_choice: 60,
      identification: 60,
      true_false: 60,
      additional_mc: 20,
      additional_id: 20,
      additional_tf: 20,
    },
    study_progress: 100,
    created_at: '2026-01-12T08:00:00Z',
  },
];

export const INITIAL_REVIEWERS: UploadedReviewer[] = [
  {
    id: 'rev-cmpa-1',
    subject_id: 'sub-cmpa',
    module_id: 'mod-cmpa-midterms',
    file_name: 'CMPA411_Midterms_Modules_6-10.pdf',
    file_size_bytes: 5843241,
    extracted_at: '2026-01-12T09:00:00Z',
    status: 'processed',
    summary: 'Official Midterms Reviewer for CMPA411 covering Modules #6 to #10 (54 pages): Maternal and Child Health, Complications of Childbearing, Care of the Newborn, Pediatric Care of At Risk, and Community Health Nursing.',
    extracted_text: `MIDTERMS: CMPA411 (COMPETENCY APPRAISAL 1)
MODULE #6: NURSING CARE MANAGEMENT FOR MATERNAL AND CHILD HEALTH (Pages 1-9)
MODULE #7: CARE OF MOTHER WITH COMPLICATIONS OF CHILDBEARING (Pages 10-24)
MODULE #8: CARE OF THE NEWBORN (PEDIA WELL) (Pages 25-32)
MODULE #9: PEDIATRIC NURSING CARE OF AT RISK (Pages 33-43)
MODULE #10: COMMUNITY HEALTH NURSING (Pages 44-54)
Exclusively extracted for strict no-hallucination examination generation.`,
    created_at: '2026-01-12T09:00:00Z',
  },
  {
    id: 'rev-nlm-1',
    subject_id: 'sub-nlm',
    module_id: 'mod-nlm-midterms',
    file_name: 'NCMB419_NLM_Midterms_Weeks_7-11.pdf',
    file_size_bytes: 3455477,
    extracted_at: '2026-01-12T09:00:00Z',
    status: 'processed',
    summary: 'Official Midterms Reviewer for NCMB 419 covering Weeks #7 to #11 (24 pages): Records Management, Collaboration, Organizational Theory & Bureaucracy, Planning, Budgeting, Staffing & PCS, and Research in Leadership.',
    extracted_text: `MIDTERMS: NCMB 419 (NLM)
WEEK #7: RECORDS MANAGEMENT (Pages 1-4)
WEEK #8: INTRA-DISCIPLINARY, INTERDISCIPLINARY, MULTIDISCIPLINARY & WORK COLLABORATION (Pages 5-7)
WEEK #9.1: NURSING MANAGEMENT FUNCTIONS - ORGANIZATIONAL THEORY AND BUREAUCRACY (Pages 8-11)
WEEK #9.2: THE MANAGEMENT PROCESS - PLANNING, BUDGETING, TIME MANAGEMENT (Pages 12-17)
WEEK #10: STAFFING, PATIENT CARE CLASSIFICATION SYSTEM, SCHEDULING (Pages 18-21)
WEEK #11: APPLICATION OF RESEARCH IN NURSING LEADERSHIP AND MANAGEMENT (Pages 22-24)
Exclusively extracted for strict no-hallucination examination generation.`,
    created_at: '2026-01-12T09:00:00Z',
  },
  {
    id: 'rev-ms-1',
    subject_id: 'sub-ms',
    module_id: 'mod-ms-midterms',
    file_name: 'MS_W7-10_MIDTERMS.pdf',
    file_size_bytes: 2658853,
    extracted_at: '2026-01-12T09:00:00Z',
    status: 'processed',
    summary: 'Official Midterms Reviewer for Medical-Surgical Nursing covering Modules #7 to #10 (37 pages): Altered Tissue Perfusion, Cardiac Dysrhythmias, Hemodynamic Monitoring, Gastrointestinal, Liver & Pancreatic Disorders, Metabolic Emergencies, and Renal System Disorders.',
    extracted_text: `MIDTERMS: NCMB 418 & 312 (MEDICAL-SURGICAL NURSING)
MODULE #7: NURSING CARE OF CLIENTS WITH ALTERED TISSUE PERFUSION (Pages 1-6)
MODULE #8: CARDIAC DYSRHYTHMIAS (Pages 7-11)
MODULE #8 (NCMB 312): HEMODYNAMIC MONITORING (Pages 12-14)
MODULE #8 (PART 2): CORONARY ARTERY DISEASES, DYSRHYTHMIAS & HEART FAILURE (Pages 15-25)
MODULE #9: GI TRACT, LIVER, AND PANCREAS (Pages 26-30)
MODULE #10: METABOLIC EMERGENCIES (Pages 31-33)
MODULE #10: RENAL SYSTEM (Pages 34-37)
Exclusively extracted for strict no-hallucination examination generation.`,
    created_at: '2026-01-12T09:00:00Z',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  ...ALL_CUSTOM_WEEK_QUESTIONS,
];

export const INITIAL_FLASHCARDS: Flashcard[] = ALL_INITIAL_FLASHCARDS;

export const INITIAL_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'att-sample-01',
    student_id: 'user-student-01',
    student_name: 'Shaina',
    student_email: 'student@studymate.local',
    subject_id: 'sub-cmpa',
    subject_title: 'Community & Maternal-Child Health Nursing (CMPA)',
    module_id: 'mod-cmpa-midterms',
    module_title: 'CMPA_W6-10_MIDTERMS',
    is_comprehensive: false,
    exam_mode: 'mixed',
    started_at: '2026-01-18T14:00:00Z',
    submitted_at: '2026-01-18T14:45:00Z',
    score: 54,
    total_items: 60,
    correct_count: 54,
    incorrect_count: 6,
    percentage: 90.0,
    time_spent_seconds: 2700,
    status: 'completed',
    module_breakdown: [
      {
        module_id: 'mod-cmpa-midterms',
        module_title: 'CMPA_W6-10_MIDTERMS',
        module_number: 1,
        total_questions: 60,
        correct_count: 54,
        score_percentage: 90.0,
      },
    ],
    type_breakdown: [
      {
        question_type: 'multiple_choice',
        total_questions: 20,
        correct_count: 19,
        score_percentage: 95.0,
      },
      {
        question_type: 'identification',
        total_questions: 20,
        correct_count: 17,
        score_percentage: 85.0,
      },
      {
        question_type: 'true_false',
        total_questions: 20,
        correct_count: 18,
        score_percentage: 90.0,
      },
    ],
    answers: [],
  },
];
