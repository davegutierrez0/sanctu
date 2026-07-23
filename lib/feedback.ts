export type FeedbackPayload = {
  message: string;
  email?: string;
  language: 'en' | 'es';
};

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_EMAIL_LENGTH = 254;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validateFeedback(value: unknown): FeedbackPayload | undefined {
  if (!isRecord(value) || typeof value.message !== 'string' || value.website) return undefined;

  const message = value.message.trim();
  if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) return undefined;

  const rawEmail = typeof value.email === 'string' ? value.email.trim() : '';
  if (rawEmail.length > MAX_EMAIL_LENGTH || (rawEmail && !/^\S+@\S+\.\S+$/.test(rawEmail))) return undefined;

  return {
    message,
    ...(rawEmail ? { email: rawEmail } : {}),
    language: value.language === 'es' ? 'es' : 'en',
  };
}

export function formatFeedbackEmail(feedback: FeedbackPayload): string {
  return [
    'New Sanctus feedback',
    `Language: ${feedback.language}`,
    `Reply address: ${feedback.email ?? 'Not provided'}`,
    '',
    feedback.message,
  ].join('\n');
}
