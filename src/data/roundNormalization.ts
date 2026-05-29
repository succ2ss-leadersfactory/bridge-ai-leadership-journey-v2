const textReplacements: Array<[string, string]> = [
  ['김민재', '윤동희'],
  ['이서연', '황성빈'],
  ['정하늘', '전민재'],
  ['최도윤', '고승민'],
  ['주임', '대리'],
  ['판단 근육', '스스로 먼저 생각해 보는 힘'],
  ['판단 기준 노트', '확인 기준 메모'],
  ['판단안', '1차 의견'],
  ['확인 경계', '혼자 볼 일과 같이 볼 일'],
  ['실제로 말할 3~5줄 코칭 대화문', '실제로 말할 5줄 코칭 대화문'],
  ['실제로 말할 3~5줄 대화문', '실제로 말할 5줄 대화문'],
  ['실제로 말할 3~5문장 코칭 대화문', '실제로 말할 5줄 코칭 대화문'],
  ['실제로 말할 3~5문장 대화문', '실제로 말할 5줄 대화문'],
  ['후배 코칭 대화문 3~5문장', '후배 코칭 대화문 5줄'],
  ['후배 코칭 대화문 3~5줄', '후배 코칭 대화문 5줄'],
];

const LEADER_TOKEN = '__KAC_LEADER__';
const MANAGER_LEVEL_TOKEN = '__KAC_MANAGER_LEVEL__';
const TEST_MANAGER_TOKEN = '__KAC_TEST_MANAGER__';

function replaceEvery(value: string, from: string, to: string) {
  return value.split(from).join(to);
}

function applyReplacements(value: string, replacements: Array<[string, string]>) {
  return replacements.reduce((current, [from, to]) => replaceEvery(current, from, to), value);
}

function normalizeLeaderName(value: string) {
  const protectedText = applyReplacements(value, [
    ['김원중 과장', LEADER_TOKEN],
    ['과장급', MANAGER_LEVEL_TOKEN],
    ['테스트과장', TEST_MANAGER_TOKEN],
    ['나는 한국공항공사 과장급 중간관리자입니다', `나는 한국공항공사 ${LEADER_TOKEN}입니다`],
    ['나는 한국공항공사 김원중 과장입니다', `나는 한국공항공사 ${LEADER_TOKEN}입니다`],
  ]);

  return applyReplacements(protectedText, [
    ['과장', LEADER_TOKEN],
    [LEADER_TOKEN, '김원중 과장'],
    [MANAGER_LEVEL_TOKEN, '과장급'],
    [TEST_MANAGER_TOKEN, '테스트과장'],
  ]);
}

export function normalizeText(value: string) {
  return normalizeLeaderName(applyReplacements(value, textReplacements));
}

export function normalizeObject<T>(value: T): T {
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
