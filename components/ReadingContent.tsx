import type { ReactNode } from 'react';
import type { DailyReading } from '@/lib/db';

const RESPONSE_MARKER = /^(?:["“”']\s*)?(R\.|℟\.|R\/)\s*/i;
const RESPONSE_MARKER_ANYWHERE = /(?:^|\s)(R\.|℟\.|R\/)\s*/i;
const SENTENCE_BOUNDARY = /([.!?])\s+(?=["“”'‘’(]*[A-ZÁÉÍÓÚÜÑ¡¿])/g;

const splitSentences = (text: string): string[] => {
  if (!text) return [];

  SENTENCE_BOUNDARY.lastIndex = 0;

  const sentences: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = SENTENCE_BOUNDARY.exec(text)) !== null) {
    const end = match.index + match[1].length;
    sentences.push(text.slice(lastIndex, end).trim());
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    sentences.push(text.slice(lastIndex).trim());
  }

  return sentences.filter(Boolean);
};

const normalizeResponseContent = (content: string): string =>
  content
    .trim()
    .replace(/^[>"'""\s>]+\n/g, '')
    .replace(/^[>"'""\s>]+/, '')
    .replace(/\n[>"'""\s>]+\n/g, '\n')
    .replace(/\n[>"'""\s]*>\s*/g, '\n')
    .replace(/(?:^|\s+)(R\.|℟\.|R\/)\s*/gi, (_match, marker: string, offset: number) => {
      const prefix = offset === 0 ? '' : '\n\n';
      return `${prefix}${marker} `;
    })
    .trim();

const splitVerseLines = (text: string): string[] =>
  text
    .replace(/;\s*/g, ';\n')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

export function ReadingContent({ reading }: { reading: DailyReading }): ReactNode {
  const hasResponseMarker = RESPONSE_MARKER_ANYWHERE.test(reading.content);
  const isResponseReading =
    (reading.type === 'psalm' || reading.type === 'alleluia') && hasResponseMarker;
  const content = isResponseReading
    ? normalizeResponseContent(reading.content)
    : reading.content
        .replace(/\r\n/g, '\n')
        .replace(/(?<!\n)\n(?!\n)/g, ' ');

  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => {
      if (paragraph.length === 0) return false;
      if (/^[>"'""\s>]+$/.test(paragraph)) return false;
      if (paragraph === '>' || paragraph === '">') return false;
      return true;
    });

  if (isResponseReading) {
    const nodes: ReactNode[] = [];

    paragraphs.forEach((paragraph, paragraphIndex) => {
      const responseMatch = paragraph.match(RESPONSE_MARKER);

      if (responseMatch) {
        const remainder = paragraph.slice(responseMatch[0].length).trim();
        const sentences = splitSentences(remainder);
        const refrainText = [responseMatch[1], sentences[0] || ''].filter(Boolean).join(' ').trim();
        const verseLines = sentences
          .slice(1)
          .flatMap((line) => splitVerseLines(line))
          .filter(Boolean);

        nodes.push(
          <p
            key={`refrain-${paragraphIndex}`}
            className="mb-2 font-semibold text-gray-900 dark:text-gray-100"
          >
            {refrainText || paragraph}
          </p>
        );

        if (verseLines.length) {
          verseLines.forEach((line, lineIndex) => {
            nodes.push(
              <p key={`verse-${paragraphIndex}-${lineIndex}`} className="mb-2 last:mb-0">
                {line}
              </p>
            );
          });
        }

        return;
      }

      nodes.push(
        <p key={`paragraph-${paragraphIndex}`} className="mb-2 last:mb-0">
          {paragraph}
        </p>
      );
    });

    return nodes;
  }

  return paragraphs.map((paragraph, index) => (
    <p key={index} className="mb-4 last:mb-0">
      {paragraph}
    </p>
  ));
}
