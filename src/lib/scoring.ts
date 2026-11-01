import { Question } from './types';

/**
 * Normalizes an answer string:
 * - Trims leading and trailing spaces
 * - Replaces consecutive whitespace with a single space
 * - Converts to lower case
 * - Strips trailing punctuation (periods, commas, etc.)
 */
export function normalizeAnswer(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '');
}

/**
 * Computes Levenshtein edit distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export interface AnswerEvaluationResult {
  isCorrect: boolean;
  needsManualReview: boolean;
  matchedAnswer: string;
}

/**
 * Checks an identification answer against the question's correct answer
 * and any administrator-approved alternative answers.
 */
export function evaluateIdentificationAnswer(
  studentAnswer: string,
  question: Question
): AnswerEvaluationResult {
  const normalizedStudent = normalizeAnswer(studentAnswer);
  if (!normalizedStudent) {
    return { isCorrect: false, needsManualReview: false, matchedAnswer: '' };
  }

  const acceptedAnswers = [
    question.correct_answer,
    ...(question.alternative_answers || []),
  ];

  for (const accepted of acceptedAnswers) {
    const normalizedAccepted = normalizeAnswer(accepted);
    if (normalizedStudent === normalizedAccepted) {
      return { isCorrect: true, needsManualReview: false, matchedAnswer: accepted };
    }
  }

  // Check for very close matches (small typo / uncertain)
  for (const accepted of acceptedAnswers) {
    const normalizedAccepted = normalizeAnswer(accepted);
    const dist = levenshteinDistance(normalizedStudent, normalizedAccepted);
    const maxLen = Math.max(normalizedStudent.length, normalizedAccepted.length);

    // If string length is > 5 and distance is 1 or 2, flag for manual review
    if (maxLen > 5 && dist <= 2) {
      return {
        isCorrect: false,
        needsManualReview: true,
        matchedAnswer: accepted,
      };
    }
  }

  return { isCorrect: false, needsManualReview: false, matchedAnswer: '' };
}

/**
 * Evaluates any question type (Multiple Choice, True/False, Identification)
 */
export function evaluateAnswer(
  studentAnswer: string,
  question: Question
): AnswerEvaluationResult {
  if (question.question_type === 'identification') {
    return evaluateIdentificationAnswer(studentAnswer, question);
  }

  if (question.question_type === 'true_false') {
    const normStudent = normalizeAnswer(studentAnswer);
    const normCorrect = normalizeAnswer(question.correct_answer);
    const isCorrect = normStudent === normCorrect ||
      (normStudent === 't' && normCorrect === 'true') ||
      (normStudent === 'f' && normCorrect === 'false');
    return { isCorrect, needsManualReview: false, matchedAnswer: question.correct_answer };
  }

  // Multiple Choice
  const isCorrect = studentAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
  return { isCorrect, needsManualReview: false, matchedAnswer: question.correct_answer };
}
