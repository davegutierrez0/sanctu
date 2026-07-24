'use client';

import { FormEvent, useState } from 'react';
import { Coffee, Mail, MessageCircle, Send } from 'lucide-react';

import { useLanguage } from '@/components/ThemeProvider';
import { analytics } from '@/lib/analytics';
import { createFormspreeSubmission, FORMSPREE_ENDPOINT } from '@/lib/formspree';

const COPY = {
  en: {
    eyebrow: 'A note from Sanctus',
    title: 'All new design.',
    description: 'Subscribe for Sanctus and Catholic tech updates, share feedback, or help keep Sanctus free.',
    subscribe: 'Subscribe for updates',
    feedback: 'Send feedback',
    support: 'Buy me a coffee',
    signupTitle: 'Stay close to what we are building',
    feedbackTitle: 'Help shape Sanctus',
    firstName: 'First name',
    email: 'Email address',
    replyEmail: 'Email for a reply (optional)',
    feedbackPrompt: 'What would make Sanctus more helpful for your prayer life?',
    addToUpdates: 'Also send me Sanctus and Catholic tech updates.',
    subscribeSubmit: 'Subscribe',
    feedbackSubmit: 'Send feedback',
    sending: 'Sending…',
    signupSuccess: 'You are on the list. Welcome!',
    feedbackSuccess: 'Thank you — your feedback has been sent.',
    error: 'We could not send that just now. Please try again shortly.',
    offline: 'You are offline. Your prayer tools still work; reconnect to send this.',
  },
  es: {
    eyebrow: 'Una nota de Sanctus',
    title: 'Diseño completamente nuevo.',
    description: 'Suscríbete a novedades de Sanctus y tecnología católica, envía comentarios o ayuda a mantener Sanctus gratuito.',
    subscribe: 'Suscribirme a novedades',
    feedback: 'Enviar comentarios',
    support: 'Invítame un café',
    signupTitle: 'Mantente cerca de lo que estamos creando',
    feedbackTitle: 'Ayuda a dar forma a Sanctus',
    firstName: 'Nombre',
    email: 'Correo electrónico',
    replyEmail: 'Correo para responder (opcional)',
    feedbackPrompt: '¿Qué haría que Sanctus fuera más útil para tu vida de oración?',
    addToUpdates: 'También quiero recibir novedades de Sanctus y tecnología católica.',
    subscribeSubmit: 'Suscribirme',
    feedbackSubmit: 'Enviar comentarios',
    sending: 'Enviando…',
    signupSuccess: 'Ya estás en la lista. ¡Bienvenido!',
    feedbackSuccess: 'Gracias — tus comentarios han sido enviados.',
    error: 'No pudimos enviarlo ahora. Inténtalo de nuevo en un momento.',
    offline: 'No tienes conexión. Tus herramientas de oración siguen disponibles; vuelve a conectarte para enviar esto.',
  },
} as const;

type FormMode = 'subscribe' | 'feedback';
type FormStatus = 'idle' | 'sending' | 'success' | 'error' | 'offline';

export function FeedbackAnnouncement() {
  const { language } = useLanguage();
  const text = COPY[language];
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>('subscribe');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [alsoSubscribe, setAlsoSubscribe] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');

  const openForm = (nextMode: FormMode) => {
    setMode(nextMode);
    setStatus('idle');
    setIsOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!navigator.onLine) {
      setStatus('offline');
      return;
    }

    const submission = createFormspreeSubmission({
      intent: mode,
      firstName,
      email,
      message,
      language,
      subscribe: mode === 'subscribe' || alsoSubscribe,
    });
    if (!submission) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });
      if (!response.ok) throw new Error('Formspree delivery failed');

      if (mode === 'subscribe' || alsoSubscribe) analytics.subscriptionSubmitted(language);
      if (mode === 'feedback') analytics.feedbackSubmitted(language);
      setFirstName('');
      setEmail('');
      setMessage('');
      setAlsoSubscribe(false);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const needsContactDetails = mode === 'subscribe' || alsoSubscribe;

  return (
    <aside className="feedback-announcement stone-card reveal-up" aria-label={text.title}>
      <div className="feedback-announcement-copy">
        <p className="eyebrow">{text.eyebrow}</p>
        <h2>{text.title}</h2>
        <p>{text.description}</p>
      </div>
      <div className="feedback-announcement-actions">
        <button type="button" className="secondary-button" onClick={() => openForm('subscribe')}>
          <Mail aria-hidden="true" size={17} />
          {text.subscribe}
        </button>
        <button type="button" className="secondary-button" onClick={() => openForm('feedback')}>
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
          <span className="sr-only">
            {language === 'es' ? ' (se abre en una pestaña nueva)' : ' (opens in a new tab)'}
          </span>
        </a>
      </div>
      {isOpen && (
        <form className="feedback-form" onSubmit={submit}>
          <div className="feedback-form-heading">
            <h3>{mode === 'subscribe' ? text.signupTitle : text.feedbackTitle}</h3>
            <div className="feedback-form-tabs" aria-label="Contact preference">
              <button
                type="button"
                className={mode === 'subscribe' ? 'is-active' : ''}
                onClick={() => openForm('subscribe')}
                aria-pressed={mode === 'subscribe'}
              >
                {text.subscribe}
              </button>
              <button
                type="button"
                className={mode === 'feedback' ? 'is-active' : ''}
                onClick={() => openForm('feedback')}
                aria-pressed={mode === 'feedback'}
              >
                {text.feedback}
              </button>
            </div>
          </div>
          <label>
            <span>{text.firstName}</span>
            <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} maxLength={80} autoComplete="given-name" required={needsContactDetails} />
          </label>
          <label>
            <span>{mode === 'feedback' && !needsContactDetails ? text.replyEmail : text.email}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} autoComplete="email" required={needsContactDetails} />
          </label>
          {mode === 'feedback' && (
            <>
              <label>
                <span>{text.feedbackPrompt}</span>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={10} maxLength={2000} required />
              </label>
              <label className="feedback-opt-in">
                <input type="checkbox" checked={alsoSubscribe} onChange={(event) => setAlsoSubscribe(event.target.checked)} />
                <span>{text.addToUpdates}</span>
              </label>
            </>
          )}
          <button className="primary-button" type="submit" disabled={status === 'sending'}>
            <Send aria-hidden="true" size={17} />
            {status === 'sending' ? text.sending : mode === 'subscribe' ? text.subscribeSubmit : text.feedbackSubmit}
          </button>
          {status === 'success' && <p className="feedback-status is-success" role="status">{mode === 'subscribe' ? text.signupSuccess : text.feedbackSuccess}</p>}
          {status === 'offline' && <p className="feedback-status" role="status">{text.offline}</p>}
          {status === 'error' && <p className="feedback-status is-error" role="alert">{text.error}</p>}
        </form>
      )}
    </aside>
  );
}
