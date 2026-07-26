import type { Language } from '@/components/ThemeProvider';
import type { MysteryType } from '@/lib/data/rosary';

export const ROSARY_PROGRESS_STORAGE_KEY = 'sanctu:rosary-progress';

export type ResumableRosaryPhase =
  | 'opening'
  | 'decade'
  | 'decadeEnd'
  | 'closing';

export interface RosaryProgress {
  version: 1;
  mysteryType: MysteryType;
  phase: ResumableRosaryPhase;
  openingStep: number;
  currentDecade: number;
  currentBead: number;
  decadeEndStep: number;
  closingStep: number;
  savedAt: number;
}

export type RosaryProgressDraft = Omit<RosaryProgress, 'version' | 'savedAt'>;

const MYSTERY_TYPES: MysteryType[] = [
  'joyful',
  'sorrowful',
  'glorious',
  'luminous',
];

const RESUMABLE_PHASES: ResumableRosaryPhase[] = [
  'opening',
  'decade',
  'decadeEnd',
  'closing',
];

function isIntegerWithin(value: unknown, minimum: number, maximum: number) {
  return (
    typeof value === 'number'
    && Number.isInteger(value)
    && value >= minimum
    && value <= maximum
  );
}

function isRosaryProgress(value: unknown): value is RosaryProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const progress = value as Record<string, unknown>;

  const fieldsAreValid = (
    progress.version === 1
    && MYSTERY_TYPES.includes(progress.mysteryType as MysteryType)
    && RESUMABLE_PHASES.includes(progress.phase as ResumableRosaryPhase)
    && isIntegerWithin(progress.openingStep, 0, 5)
    && isIntegerWithin(progress.currentDecade, 0, 4)
    && isIntegerWithin(progress.currentBead, 0, 10)
    && isIntegerWithin(progress.decadeEndStep, 0, 1)
    && isIntegerWithin(progress.closingStep, 0, 2)
    && typeof progress.savedAt === 'number'
    && Number.isFinite(progress.savedAt)
    && progress.savedAt > 0
  );

  if (!fieldsAreValid) return false;

  const candidate = progress as unknown as RosaryProgress;

  if (candidate.phase === 'opening') {
    return (
      candidate.currentDecade === 0
      && candidate.currentBead === 0
      && candidate.decadeEndStep === 0
      && candidate.closingStep === 0
    );
  }

  if (candidate.phase === 'decadeEnd') {
    return candidate.currentBead === 10 && candidate.closingStep === 0;
  }

  if (candidate.phase === 'closing') {
    return candidate.currentDecade === 4 && candidate.currentBead === 10;
  }

  return candidate.closingStep === 0;
}

export function parseRosaryProgress(value: string | null): RosaryProgress | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    return isRosaryProgress(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function createRosaryProgress(
  draft: RosaryProgressDraft,
  savedAt = Date.now(),
): RosaryProgress {
  const normalized = { ...draft };

  if (draft.phase === 'opening') {
    normalized.currentDecade = 0;
    normalized.currentBead = 0;
    normalized.decadeEndStep = 0;
    normalized.closingStep = 0;
  } else if (draft.phase === 'decade') {
    normalized.closingStep = 0;
  } else if (draft.phase === 'decadeEnd') {
    normalized.closingStep = 0;
  }

  return {
    version: 1,
    ...normalized,
    savedAt,
  };
}

export function describeRosaryProgress(
  progress: RosaryProgress,
  language: Language,
): string {
  const decade = progress.currentDecade + 1;

  if (progress.phase === 'opening') {
    return language === 'es'
      ? `Oraciones iniciales · Oración ${progress.openingStep + 1} de 6`
      : `Opening prayers · Prayer ${progress.openingStep + 1} of 6`;
  }

  if (progress.phase === 'decade') {
    if (progress.currentBead === 0) {
      return language === 'es'
        ? `Decena ${decade} · Padre Nuestro`
        : `Decade ${decade} · Our Father`;
    }

    return language === 'es'
      ? `Decena ${decade} · Ave María ${progress.currentBead} de 10`
      : `Decade ${decade} · Hail Mary ${progress.currentBead} of 10`;
  }

  if (progress.phase === 'decadeEnd') {
    const prayer = progress.decadeEndStep === 0
      ? language === 'es' ? 'Gloria' : 'Glory Be'
      : language === 'es' ? 'Oración de Fátima' : 'Fatima Prayer';

    return language === 'es'
      ? `Decena ${decade} · ${prayer}`
      : `Decade ${decade} · ${prayer}`;
  }

  return language === 'es'
    ? `Oraciones finales · Oración ${progress.closingStep + 1} de 3`
    : `Closing prayers · Prayer ${progress.closingStep + 1} of 3`;
}
