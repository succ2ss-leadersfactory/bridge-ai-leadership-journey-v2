import type { ChoiceId, Round } from '../types';

interface PromptDraft {
  juniorReading: string;
  firstChoice: ChoiceId | '';
  firstReason: string;
  dilemma: string;
  secondChoice: string;
  directionId: string;
}

const secondChoiceLabels: Record<string, string> = {
  keep: '처음 판단을 유지한다',
  revise: '처음 판단은 유지하되 일부 보완한다',
  change: '처음 판단을 전환한다',
};

function getFirstChoiceText(round: Round, draft: PromptDraft) {
  const selected = round.firstChoices.find((choice) => choice.id === draft.firstChoice);
  if (!selected) return '미입력';

  return [
    selected.label,
    `좋은 점: ${selected.benefit}`,
    `주의할 점: ${selected.cost}`,
    `예상 신호: ${selected.likelySignal}`,
  ].join('\n');
}

function getFirstChoiceResult(round: Round, draft: PromptDraft) {
  if (!draft.firstChoice) return '미입력';
  return round.firstResultByChoice[draft.firstChoice] ?? '미입력';
}

function getSecondChoiceText(draft: PromptDraft) {
  return draft.secondChoice ? secondChoiceLabels[draft.secondChoice] ?? draft.secondChoice : '미입력';
}

function getDevelopmentDirection(round: Round, draft: PromptDraft) {
  const selected = round.developmentDirections.find((direction) => direction.id === draft.directionId);
  if (!selected) return '미입력';

  return [
    selected.title,
    selected.description,
    `적합한 경우: ${selected.bestWhen}`,
    `주의할 점: ${selected.watchOut}`,
  ].join('\n');
}

export function buildKacAiPrompt(round: Round, draft: PromptDraft) {
  const finalOutputName = round.finalOutput || '2주 미니 육성 플랜';

  return [
    '[역할]',
    '당신은 공공기관 중간관리자의 후배 육성을 돕는 리더십 코치입니다.',
    '과장급 중간관리자가 실제 현장에서 후배에게 말하고 실행할 수 있는 현실적인 육성 방안을 설계해 주세요.',
    '',
    '[상황]',
    round.situation,
    '',
    '[후배 행동 패턴]',
    `${round.juniorName} ${round.juniorRole}: ${round.behaviorPattern}`,
    '',
    '[핵심 육성 과제]',
    round.developmentTask,
    '',
    '[교육생이 읽은 후배 행동]',
    draft.juniorReading || '미입력',
    '',
    '[1차 육성 판단]',
    getFirstChoiceText(round, draft),
    '',
    '[선택 이유]',
    draft.firstReason || '미입력',
    '',
    '[1차 선택 이후 나타난 결과]',
    getFirstChoiceResult(round, draft),
    '',
    '[후배 반응]',
    round.juniorReaction,
    '',
    '[교육생이 정리한 육성 딜레마]',
    draft.dilemma || '미입력',
    '',
    '[다시 판단]',
    getSecondChoiceText(draft),
    '',
    '[추가 상황]',
    round.additionalSituation,
    '',
    '[선택한 육성 방향]',
    getDevelopmentDirection(round, draft),
    '',
    '[요청 결과물]',
    `아래 두 가지 결과물을 ${round.juniorName} ${round.juniorRole}에게 실제로 사용할 수 있는 현장 언어로 작성해 주세요.`,
    `1. ${finalOutputName}`,
    '2. 5줄 현장 실행문',
    '',
    '[제약조건]',
    '- 후배를 의존형, 소심형, 문제형처럼 낙인찍지 마세요.',
    '- 정답을 단정하지 말고 선택의 장점과 비용을 함께 고려하세요.',
    '- 과장급 중간관리자가 실제로 할 수 있는 지원 수준으로 작성하세요.',
    '- 거창한 제도 개선보다 2주 안에 가능한 작은 행동으로 작성하세요.',
    '- 라운드별 최종 산출물의 이름과 성격을 유지해 주세요. 예를 들어 최종 산출물이 기준 점검 루틴이면 단순 육성 플랜이 아니라 점검 루틴으로 작성해야 합니다.',
    '- AI가 대신 판단하지 말고, 리더가 확인해야 할 지점을 남겨 주세요.',
    '- 표 형식은 사용하지 말고 모바일에서 읽기 쉬운 목록과 짧은 문장으로 작성하세요.',
    '',
    '[출력 형식]',
    '아래 블록명을 반드시 그대로 사용해 주세요.',
    '',
    '<FINAL_ARTIFACT>',
    `1. ${finalOutputName}`,
    '- 성장 목표:',
    '- 작은 과제:',
    '- 과장의 지원:',
    '- 점검 시점:',
    '- 주의할 점:',
    '',
    '2. 5줄 현장 실행문',
    '1)',
    '2)',
    '3)',
    '4)',
    '5)',
    '</FINAL_ARTIFACT>',
    '',
    '<REVIEW_NOTES>',
    '이 결과를 그대로 쓰기 전 과장이 확인해야 할 점 3가지를 적어 주세요.',
    '</REVIEW_NOTES>',
  ].join('\n');
}
