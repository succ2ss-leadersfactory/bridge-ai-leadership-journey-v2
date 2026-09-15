import type { Round } from '../types';
import type { ResultDraft } from './resultMapper';

const LOCAL_RESULTS_KEY = 'bridge-ai-leadership-journey-v2:local-results';

export interface LocalSavedResult {
  version: 1;
  recordId: string;
  roundId: Round['id'];
  roundTitle: string;
  teamName: string;
  nickname: string;
  savedAt: string;
  generatedPrompt: string;
  promptText: string;
  draft: ResultDraft;
}

function safeParse(raw: string | null): LocalSavedResult[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as LocalSavedResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadLocalResults(): LocalSavedResult[] {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(LOCAL_RESULTS_KEY));
}

export function saveLocalResult(input: {
  round: Round;
  draft: ResultDraft;
  generatedPrompt: string;
  promptText: string;
}) {
  if (typeof window === 'undefined') {
    throw new Error('브라우저 저장소를 사용할 수 없습니다.');
  }

  const now = new Date().toISOString();
  const recordId = `${input.draft.teamName}::${input.draft.nickname}::${input.round.id}`;
  const record: LocalSavedResult = {
    version: 1,
    recordId,
    roundId: input.round.id,
    roundTitle: input.round.title,
    teamName: input.draft.teamName,
    nickname: input.draft.nickname,
    savedAt: now,
    generatedPrompt: input.generatedPrompt,
    promptText: input.promptText,
    draft: input.draft,
  };

  const current = loadLocalResults();
  const next = [record, ...current.filter((item) => item.recordId !== recordId)];
  window.localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(next));

  return record;
}

export function downloadLocalResultsBackup() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const results = loadLocalResults();
  const payload = {
    app: 'Bridge AI Leadership Journey',
    storageMode: 'localStorage',
    exportedAt: new Date().toISOString(),
    results,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `bridge-ai-leadership-local-backup-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function clearLocalResults() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LOCAL_RESULTS_KEY);
}
