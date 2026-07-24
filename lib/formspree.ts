export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjegvdw';

type SubmissionInput = {
  intent: 'subscribe' | 'feedback';
  firstName: string;
  email: string;
  message: string;
  language: 'en' | 'es';
  subscribe: boolean;
};

type FormspreeSubmission = Record<string, string>;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export function createFormspreeSubmission(input: SubmissionInput): FormspreeSubmission | undefined {
  const firstName = input.firstName.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const hasValidEmail = EMAIL_PATTERN.test(email);

  if (input.intent === 'subscribe') {
    if (!firstName || !hasValidEmail) return undefined;

    return {
      firstName,
      email,
      intent: 'Subscribe for Sanctus and Catholic tech updates',
      language: input.language,
      _subject: `New Sanctus subscriber: ${firstName}`,
    };
  }

  if (message.length < 10 || message.length > 2000 || (email && !hasValidEmail)) return undefined;
  if (input.subscribe && (!firstName || !hasValidEmail)) return undefined;

  return {
    ...(firstName ? { firstName } : {}),
    ...(email ? { email } : {}),
    message,
    intent: input.subscribe ? 'Feedback for Sanctus and Catholic tech updates' : 'Feedback for Sanctus',
    ...(input.subscribe ? { subscribe: 'yes' } : {}),
    language: input.language,
    _subject: input.subscribe ? `New Sanctus feedback and subscriber: ${firstName}` : 'New Sanctus feedback',
  };
}
