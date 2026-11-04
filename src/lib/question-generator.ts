import { Question, Flashcard, QuestionDifficulty } from './types';

export interface GenerationRequest {
  subjectId: string;
  moduleId: string;
  moduleTitle: string;
  pdfFileName: string;
  extractedText: string;
  targetCount?: {
    multipleChoice: number;
    identification: number;
    trueFalse: number;
  };
}

export interface GenerationResult {
  questions: Question[];
  flashcards: Flashcard[];
  sourceWarnings: string[];
  sufficientContent: boolean;
}

interface FactSnippet {
  term: string;
  definition: string;
  fullSentence: string;
  pageOrSection?: string;
}

/**
 * Extracts factual definitions and concept statements strictly from the text
 */
function extractFactsFromText(text: string): FactSnippet[] {
  const facts: FactSnippet[] = [];
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 350);

  const definitionPatterns = [
    /^([A-Z][A-Za-z0-9\s-]{2,45})\s+is\s+(?:defined as|a|an|the)\s+(.+)$/i,
    /^([A-Z][A-Za-z0-9\s-]{2,45})\s+refers\s+to\s+(.+)$/i,
    /^([A-Z][A-Za-z0-9\s-]{2,45})\s+serves\s+to\s+(.+)$/i,
    /^([A-Z][A-Za-z0-9\s-]{2,45})\s+means\s+(.+)$/i,
    /^([A-Z][A-Za-z0-9\s-]{2,45})\s*:\s*(.+)$/i,
    /^The primary function of\s+([A-Za-z0-9\s-]{2,40})\s+is\s+(.+)$/i,
    /^In networking,\s+([A-Za-z0-9\s-]{2,40})\s+is\s+(.+)$/i,
  ];

  for (const sentence of sentences) {
    for (const pattern of definitionPatterns) {
      const match = sentence.match(pattern);
      if (match) {
        const term = match[1].trim();
        const definition = match[2].trim().replace(/\.$/, '');
        if (term.length >= 3 && definition.length >= 15 && !facts.some(f => f.term.toLowerCase() === term.toLowerCase())) {
          facts.push({
            term,
            definition,
            fullSentence: sentence,
          });
          break;
        }
      }
    }
  }

  // If strict patterns yielded few, extract key statements with colons or dashes
  if (facts.length < 15) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.includes(' - ') || line.includes(': ')) {
        const parts = line.includes(' - ') ? line.split(' - ') : line.split(': ');
        if (parts.length === 2) {
          const term = parts[0].replace(/^[-*•\d.]+\s*/, '').trim();
          const def = parts[1].trim();
          if (term.length >= 3 && term.length <= 45 && def.length >= 15 && def.length <= 250) {
            if (!facts.some(f => f.term.toLowerCase() === term.toLowerCase())) {
              facts.push({
                term,
                definition: def,
                fullSentence: line,
              });
            }
          }
        }
      }
    }
  }

  return facts;
}

/**
 * Strictly generates questions and flashcards based ONLY on the supplied PDF text.
 */
