import { extractText } from 'unpdf';

export interface ExtractedPDFResult {
  fullText: string;
  pageCount: number;
  pages: { pageNumber: number; text: string }[];
  wordCount: number;
}

/**
 * Extracts raw and structured text from a PDF Buffer or ArrayBuffer
 */
export async function parsePDFContent(data: ArrayBuffer | Buffer): Promise<ExtractedPDFResult> {
  const result = await extractText(data);
  
  const pages: { pageNumber: number; text: string }[] = [];
  const textArray = Array.isArray(result.text) ? result.text : [result.text];

  let fullText = '';
  textArray.forEach((pageText, index) => {
    const cleaned = (pageText || '').trim();
    pages.push({
      pageNumber: index + 1,
      text: cleaned,
    });
    fullText += `\n--- Page ${index + 1} ---\n` + cleaned;
  });

  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return {
    fullText: fullText.trim(),
    pageCount: pages.length || (result.totalPages ?? 1),
    pages,
    wordCount,
  };
}
