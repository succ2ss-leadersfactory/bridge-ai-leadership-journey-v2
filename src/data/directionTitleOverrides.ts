import type { DevelopmentDirectionOption, Round } from '../types';

const titleByRoundAndDirection: Partial<Record<Round['id'], Record<string, string>>> = {
  R1: {
    'one-line-before-question': '판단 근거화: 질문 전에 내 판단 1줄 먼저 말하기',
    'three-checks': '판단 기준 설정: 확인 기준 3개만 먼저 정하기',
    'solo-or-together-line': '역할 경계 설정: 혼자 볼 일과 같이 볼 일 나누기',
  },
  R2: {
    'three-minute-check': '기준 확인 루틴: 보내기 전 3분만 확인하기',
    'checked-standard-line': '판단 근거 기록: 확인한 기준을 한 줄 남기기',
    'fast-draft-final-pause': '최종 점검 장치: 빠른 초안 뒤 한 번 멈추기',
  },
  R3: {
    'first-sentence-retry': '작은 재시도: 답변 첫 문장부터 다시 맡기기',
    'ten-minute-criteria-review': '짧은 복기: 틀린 지점만 10분 안에 보기',
    'side-by-side-small-inquiry': '동행 지원: 작은 문의 하나를 옆에서 같이 응대하기',
  },
  R4: {
    'ai-source-note': '근거 표시 습관: AI 문장 옆에 확인 근거 붙이기',
    'verify-critical-items': '핵심 검증 기준: 결정사항·숫자·책임자 확인하기',
    'mark-human-edits': '사람 판단 표시: AI 초안에서 내가 고친 부분 남기기',
  },
  R5: {
    'delegation-boundary': '위임 경계 설정: 혼자 할 일과 같이 볼 일 정하기',
    'middle-check-time': '중간 확인 지점: 한 번 가져올 시점 미리 정하기',
    'judgment-review-after-work': '판단 복기: 끝난 뒤 결정 과정을 같이 돌아보기',
  },
  BOSS: {
    'ten-minute-role-split': '긴급 역할 분담: 10분 안에 과장 일과 대리 일 나누기',
    'after-report-15min-review': '회복 대화: 보고 끝나고 15분만 같이 정리하기',
    'next-ai-draft-with-evidence': '재시도 설계: 다음 AI 초안에 확인 근거 붙이기',
  },
};

function renameDevelopmentDirections(roundId: Round['id'], directions?: DevelopmentDirectionOption[]) {
  if (!directions) return directions;
  const titleMap = titleByRoundAndDirection[roundId];
  if (!titleMap) return directions;

  return directions.map((direction) => ({
    ...direction,
    title: titleMap[direction.id] ?? direction.title,
  }));
}

export const directionTitleOverrides: Partial<Record<Round['id'], Partial<Round>>> = Object.fromEntries(
  Object.keys(titleByRoundAndDirection).map((roundId) => [
    roundId,
    {
      get developmentDirections() {
        return undefined;
      },
    },
  ]),
) as Partial<Record<Round['id'], Partial<Round>>>;

export function applyDirectionTitleOverrides(round: Round): Round {
  return {
    ...round,
    developmentDirections: renameDevelopmentDirections(round.id, round.developmentDirections) ?? round.developmentDirections,
  };
}
