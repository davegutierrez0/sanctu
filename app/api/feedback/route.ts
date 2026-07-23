import { NextRequest, NextResponse } from 'next/server';

import { formatFeedbackEmail, validateFeedback } from '@/lib/feedback';

const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  const payload = validateFeedback(await request.json().catch(() => undefined));
  if (!payload) {
    return NextResponse.json({ error: 'Please enter a little more feedback and try again.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.FEEDBACK_TO_EMAIL;
  if (!apiKey || !recipient) {
    return NextResponse.json({ error: 'Feedback is not configured yet.' }, { status: 503 });
  }

  const response = await fetch(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.FEEDBACK_FROM_EMAIL ?? 'Sanctus feedback <onboarding@resend.dev>',
      to: [recipient],
      ...(payload.email ? { reply_to: payload.email } : {}),
      subject: `Sanctus feedback (${payload.language.toUpperCase()})`,
      text: formatFeedbackEmail(payload),
    }),
  }).catch(() => undefined);

  if (!response?.ok) {
    return NextResponse.json({ error: 'Feedback could not be delivered. Please try again shortly.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
