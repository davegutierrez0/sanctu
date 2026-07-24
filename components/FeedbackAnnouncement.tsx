'use client';

import { FormEvent, useState } from 'react';
import { Coffee, MessageCircle, Send } from 'lucide-react';

import { useLanguage } from '@/components/ThemeProvider';
import { analytics } from '@/lib/analytics';

const COPY = {
  en: {
    eyebrow: 'A note from Sanctu',
    title: 'All new design.',
    description: 'Please send us your feedback and consider donating to help keep Sanctu free.',
    feedback: 'Send feedback',
    support: 'Buy me a coffee',
    prompt: 'What would make Sanctu more helpful for your prayer life?',
    contact: 'Email for a reply (optional)',
    submit: 'Send feedback',
    sending: 'Sending…',
    success: 'Thank you — your feedback has been sent.',
    error: 'We could not send that just now. Please try again shortly.',
    notConfigured: 'Feedback will be available soon. Thank you for your patience.',
  },
  es: {
    eyebrow: 'Una nota de Sanctu',
    title: 'Diseño completamente nuevo.',
    description: 'Envíanos tus comentarios y considera donar para ayudar a mantener Sanctu gratuito.',
    feedback: 'Enviar comentarios',
    support: 'Invítame un café',
    prompt: '¿Qué haría que Sanctu fuera más útil para tu vida de oración?',
    contact: 'Correo para responder (opcional)',
    submit: 'Enviar comentarios',
    sending: 'Enviando…',
    success: 'Gracias — tus comentarios han sido enviados.',
    error: 'No pudimos enviarlo ahora. Inténtalo de nuevo en un momento.',
    notConfigured: 'Los comentarios estarán disponibles pronto. Gracias por tu paciencia.',
  },
} as const;

export function FeedbackAnnouncement() {
  const { language } = useLanguage();
  const text = COPY[language];
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'unavailable'>('idle');

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email, language, website: '' }),
      });

      if (response.status === 503) {
        setStatus('unavailable');
        return;
      }

      if (!response.ok) throw new Error('Feedback delivery failed');
      analytics.feedbackSubmitted(language);
      setMessage('');
      setEmail('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <aside className="feedback-announcement stone-card reveal-up" aria-label={text.title}>
      <div className="feedback-announcement-copy">
        <p className="eyebrow">{text.eyebrow}</p>
        <h2>{text.title}</h2>
        <p>{text.description}</p>
      </div>
      <div className="feedback-announcement-actions">
        <button type="button" className="secondary-button" onClick={() => setIsOpen((open) => !open)}>
          <MessageCircle aria-hidden="true" size={17} />
          {text.feedback}
        </button>
        <a
          className="primary-button"
          href="https://buymeacoffee.com/davegutierrez0"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analytics.coffeeClicked()}
        >
          <Coffee aria-hidden="true" size={17} />
          {text.support}
        </a>
      </div>
      {isOpen && (
        <form className="feedback-form" onSubmit={submitFeedback}>
          <label>
            <span>{text.prompt}</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={10} maxLength={2000} required />
          </label>
          <label>
            <span>{text.contact}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} />
          </label>
          <input className="feedback-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button className="primary-button" type="submit" disabled={status === 'sending'}>
            <Send aria-hidden="true" size={17} />
            {status === 'sending' ? text.sending : text.submit}
          </button>
          {status === 'success' && <p className="feedback-status is-success" role="status">{text.success}</p>}
          {status === 'unavailable' && <p className="feedback-status" role="status">{text.notConfigured}</p>}
          {status === 'error' && <p className="feedback-status is-error" role="alert">{text.error}</p>}
        </form>
      )}
    </aside>
  );
}
