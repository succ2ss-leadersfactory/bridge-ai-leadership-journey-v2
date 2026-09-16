import type { V3CaseDraft, V3CaseId, V3LocalState, V3PlaybookDraft, V3Profile, V3StepId } from './types';

const V3_STORAGE_KEY = 'bridge-ai-leadership-journey-v3:state';

export const emptyCaseDraft = (): V3CaseDraft => ({
  selectedSignals: [],
  firstChoice: '',
  secondChoice: '',
  practiceAnswers: {},
  discussionNote: '',
  aiPromptUsed: false,
});

export const emptyPlaybook = (): V3PlaybookDraft => ({
  moreAction: '',
  lessAction: '',
  twoWeekAction: '',
});

export const initialV3State = (): V3LocalState => ({
  version: 3,
  profile: { teamName: '', nickname: '' },
  currentCaseId: null,
  currentStep: 'intro',
  cases: {},
  playbook: emptyPlaybook(),
  updatedAt: new Date().toISOString(),
});

function isBrowser() {
  return typeof window !== 'undefined';
}

function normalizeProfile(value: unknown): V3Profile {
  const profile = (value && typeof value === 'object' ? value : {}) as Partial<V3Profile>;
  return {
    teamName: typeof profile.teamName === 'string' ? profile.teamName : '',
    nickname: typeof profile.nickname === 'string' ? profile.nickname : '',
  };
}

function normalizePlaybook(value: unknown): V3PlaybookDraft {
  const playbook = (value && typeof value === 'object' ? value : {}) as Partial<V3PlaybookDraft>;
  return {
    moreAction: typeof playbook.moreAction === 'string' ? playbook.moreAction : '',
    lessAction: typeof playbook.lessAction === 'string' ? playbook.lessAction : '',
    twoWeekAction: typeof playbook.twoWeekAction === 'string' ? playbook.twoWeekAction : '',
    savedAt: typeof playbook.savedAt === 'string' ? playbook.savedAt : undefined,
  };
}

function normalizeCaseDraft(value: unknown): V3CaseDraft {
  const draft = (value && typeof value === 'object' ? value : {}) as Partial<V3CaseDraft>;
  return {
    selectedSignals: Array.isArray(draft.selectedSignals) ? draft.selectedSignals.filter((item): item is string => typeof item === 'string').slice(0, 2) : [],
    firstChoice: draft.firstChoice === 'A' || draft.firstChoice === 'B' || draft.firstChoice === 'C' ? draft.firstChoice : '',
    secondChoice: draft.secondChoice === 'keep' || draft.secondChoice === 'adjust' || draft.secondChoice === 'switch' ? draft.secondChoice : '',
    practiceAnswers: draft.practiceAnswers && typeof draft.practiceAnswers === 'object'
      ? Object.fromEntries(Object.entries(draft.practiceAnswers).filter(([, item]) => typeof item === 'string')) as Record<string, string>
      : {},
    discussionNote: typeof draft.discussionNote === 'string' ? draft.discussionNote : '',
    aiPromptUsed: Boolean(draft.aiPromptUsed),
    completedAt: typeof draft.completedAt === 'string' ? draft.completedAt : undefined,
  };
}

export function loadV3State(): V3LocalState {
  if (!isBrowser()) return initialV3State();
  const raw = window.localStorage.getItem(V3_STORAGE_KEY);
  if (!raw) return initialV3State();

  try {
    const parsed = JSON.parse(raw) as Partial<V3LocalState>;
    const caseIds: V3CaseId[] = ['A', 'B', 'C', 'D', 'E', 'F'];
    const cases: V3LocalState['cases'] = {};
    caseIds.forEach((caseId) => {
      const value = parsed.cases?.[caseId];
      if (value) cases[caseId] = normalizeCaseDraft(value);
    });

    const allowedSteps: V3StepId[] = ['intro', 'caseMap', 'situation', 'signals', 'firstDecision', 'consequence', 'newInfo', 'secondDecision', 'theoryBridge', 'practice', 'discussion', 'result', 'playbook'];
    const currentStep = allowedSteps.includes(parsed.currentStep as V3StepId) ? parsed.currentStep as V3StepId : 'intro';
    const currentCaseId = caseIds.includes(parsed.currentCaseId as V3CaseId) ? parsed.currentCaseId as V3CaseId : null;

    return {
      version: 3,
      profile: normalizeProfile(parsed.profile),
      currentCaseId,
      currentStep,
      cases,
      playbook: normalizePlaybook(parsed.playbook),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return initialV3State();
  }
}

export function saveV3State(state: V3LocalState) {
  if (!isBrowser()) return;
  window.localStorage.setItem(V3_STORAGE_KEY, JSON.stringify({ ...state, version: 3, updatedAt: new Date().toISOString() }));
}

export function resetV3State() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(V3_STORAGE_KEY);
}

export function exportV3Backup(state: V3LocalState) {
  if (!isBrowser() || typeof document === 'undefined') return;
  const payload = {
    app: 'Bridge AI Leadership Journey',
    version: 3,
    storageMode: 'localStorage',
    exportedAt: new Date().toISOString(),
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bridge-ai-leadership-v3-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
