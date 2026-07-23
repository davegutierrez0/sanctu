import assert from 'node:assert/strict';
import test from 'node:test';

import { formatFeedbackEmail, validateFeedback } from '../lib/feedback.ts';

test('accepts a concise feedback message and an optional reply address', () => {
  const result = validateFeedback({
    message: 'The new stained-glass hero makes the readings feel more inviting.',
    email: 'reader@example.com',
    language: 'en',
    website: '',
  });

  assert.deepEqual(result, {
    message: 'The new stained-glass hero makes the readings feel more inviting.',
    email: 'reader@example.com',
    language: 'en',
  });
});

test('rejects empty, oversized, and bot-submitted feedback', () => {
  assert.equal(validateFeedback({ message: 'Too short', website: '' }), undefined);
  assert.equal(validateFeedback({ message: 'x'.repeat(2001), website: '' }), undefined);
  assert.equal(validateFeedback({ message: 'This should never be delivered.', website: 'bot.example' }), undefined);
});

test('formats feedback as plain text so visitor input is never rendered as email HTML', () => {
  const email = formatFeedbackEmail({
    message: '<script>not markup</script>',
    email: 'reader@example.com',
    language: 'en',
  });

  assert.match(email, /<script>not markup<\/script>/);
  assert.match(email, /Reply address: reader@example.com/);
  assert.match(email, /Language: en/);
});