export function generateQuestionsAndFlashcardsStrict(
  request: GenerationRequest
): GenerationResult {
  const {
    subjectId,
    moduleId,
    pdfFileName,
    extractedText,
    targetCount = { multipleChoice: 10, identification: 5, trueFalse: 5 }
  } = request;

  const warnings: string[] = [];
  const words = extractedText.split(/\s+/).filter(Boolean);

  if (words.length < 100) {
    warnings.push('Uploaded PDF contains insufficient readable text (fewer than 100 words). More source material is needed.');
    return {
      questions: [],
      flashcards: [],
      sourceWarnings: warnings,
      sufficientContent: false,
    };
  }

  const facts = extractFactsFromText(extractedText);

  if (facts.length < 5) {
    warnings.push('The extracted text does not contain enough clear definition statements or structured concepts. Flagging for manual administrator review.');
  }

  const questions: Question[] = [];
  const flashcards: Flashcard[] = [];

  // Generate Flashcards from all facts
  facts.forEach((fact, i) => {
    flashcards.push({
      id: `gen-fc-${Date.now()}-${i}`,
      subject_id: subjectId,
      module_id: moduleId,
      front_text: `What is ${fact.term}?`,
      back_text: fact.definition,
      source_ref: `${pdfFileName} (Excerpt: "${fact.fullSentence.slice(0, 80)}...")`,
      approval_status: 'pending',
      created_at: new Date().toISOString(),
    });
  });

  // Generate Multiple Choice questions
  const mcTarget = targetCount.multipleChoice;
  let mcCount = 0;
  for (let i = 0; i < facts.length && mcCount < mcTarget; i++) {
    const fact = facts[i];
    // Gather distractors from other facts in the same PDF
    const otherDefs = facts.filter((_, idx) => idx !== i).map(f => f.definition);
    const distractors: string[] = [];
    for (const d of otherDefs) {
      if (distractors.length < 3) {
        distractors.push(d);
      }
    }

    // If not enough distractors from facts, create plausible distractors from sentences
    while (distractors.length < 3) {
      distractors.push(`None of the given characteristics describe ${fact.term}`);
      distractors.push(`Refers exclusively to unverified peripheral configurations`);
      distractors.push(`A deprecated legacy convention not supported in this architecture`);
    }

    // Balanced distribution of the correct answer across Option A, B, C, D (0, 1, 2, 3)
    const targetIdx = mcCount % 4;

    // Shuffle distractors using Fisher-Yates
    const candidateDistractors = [...distractors.slice(0, 3)];
    while (candidateDistractors.length < 3) {
      candidateDistractors.push(`Alternative clinical standard ${candidateDistractors.length + 1}`);
    }
    for (let d = candidateDistractors.length - 1; d > 0; d--) {
      const rand = Math.floor(Math.random() * (d + 1));
      [candidateDistractors[d], candidateDistractors[rand]] = [candidateDistractors[rand], candidateDistractors[d]];
    }

    const choices: string[] = [];
    let dPtr = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === targetIdx) {
        choices.push(fact.definition);
      } else {
        choices.push(candidateDistractors[dPtr++]);
      }
    }

    questions.push({
      id: `gen-q-mc-${Date.now()}-${mcCount}`,
      subject_id: subjectId,
      module_id: moduleId,
      question_type: 'multiple_choice',
      question_text: `Based on the module reviewer, what is the definition or role of "${fact.term}"?`,
      choices,
      correct_answer: fact.definition,
      explanation: `According to ${pdfFileName}: "${fact.fullSentence}"`,
      source_pdf_ref: `${pdfFileName}`,
      source_excerpt: fact.fullSentence,
      difficulty: (['easy', 'medium', 'hard'] as QuestionDifficulty[])[mcCount % 3],
      approval_status: 'pending',
      manual_verification_flag: fact.definition.length > 180,
      created_at: new Date().toISOString(),
    });
    mcCount++;
  }

  // Generate Identification questions
  const idTarget = targetCount.identification;
  let idCount = 0;
  for (let i = mcCount; i < facts.length && idCount < idTarget; i++) {
    const fact = facts[i];
    // Alternate answers can include lowercase, or without acronym
    const altAnswers: string[] = [];
    if (fact.term.includes('(') && fact.term.includes(')')) {
      const match = fact.term.match(/\(([^)]+)\)/);
      if (match) altAnswers.push(match[1]);
      const withoutParen = fact.term.replace(/\s*\([^)]+\)/, '').trim();
      if (withoutParen) altAnswers.push(withoutParen);
    }

    questions.push({
      id: `gen-q-id-${Date.now()}-${idCount}`,
      subject_id: subjectId,
      module_id: moduleId,
      question_type: 'identification',
      question_text: `Identify the term: ${fact.definition}`,
      correct_answer: fact.term,
      alternative_answers: altAnswers,
      explanation: `Exact source excerpt from ${pdfFileName}: "${fact.fullSentence}"`,
      source_pdf_ref: `${pdfFileName}`,
      source_excerpt: fact.fullSentence,
      difficulty: 'medium',
      approval_status: 'pending',
      manual_verification_flag: false,
      created_at: new Date().toISOString(),
    });
    idCount++;
  }

  // Generate True or False questions
  const tfTarget = targetCount.trueFalse;
  let tfCount = 0;
  for (let i = mcCount + idCount; i < facts.length && tfCount < tfTarget; i++) {
    const fact = facts[i];
    const isTrue = tfCount % 2 === 0;

    if (isTrue) {
      questions.push({
        id: `gen-q-tf-${Date.now()}-${tfCount}`,
        subject_id: subjectId,
        module_id: moduleId,
        question_type: 'true_false',
        question_text: `True or False: According to the module reviewer, ${fact.fullSentence.replace(/\.$/, '')}.`,
        choices: ['True', 'False'],
        correct_answer: 'True',
        explanation: `Verbatim from ${pdfFileName}: "${fact.fullSentence}"`,
        source_pdf_ref: `${pdfFileName}`,
        source_excerpt: fact.fullSentence,
        difficulty: 'easy',
        approval_status: 'pending',
        manual_verification_flag: false,
        created_at: new Date().toISOString(),
      });
    } else {
      // Form a negated or inverted statement
      const invertedSentence = `${fact.term} does not serve to ${fact.definition.toLowerCase()}`;
      questions.push({
        id: `gen-q-tf-${Date.now()}-${tfCount}`,
        subject_id: subjectId,
        module_id: moduleId,
        question_type: 'true_false',
        question_text: `True or False: According to the module reviewer, ${invertedSentence}.`,
        choices: ['True', 'False'],
        correct_answer: 'False',
        explanation: `False because the reviewer states: "${fact.fullSentence}"`,
        source_pdf_ref: `${pdfFileName}`,
        source_excerpt: fact.fullSentence,
        difficulty: 'medium',
        approval_status: 'pending',
        manual_verification_flag: true,
        created_at: new Date().toISOString(),
      });
    }
    tfCount++;
  }

  return {
    questions,
    flashcards,
    sourceWarnings: warnings,
    sufficientContent: questions.length >= (mcTarget + idTarget + tfTarget) / 2,
  };
}
