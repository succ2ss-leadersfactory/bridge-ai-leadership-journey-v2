import type { Round } from '../types';
import { rounds as sourceRounds } from './rounds';
import { roundOverrides } from './roundOverrides';
import { finalRoundOverrides } from './finalRoundOverrides';

const replacements: Array<[string, string]> = [
  ['김민재', '윤동희'],
  ['이서연', '황성빈'],
  ['정하늘', '전민재'],
  ['최도윤', '고승민'],
  ['주임', '대리'],
];

const LEADER_TOKEN = '__KAC_LEADER__';
const MANAGER_LEVEL_TOKEN = '__KAC_MANAGER_LEVEL__';
const TEST_MANAGER_TOKEN = '__KAC_TEST_MANAGER__';

function normalizeLeaderName(value: string) {
  const protectedText = value
    .replaceAll('김원중 과장', LEADER_TOKEN)
    .replaceAll('과장급', MANAGER_LEVEL_TOKEN)
    .replaceAll('테스트과장', TEST_MANAGER_TOKEN)
    .replaceAll('나는 한국공항공사 과장급 중간관리자입니다', `나는 한국공항공사 ${LEADER_TOKEN}입니다`)
    .replaceAll('나는 한국공항공사 김원중 과장입니다', `나는 한국공항공사 ${LEADER_TOKEN}입니다`);

  return protectedText
    .replaceAll('과장', LEADER_TOKEN)
    .replaceAll(LEADER_TOKEN, '김원중 과장')
    .replaceAll(MANAGER_LEVEL_TOKEN, '과장급')
    .replaceAll(TEST_MANAGER_TOKEN, '테스트과장');
}

function normalizeText(value: string) {
  const normalizedNames = replacements.reduce((current, [from, to]) => current.split(from).join(to), value);

  return normalizeLeaderName(normalizedNames);
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
  ...(finalRoundOverrides[round.id] ?? {}),
}));
