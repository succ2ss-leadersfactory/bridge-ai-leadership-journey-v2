import type { V3Case } from './types';

type ReplacementRule = {
  pattern: RegExp;
  replacement: string;
};

/**
 * Participant-facing naming rule
 *
 * Every named person is shown as full Korean name + job title.
 * Mobile and instructor PC use the same normalized case content.
 *
 * Important: rules must be idempotent. Already-correct names such as
 * 전민재 사원 / 고승민 대리 must not become 전전민재 사원 / 고고승민 대리
 * when the normalizer is applied again.
 */
const replacementRules: ReplacementRule[] = [
  { pattern: /동희 씨/g, replacement: '윤동희 사원' },
  { pattern: /성빈 씨/g, replacement: '황성빈 대리' },
  { pattern: /민재 씨/g, replacement: '전민재 사원' },
  { pattern: /승민 씨/g, replacement: '고승민 대리' },
  { pattern: /윤 사원/g, replacement: '윤동희 사원' },
  { pattern: /황 대리/g, replacement: '황성빈 대리' },
  { pattern: /전 사원/g, replacement: '전민재 사원' },
  { pattern: /고 대리/g, replacement: '고승민 대리' },
  { pattern: /김 과장/g, replacement: '김원중 과장' },
  { pattern: /박 대리(?:님)?/g, replacement: '박지훈 대리' },
  { pattern: /(^|[^윤])동희 사원/g, replacement: '$1윤동희 사원' },
  { pattern: /(^|[^황])성빈 대리/g, replacement: '$1황성빈 대리' },
  { pattern: /(^|[^전])민재 사원/g, replacement: '$1전민재 사원' },
  { pattern: /(^|[^고])승민 대리/g, replacement: '$1고승민 대리' },
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

/**
 * Examples after normalization:
 * 윤동희 사원, 황성빈 대리, 전민재 사원, 고승민 대리,
 * 김원중 과장, 박지훈 대리.
 */
export function applyHonorificTerminology(cases: V3Case[]) {
  const normalized = normalizeValue(cases) as V3Case[];
  cases.splice(0, cases.length, ...normalized);
}
