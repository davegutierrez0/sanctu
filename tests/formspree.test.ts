import assert from 'node:assert/strict';
import test from 'node:test';

import { createFormspreeSubmission } from '../lib/formspree.ts';

test('creates an explicit mailing-list signup with a subscriber name and email', () => {
  const result = createFormspreeSubmission({
    intent: 'subscribe',
    firstName: '  Maria ',
    email: ' maria@example.com ',
    message: '',
    language: 'en',
    subscribe: true,
  });

  assert.deepEqual(result, {
    firstName: 'Maria',
    email: 'maria@example.com',
    intent: 'Subscribe for Sanctus and Catholic tech updates',
    language: 'en',
    _subject: 'New Sanctus subscriber: Maria',
  });
});

test('keeps feedback separate from subscriptions unless the visitor opts in', () => {
  const result = createFormspreeSubmission({
    intent: 'feedback',
    firstName: '',
    email: 'reader@example.com',
    message: 'A downloadable daily Mass guide would help me pray offline.',
    language: 'es',
    subscribe: false,
  });

  assert.deepEqual(result, {
    email: 'reader@example.com',
    message: 'A downloadable daily Mass guide would help me pray offline.',
    intent: 'Feedback for Sanctus',
    language: 'es',
    _subject: 'New Sanctus feedback',
  });
});

test('rejects incomplete subscriptions and feedback', () => {
  assert.equal(createFormspreeSubmission({
    intent: 'subscribe',
    firstName: '',
    email: 'reader@example.com',
    message: '',
    language: 'en',
    subscribe: true,
  }), undefined);
  assert.equal(createFormspreeSubmission({
    intent: 'feedback',
    firstName: '',
    email: '',
    message: 'Too short',
    language: 'en',
    subscribe: false,
  }), undefined);
});
