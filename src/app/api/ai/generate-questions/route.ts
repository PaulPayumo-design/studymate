import { NextRequest, NextResponse } from 'next/server';
import { QuestionType, GeneratedQuestionItem, QuestionExamSet } from '@/lib/types';
import { generateQuestionsFromTopics } from '@/lib/question-generator-service';

interface RequestPayload {
  subjectTitle: string;
  moduleTitle: string;
  moduleNumber?: number;
  topics: string;
  examSet?: QuestionExamSet;
  counts?: {
    multiple_choice: number;
    identification: number;
    true_false: number;
  };
  targetType?: QuestionType;
  singleQuestion?: {
    questionType: QuestionType;
    topic?: string;
    replaceQuestionText?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestPayload;
    const { subjectTitle, moduleTitle, moduleNumber, topics, counts, targetType, singleQuestion, examSet } = body;

    if (!topics || typeof topics !== 'string' || topics.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Topics cannot be empty. Please enter or paste the topics for this module.' },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openaiKey = process.env.OPENAI_API_KEY?.trim();

    // If external AI key is not configured, generate via STUDYMATE semantic engine
    if (!geminiKey && !openaiKey) {
      const questions = generateQuestionsFromTopics({
        subjectTitle: subjectTitle || 'Subject',
        moduleTitle: moduleTitle || 'Week',
        topics: topics.trim(),
        examSet,
        counts,
        singleQuestion,
      });

      return NextResponse.json({
        success: true,
        configured: false,
        warning: 'AI API credentials are not configured in .env.local; generated using STUDYMATE topic engine.',
        questions,
        count: questions.length,
      });
    }

    // Determine generation specifications
    const isSingleRegen = !!singleQuestion;
    const mcCount = isSingleRegen
      ? singleQuestion.questionType === 'multiple_choice'
        ? 1
        : 0
      : targetType === 'multiple_choice'
      ? counts?.multiple_choice ?? 10
      : targetType
      ? 0
      : counts?.multiple_choice ?? 10;

    const idCount = isSingleRegen
      ? singleQuestion.questionType === 'identification'
        ? 1
        : 0
      : targetType === 'identification'
      ? counts?.identification ?? 10
      : targetType
      ? 0
      : counts?.identification ?? 10;

    const tfCount = isSingleRegen
      ? singleQuestion.questionType === 'true_false'
        ? 1
        : 0
      : targetType === 'true_false'
      ? counts?.true_false ?? 10
      : targetType
      ? 0
      : counts?.true_false ?? 10;

    const totalCount = mcCount + idCount + tfCount;

    if (totalCount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Question count must be at least 1.' },
        { status: 400 }
      );
    }

    // Construct prompt
    const prompt = buildAIPrompt({
      subjectTitle: subjectTitle || 'General Subject',
      moduleTitle: moduleTitle || (moduleNumber ? `Module ${moduleNumber}` : 'Module'),
      topics: topics.trim(),
      mcCount,
      idCount,
      tfCount,
      singleQuestion,
    });

    let rawOutput = '';

    // Priority 1: Gemini API
    if (geminiKey) {
      rawOutput = await callGeminiAPI(geminiKey, prompt);
    } else if (openaiKey) {
      rawOutput = await callOpenAIAPI(openaiKey, prompt);
    }

    // Parse and validate output JSON
    const questions = parseAndValidateQuestions(rawOutput, {
      subjectTitle,
      moduleTitle,
    });

    if (questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          configured: true,
          error: 'The AI model did not return any valid questions matching the schema. Please try again.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      configured: true,
      questions,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error during question generation';
    console.error('[API /api/ai/generate-questions error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: `AI generation failed: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}

function buildAIPrompt(opts: {
  subjectTitle: string;
  moduleTitle: string;
  topics: string;
  mcCount: number;
  idCount: number;
  tfCount: number;
  singleQuestion?: {
    questionType: QuestionType;
    topic?: string;
    replaceQuestionText?: string;
  };
}): string {
  const { subjectTitle, moduleTitle, topics, mcCount, idCount, tfCount, singleQuestion } = opts;

  let requestDetail = '';
  if (singleQuestion) {
    requestDetail = `Generate EXACTLY 1 new, fresh ${singleQuestion.questionType} question for topic "${
      singleQuestion.topic || topics
    }". ${
      singleQuestion.replaceQuestionText
        ? `Make sure it is different from the previous question: "${singleQuestion.replaceQuestionText}".`
        : ''
    }`;
  } else {
    requestDetail = `Generate EXACTLY:
- ${mcCount} Multiple Choice questions (question_type: "multiple_choice")
- ${idCount} Identification questions (question_type: "identification")
- ${tfCount} True or False questions (question_type: "true_false")
Total questions: ${mcCount + idCount + tfCount}`;
  }

  return `You are an expert educational curriculum and assessment specialist for the STUDYMATE learning platform.

CONTEXT:
Subject: "${subjectTitle}"
Module: "${moduleTitle}"
Curriculum Topics:
"""
${topics}
"""

TASK:
${requestDetail}

CRITICAL RULES:
1. Strict Grounding: Every question must be strictly derived from and accurate to the provided curriculum topics above. Do not hallucinate or ask unrelated questions.
2. No Duplicates: Every question must test a distinct concept or aspect. Do not generate repetitive questions.
3. No Difficulty Level: Do NOT include any difficulty rating, difficulty field, or difficulty classification.
4. Multiple Choice Requirements:
   - Provide exactly 4 choices (choices array of 4 unique strings).
   - Exactly 1 choice must be the correct answer.
   - The "correct_answer" must exactly match one of the 4 items in "choices".
   - Distractors must be plausible and derived from the domain.
5. Identification Requirements:
   - The question must present a clear definition, scenario, or question requiring a concise term or short phrase answer.
   - Provide "correct_answer" (the canonical term).
   - Provide "alternative_answers": an array of acceptable synonyms, alternate spellings, or acronyms (e.g. ["OSI", "Open Systems Interconnection"]).
6. True or False Requirements:
   - The question must be a factual statement.
   - "correct_answer" must be strictly either "True" or "False".
7. Explanations:
   - Provide a clear, educational "explanation" for why the answer is correct for every question.
8. Topic:
   - Assign a concise "topic" (e.g. "Data Link Layer", "TCP 3-Way Handshake") indicating which specific subtopic the question addresses.

OUTPUT FORMAT:
Return ONLY a valid, raw JSON array of objects. Do not include markdown code fences, headers, or any other conversational text.

JSON Schema for each object:
{
  "question_type": "multiple_choice" | "identification" | "true_false",
  "question_text": "...",
  "choices": ["Option A", "Option B", "Option C", "Option D"], // ONLY for multiple_choice, omit or empty array for other types
  "correct_answer": "...", // strictly "True" or "False" for true_false
  "alternative_answers": ["...", "..."], // array of accepted synonyms for identification
  "explanation": "...",
  "topic": "..."
}`;
}

async function callGeminiAPI(apiKey: string, prompt: string): Promise<string> {
  // Test gemini-2.5-flash then fallback to gemini-1.5-flash
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${model} - HTTP ${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        return candidateText;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Continue to next model if available
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini API.');
}

async function callOpenAIAPI(apiKey: string, prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an educational curriculum assessment expert who outputs strict JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (HTTP ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  return content;
}

function parseAndValidateQuestions(
  rawText: string,
  context: { subjectTitle: string; moduleTitle: string }
): GeneratedQuestionItem[] {
  let cleaned = rawText.trim();

  // Strip code fences if model returned them
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // If wrapped in an object like { questions: [...] }
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (e2) {
        throw new Error(`Failed to parse AI output as JSON: ${(e2 as Error).message}`);
      }
    } else {
      throw new Error('AI output did not contain a valid JSON array.');
    }
  }

  // If object has a questions key
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    const record = parsed as Record<string, unknown>;
    if (Array.isArray(record.questions)) {
      parsed = record.questions;
    }
  }

  if (!Array.isArray(parsed)) {
    throw new Error('AI output must be an array of questions.');
  }

  const validated: GeneratedQuestionItem[] = [];

  parsed.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const q = item as Record<string, unknown>;

    const qText = typeof q.question_text === 'string' ? q.question_text.trim() : '';
    if (!qText) return;

    let qType: QuestionType = 'multiple_choice';
    if (q.question_type === 'identification' || q.question_type === 'true_false') {
      qType = q.question_type;
    }

    let correctAnswer = typeof q.correct_answer === 'string' ? q.correct_answer.trim() : '';
    let choices: string[] | undefined = undefined;
    let altAnswers: string[] | undefined = undefined;

    if (qType === 'multiple_choice') {
      if (Array.isArray(q.choices)) {
        choices = q.choices.map(c => String(c).trim()).filter(Boolean);
      }
      if (!choices || choices.length < 2) {
        choices = [correctAnswer || 'Option A', 'Option B', 'Option C', 'Option D'];
      }
      // Ensure correct answer is one of choices
      if (!choices.includes(correctAnswer)) {
        choices[0] = correctAnswer || choices[0];
      }

      // Balance correct answer position across A, B, C, D (0, 1, 2, 3)
      const correctIdx = choices.findIndex(c => c.trim().toLowerCase() === correctAnswer.trim().toLowerCase());
      if (correctIdx !== -1) {
        const correctChoice = choices[correctIdx];
        const distractors = choices.filter((_, idx) => idx !== correctIdx);
        while (distractors.length < 3) {
          distractors.push(`Alternative option ${distractors.length + 1}`);
        }
        // Shuffle distractors
        for (let d = distractors.length - 1; d > 0; d--) {
          const rand = Math.floor(Math.random() * (d + 1));
          [distractors[d], distractors[rand]] = [distractors[rand], distractors[d]];
        }
        const targetIdx = index % 4;
        const balancedChoices: string[] = [];
        let dPtr = 0;
        for (let pos = 0; pos < 4; pos++) {
          if (pos === targetIdx) {
            balancedChoices.push(correctChoice);
          } else {
            balancedChoices.push(distractors[dPtr++]);
          }
        }
        choices = balancedChoices;
      }
    } else if (qType === 'true_false') {
      const lower = correctAnswer.toLowerCase();
      correctAnswer = lower.includes('true') ? 'True' : 'False';
      choices = ['True', 'False'];
    } else if (qType === 'identification') {
      if (Array.isArray(q.alternative_answers)) {
        altAnswers = q.alternative_answers.map(a => String(a).trim()).filter(Boolean);
      }
    }

    const explanation =
      typeof q.explanation === 'string' && q.explanation.trim()
        ? q.explanation.trim()
        : `Verified answer for ${context.moduleTitle}.`;

    const topic =
      typeof q.topic === 'string' && q.topic.trim() ? q.topic.trim() : `${context.moduleTitle} Topic`;

    validated.push({
      id: `gen-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      question_type: qType,
      question_text: qText,
      choices,
      correct_answer: correctAnswer,
      alternative_answers: altAnswers,
      explanation,
      topic,
      source_ref: `Topic: ${topic} (${context.subjectTitle})`,
    });
  });

  return validated;
}
