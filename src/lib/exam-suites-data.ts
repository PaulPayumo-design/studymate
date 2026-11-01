import { Question } from './types';
import { CMPA_MIDTERMS_QUESTIONS } from './data/cmpa-questions';
import { NLM_MIDTERMS_QUESTIONS } from './data/nlm-questions';
import { MS_MIDTERMS_QUESTIONS } from './data/ms-questions';

export { CMPA_MIDTERMS_QUESTIONS } from './data/cmpa-questions';
export { NLM_MIDTERMS_QUESTIONS } from './data/nlm-questions';
export { MS_MIDTERMS_QUESTIONS } from './data/ms-questions';

export const ALL_CUSTOM_WEEK_QUESTIONS: Question[] = [
  ...CMPA_MIDTERMS_QUESTIONS,
  ...NLM_MIDTERMS_QUESTIONS,
  ...MS_MIDTERMS_QUESTIONS,
];
