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
  keep: '처음 생각을 그대로 가져간다',
  revise: '처음 생각은 살리되 조금 고친다',
  change: '방향을 바꿔 다시 접근한다',
};

function getFirstChoiceText(round: Round, draft: PromptDraft) {
  const selected = round.firstChoices.find((choice) => choice.id === draft.firstChoice);
  if (!selected) return '아직 고르지 않음';

  return [
    selected.label,
    `좋은 점: ${selected.benefit}`,
    `부담되는 점: ${selected.cost}`,
    `후배에게 남을 수 있는 반응: ${selected.likelySignal}`,
  ].join('\n');
}

function getFirstChoiceResult(round: Round, draft: PromptDraft) {
  if (!draft.firstChoice) return '아직 고르지 않음';
  return round.firstResultByChoice[draft.firstChoice] ?? '아직 확인할 내용이 없음';
}

function getSecondChoiceText(draft: PromptDraft) {
  return draft.secondChoice ? secondChoiceLabels[draft.secondChoice] ?? draft.secondChoice : '아직 고르지 않음';
}

function getDevelopmentDirection(round: Round, draft: PromptDraft) {
  const selected = round.developmentDirections.find((direction) => direction.id === draft.directionId);
  if (!selected) return '아직 고르지 않음';

  return [
    selected.title,
    selected.description,
    `이럴 때 맞음: ${selected.bestWhen}`,
    `조심할 점: ${selected.watchOut}`,
  ].join('\n');
}

export function buildKacAiPrompt(round: Round, draft: PromptDraft) {
  const finalOutputName = round.finalOutput || '2주 동안 같이 해볼 일';

  return [
    '[당신의 역할]',
    '당신은 한국 직장에서 김원중 과장이 후배와 실제로 나눌 코칭 대화를 함께 다듬어 주는 리더십 코치입니다.',
    '보고, 회의, 메신저, 짧은 1:1에서 바로 쓸 수 있는 말과 작은 실행 계획으로 정리해 주세요.',
    '',
    '[오늘의 장면]',
    round.situation,
    '',
    '[후배에게 자주 보이는 모습]',
    `${round.juniorName} ${round.juniorRole}: ${round.behaviorPattern}`,
    '',
    '[지금 도와줘야 할 것]',
    round.developmentTask,
    '',
    '[내가 본 후배의 모습]',
    draft.juniorReading || '아직 적지 않음',
    '',
    '[내가 먼저 고른 대응]',
    getFirstChoiceText(round, draft),
    '',
    '[그렇게 고른 이유]',
    draft.firstReason || '아직 적지 않음',
    '',
    '[그 선택 뒤에 남은 장면]',
    getFirstChoiceResult(round, draft),
    '',
    '[후배의 다음 말]',
    round.juniorReaction,
    '',
    '[내가 지금 고민하는 지점]',
    draft.dilemma || '아직 적지 않음',
    '',
    '[후배 반응을 보고 보완한 판단]',
    getSecondChoiceText(draft),
    '',
    '[일이 한 번 더 꼬인 장면]',
    round.additionalSituation,
    '',
    '[앞으로 2주 동안 도와주려는 방향]',
    getDevelopmentDirection(round, draft),
    '',
    '[부탁할 결과물]',
    `아래 두 가지를 ${round.juniorName} ${round.juniorRole}에게 실제로 말하고 실행할 수 있는 말로 써 주세요.`,
    `1. ${finalOutputName}`,
    '2. 후배 코칭 대화문 3~5문장',
    '',
    '[코칭 대화문 작성 기준]',
    '- 좋은 말이나 훈계가 아니라 실제 대화 문장으로 써 주세요.',
    '- 1문장은 후배의 의도와 노력을 인정하는 문장으로 써 주세요.',
    '- 1문장은 후배가 스스로 기준을 말하게 하는 질문 문장으로 써 주세요.',
    '- 1문장은 이번 주 함께 해볼 작은 행동 약속으로 써 주세요.',
    '- 필요하면 김원중 과장이 어떻게 도울지 말하는 지원 문장을 추가해 주세요.',
    '- 후배가 방어적으로 들을 수 있는 표현은 피하고, 현장에서 자연스럽게 말할 수 있게 써 주세요.',
    '',
    '[꼭 지킬 것]',
    '- 후배를 의존형, 소심형, 문제형처럼 단정하지 마세요.',
    '- 한쪽이 무조건 맞다고 말하지 말고, 선택마다 얻는 것과 잃는 것을 같이 봐 주세요.',
    '- 김원중 과장이 실제로 할 수 있는 수준으로 써 주세요. 제도 개선안처럼 크게 쓰지 마세요.',
    '- 2주 안에 해볼 수 있는 작은 행동으로 써 주세요.',
    '- 최종 산출물의 이름과 성격을 지켜 주세요. 기준 점검 루틴이면 그냥 육성 플랜이 아니라 점검 루틴으로 써 주세요.',
    '- 김원중 과장이 마지막에 직접 판단해야 할 부분은 질문으로 남겨 주세요.',
    '- 표는 쓰지 말고, 스마트폰에서 읽기 쉬운 짧은 문장과 목록으로 써 주세요.',
    '- 말투는 보고서 문체가 아니라 한국 직장에서 실제로 쓰는 자연스러운 말로 해 주세요.',
    '',
    '[답변 형식]',
    '아래 블록 이름은 그대로 두고 작성해 주세요.',
    '',
    '<FINAL_ARTIFACT>',
    `1. ${finalOutputName}`,
    '- 2주 뒤 달라졌으면 하는 모습:',
    '- 이번 주에 맡겨볼 작은 일:',
    '- 김원중 과장이 옆에서 도와줄 일:',
    '- 언제 짧게 같이 볼지:',
    '- 말할 때 조심할 표현:',
    '',
    '2. 후배 코칭 대화문 3~5문장',
    '1) 먼저 인정할 말:',
    '2) 스스로 생각하게 할 질문:',
    '3) 이번 주 함께 정할 행동:',
    '4) 김원중 과장이 도와줄 방식:',
    '5) 조심할 표현:',
    '</FINAL_ARTIFACT>',
    '',
    '<REVIEW_NOTES>',
    '이 답변을 그대로 쓰기 전에 김원중 과장이 한 번 더 생각해 볼 점 3가지를 적어 주세요.',
    '</REVIEW_NOTES>',
  ].join('\n');
}
