import type { V3Case } from './types';

const replacements: Array<[string, string]> = [
  ['동희 씨', '윤동희 사원'],
  ['성빈 씨', '황성빈 대리'],
  ['민재 씨', '전민재 사원'],
  ['승민 씨', '고승민 대리'],
  ['윤 사원', '윤동희 사원'],
  ['황 대리', '황성빈 대리'],
  ['전 사원', '전민재 사원'],
  ['민재 사원', '전민재 사원'],
  ['고 대리', '고승민 대리'],
  ['승민 대리', '고승민 대리'],
  ['김 과장', '김원중 과장'],
];

function normalizeString(value: string) {
  return replacements.reduce((result, [from, to]) => result.split(from).join(to), value);
}

function normalizeValue(value: unknown): unknown {
  if (typeof value === 'string') return normalizeString(value);
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizeValue(entry)]),
    );
  }
  return value;
}

/**
 * Participant-facing naming rule:
 * whenever a named person is referenced, use full Korean name + job title.
 * Examples: 윤동희 사원, 황성빈 대리, 전민재 사원, 고승민 대리, 김원중 과장.
 */
export function applyHonorificTerminology(cases: V3Case[]) {
  const normalized = normalizeValue(cases) as V3Case[];
  cases.splice(0, cases.length, ...normalized);
}
