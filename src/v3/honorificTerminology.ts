import type { V3Case } from './types';

type ReplacementRule = {
  pattern: RegExp;
  replacement: string;
};

/**
 * Participant-facing naming rule
 *
 * Every named person is shown as full Korean name + job title.
 * Examples: 윤동희 사원, 황성빈 대리, 전민재 사원,
 * 고승민 대리, 나승엽 대리, 김원중 과장.
 *
 * The rules are idempotent: running them more than once must not create
 * duplicated surnames or titles.
 */
const replacementRules: ReplacementRule[] = [
  // Legacy / shortened forms
  { pattern: /동희 씨/g, replacement: '윤동희 사원' },
  { pattern: /성빈 씨/g, replacement: '황성빈 대리' },
  { pattern: /민재 씨/g, replacement: '전민재 사원' },
  { pattern: /승민 씨/g, replacement: '고승민 대리' },
  { pattern: /승엽 씨/g, replacement: '나승엽 대리' },
  { pattern: /윤 사원(?:님)?/g, replacement: '윤동희 사원' },
  { pattern: /황 대리(?:님)?/g, replacement: '황성빈 대리' },
  { pattern: /전 사원(?:님)?/g, replacement: '전민재 사원' },
  { pattern: /고 대리(?:님)?/g, replacement: '고승민 대리' },
  { pattern: /김 과장(?:님)?/g, replacement: '김원중 과장' },
  { pattern: /나 대리(?:님)?/g, replacement: '나승엽 대리' },
  { pattern: /박지훈 대리(?:님)?/g, replacement: '나승엽 대리' },
  { pattern: /박 대리(?:님)?/g, replacement: '나승엽 대리' },
  { pattern: /동희 사원(?:님)?/g, replacement: '윤동희 사원' },
  { pattern: /성빈 대리(?:님)?/g, replacement: '황성빈 대리' },
  { pattern: /민재 사원(?:님)?/g, replacement: '전민재 사원' },
  { pattern: /승민 대리(?:님)?/g, replacement: '고승민 대리' },
  { pattern: /승엽 대리(?:님)?/g, replacement: '나승엽 대리' },

  // Already-full forms with honorific suffixes
  { pattern: /윤동희 사원님/g, replacement: '윤동희 사원' },
  { pattern: /황성빈 대리님/g, replacement: '황성빈 대리' },
  { pattern: /전민재 사원님/g, replacement: '전민재 사원' },
  { pattern: /고승민 대리님/g, replacement: '고승민 대리' },
  { pattern: /나승엽 대리님/g, replacement: '나승엽 대리' },
  { pattern: /김원중 과장님/g, replacement: '김원중 과장' },

  // Bare full names: add the job title if it is missing.
  { pattern: /윤동희(?! 사원)/g, replacement: '윤동희 사원' },
  { pattern: /황성빈(?! 대리)/g, replacement: '황성빈 대리' },
  { pattern: /전민재(?! 사원)/g, replacement: '전민재 사원' },
  { pattern: /고승민(?! 대리)/g, replacement: '고승민 대리' },
  { pattern: /나승엽(?! 대리)/g, replacement: '나승엽 대리' },
  { pattern: /김원중(?! 과장)/g, replacement: '김원중 과장' },
];

function normalizeString(value: string) {
  return replacementRules.reduce(
    (result, rule) => result.replace(rule.pattern, rule.replacement),
    value,
  );
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

export function applyHonorificTerminology(cases: V3Case[]) {
  const normalized = normalizeValue(cases) as V3Case[];
  cases.splice(0, cases.length, ...normalized);
}
