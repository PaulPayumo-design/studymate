import { NextRequest, NextResponse } from 'next/server';
import { parsePDFContent } from '@/lib/pdf-extractor';
import { generateQuestionsAndFlashcardsStrict } from '@/lib/question-generator';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subjectId = formData.get('subjectId') as string;
    const moduleId = formData.get('moduleId') as string;
    const moduleTitle = formData.get('moduleTitle') as string || 'Module';
    const mcTarget = parseInt(formData.get('mcTarget') as string || '10', 10);
    const idTarget = parseInt(formData.get('idTarget') as string || '5', 10);
    const tfTarget = parseInt(formData.get('tfTarget') as string || '5', 10);

    if (!file) {
      return NextResponse.json({ error: 'No PDF file was provided.' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF documents are supported.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const parsed = await parsePDFContent(arrayBuffer);

    if (!parsed.fullText || parsed.fullText.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Could not extract readable text from this PDF. It may be a scanned image without OCR. Please upload a searchable PDF.',
        },
        { status: 422 }
      );
    }

    // Strictly generate suggested questions and flashcards strictly from the extracted text
    const generationResult = generateQuestionsAndFlashcardsStrict({
      subjectId,
      moduleId,
      moduleTitle,
      pdfFileName: file.name,
      extractedText: parsed.fullText,
      targetCount: {
        multipleChoice: mcTarget,
        identification: idTarget,
        trueFalse: tfTarget,
      },
    });

    return NextResponse.json({
      fileName: file.name,
      fileSize: file.size,
      pageCount: parsed.pageCount,
      wordCount: parsed.wordCount,
      extractedText: parsed.fullText,
      pages: parsed.pages,
      suggestedQuestions: generationResult.questions,
      suggestedFlashcards: generationResult.flashcards,
      sourceWarnings: generationResult.sourceWarnings,
      sufficientContent: generationResult.sufficientContent,
    });
  } catch (error: unknown) {
    console.error('PDF extraction failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse PDF document.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
