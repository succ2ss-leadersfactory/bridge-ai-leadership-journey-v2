import type { Round } from '../types';
import { rounds as sourceRounds } from './rounds';
import { roundOverrides } from './roundOverrides';

const replacements: Array<[string, string]> = [
  ['김민재', '윤동희'],
  ['이서연', '황성빈'],
  ['정하늘', '전민재'],
  ['최도윤', '고승민'],
  ['주임', '대리'],
];

function normalizeText(value: string) {
  return replacements.reduce((current, [from, to]) => current.split(from).join(to), value);
}

function normalizeObject<T>(value: T): T {
  if (typeof value === 'string') {
    return normalizeText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeObject(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeObject(item)]),
    ) as T;
  }

  return value;
}

const normalizedSourceRounds = normalizeObject(sourceRounds);

export const rounds: Round[] = normalizedSourceRounds.map((round) => ({
  ...round,
  ...(roundOverrides[round.id] ?? {}),
}));
