import type { FlowStepId, RoundId } from '../types';

export interface LearnerLocalDraft<TDraft> {
  version: 1;
  savedAt: string;
  selectedRoundId: RoundId;
  currentStep: FlowStepId;
  draft: TDraft;
}

const STORAGE_KEY = 'bridge-ai-leadership-journey-v2:learner-draft';
const COMPLETED_ROUNDS_KEY = 'bridge-ai-leadership-journey-v2:completed-rounds';

export function loadLearnerDraft<TDraft>(): LearnerLocalDraft<TDraft> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as LearnerLocalDraft<TDraft>;
    if (parsed.version !== 1) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveLearnerDraft<TDraft>(payload: Omit<LearnerLocalDraft<TDraft>, 'version' | 'savedAt'>) {
  if (typeof window === 'undefined') return;

  const next: LearnerLocalDraft<TDraft> = {
    version: 1,
    savedAt: new Date().toISOString(),
    ...payload,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function loadCompletedRoundIds(): RoundId[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(COMPLETED_ROUNDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RoundId[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markRoundCompleted(roundId: RoundId) {
  if (typeof window === 'undefined') return;

  const current = loadCompletedRoundIds();
  const next = current.includes(roundId) ? current : [...current, roundId];
  window.localStorage.setItem(COMPLETED_ROUNDS_KEY, JSON.stringify(next));
}

export function clearLearnerDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function clearCompletedRoundIds() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(COMPLETED_ROUNDS_KEY);
}
