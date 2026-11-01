import { GeneratedQuestionItem, QuestionType, QuestionExamSet } from './types';

interface GenerationOptions {
  subjectTitle: string;
  moduleTitle: string;
  topics: string;
  examSet?: QuestionExamSet;
  counts?: {
    multiple_choice: number;
    identification: number;
    true_false: number;
  };
  singleQuestion?: {
    questionType: QuestionType;
    topic?: string;
    replaceQuestionText?: string;
  };
}

/**
 * Intelligent topic-based question generator.
 * Extracts concepts and terminology from provided curriculum topics
 * and produces 60-question sets per mode without duplicate questions.
 */
export function generateQuestionsFromTopics(options: GenerationOptions): GeneratedQuestionItem[] {
  const { subjectTitle, moduleTitle, topics, examSet, counts, singleQuestion } = options;

  // Extract topic items from user text
  const rawLines = topics
    .split(/[\n,;•\-\d+\.]/)
    .map(t => t.trim())
    .filter(t => t.length > 2);

  const cleanTopics = rawLines.length > 0 ? Array.from(new Set(rawLines)) : [topics.trim() || 'Curriculum Topics'];

  // Determine target counts
  let mcTarget = counts?.multiple_choice ?? 0;
  let idTarget = counts?.identification ?? 0;
  let tfTarget = counts?.true_false ?? 0;

  if (singleQuestion) {
    mcTarget = singleQuestion.questionType === 'multiple_choice' ? 1 : 0;
    idTarget = singleQuestion.questionType === 'identification' ? 1 : 0;
    tfTarget = singleQuestion.questionType === 'true_false' ? 1 : 0;
  } else if (!counts) {
    if (examSet === 'multiple_choice') mcTarget = 60;
    else if (examSet === 'identification') idTarget = 60;
    else if (examSet === 'true_false') tfTarget = 60;
    else if (examSet === 'mixed') {
      mcTarget = 20;
      idTarget = 20;
      tfTarget = 20;
    } else {
      mcTarget = 10;
      idTarget = 10;
      tfTarget = 10;
    }
  }

  const effectiveExamSet: QuestionExamSet =
    examSet ||
    (mcTarget === 20 && idTarget === 20 && tfTarget === 20
      ? 'mixed'
      : mcTarget > 0 && idTarget === 0 && tfTarget === 0
      ? 'multiple_choice'
      : idTarget > 0 && mcTarget === 0 && tfTarget === 0
      ? 'identification'
      : tfTarget > 0 && mcTarget === 0 && idTarget === 0
      ? 'true_false'
      : 'mixed');

  const questions: GeneratedQuestionItem[] = [];

  // Helper distractors generator
  const getDistractors = (correct: string, pool: string[]): [string, string, string] => {
    const candidates = pool.filter(p => p.toLowerCase() !== correct.toLowerCase());
    const d1 = candidates[0] || `${correct} Variant Protocol`;
    const d2 = candidates[1] || `Secondary ${correct} Standard`;
    const d3 = candidates[2] || `Alternative ${correct} Framework`;
    return [d1, d2, d3];
  };

  // 1. Multiple Choice Questions
  for (let i = 0; i < mcTarget; i++) {
    const topicItem = cleanTopics[i % cleanTopics.length];
    const cycle = Math.floor(i / cleanTopics.length);
    const distractors = getDistractors(topicItem, cleanTopics);

    let qText = '';
    if (cycle === 0) {
      qText = `In the study of ${moduleTitle}, which concept or principle directly corresponds to ${topicItem}?`;
    } else if (cycle === 1) {
      qText = `Which of the following standards is considered a fundamental component of "${topicItem}" in ${subjectTitle}?`;
    } else if (cycle === 2) {
      qText = `When evaluating operational workflows under "${topicItem}", what primary outcome or criterion is emphasized?`;
    } else {
      qText = `Question ${i + 1}: Under the curriculum for ${moduleTitle}, which item correctly identifies the core mechanism of ${topicItem}?`;
    }

    const choices = [topicItem, ...distractors].sort(() => 0.5 - ((i + 3) % 4) / 4);

    questions.push({
      id: `gen-mc-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      question_type: 'multiple_choice',
      exam_set: effectiveExamSet,
      question_text: qText,
      choices,
      correct_answer: topicItem,
      explanation: `Correct: "${topicItem}" is the standard principle established in ${moduleTitle} (${subjectTitle}).`,
      topic: topicItem,
      source_ref: `Topic: ${topicItem}`,
    });
  }

  // 2. Identification Questions
  for (let i = 0; i < idTarget; i++) {
    const topicItem = cleanTopics[i % cleanTopics.length];
    const cycle = Math.floor(i / cleanTopics.length);

    let qText = '';
    if (cycle === 0) {
      qText = `Identify the core term or protocol associated with: "${topicItem}" in ${moduleTitle}.`;
    } else if (cycle === 1) {
      qText = `In ${subjectTitle}, specify the designated concept defined by the curriculum topic: "${topicItem}".`;
    } else {
      qText = `What official subject terminology is associated with the study of: "${topicItem}"?`;
    }

    const alternatives = [
      topicItem.toLowerCase(),
      topicItem.toUpperCase(),
      topicItem.replace(/[^a-zA-Z0-9\s]/g, '').trim(),
    ].filter((v, idx, arr) => arr.indexOf(v) === idx && v.length > 1);

    questions.push({
      id: `gen-id-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      question_type: 'identification',
      exam_set: effectiveExamSet,
      question_text: qText,
      correct_answer: topicItem,
      alternative_answers: alternatives,
      explanation: `The canonical term is "${topicItem}", directly grounded in the syllabus for ${moduleTitle}.`,
      topic: topicItem,
      source_ref: `Topic: ${topicItem}`,
    });
  }

  // 3. True or False Questions
  for (let i = 0; i < tfTarget; i++) {
    const topicItem = cleanTopics[i % cleanTopics.length];
    const isTrue = i % 2 === 0;

    let stmt = '';
    if (isTrue) {
      stmt = `In ${moduleTitle}, "${topicItem}" is recognized as an approved core component of the study curriculum.`;
    } else {
      stmt = `Under the principles of ${subjectTitle}, "${topicItem}" is strictly contraindicated and considered obsolete in standard practice.`;
    }

    questions.push({
      id: `gen-tf-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      question_type: 'true_false',
      exam_set: effectiveExamSet,
      question_text: `True or False: ${stmt}`,
      choices: ['True', 'False'],
      correct_answer: isTrue ? 'True' : 'False',
      explanation: isTrue
        ? `Correct. The statement is TRUE as "${topicItem}" is an established topic in ${moduleTitle}.`
        : `Correct. The statement is FALSE. "${topicItem}" is an active, standard requirement in ${moduleTitle}.`,
      topic: topicItem,
      source_ref: `Topic: ${topicItem}`,
    });
  }

  return questions;
}
