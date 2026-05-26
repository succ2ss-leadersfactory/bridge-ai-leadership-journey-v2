import type { Round } from '../types';
import { rounds as sourceRounds } from './rounds';

function normalizeRankText(value: string) {
  return value.replaceAll('주임', '대리');
}

function normalizeObject<T>(value: T): T {
  if (typeof value === 'string') {
    return normalizeRankText(value) as T;
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

export const rounds: Round[] = normalizeObject(sourceRounds);
