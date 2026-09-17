import type { ChoiceId, Round } from '../types';
import { getRoundDisplayTitle } from './roundDisplay';

interface PromptDraft {
  juniorReading: string;
  firstChoice: ChoiceId | '';
  firstReason: string;
  dilemma: string;
  secondChoice: string;
  directionId: string;
}

interface PromptPathContext {
  juniorReaction?: string;
  additionalSituation?: string;
  developmentPathIntro?: string;
}

function getFirstChoiceText(round: Round, draft: PromptDraft) {
  const selected = round.firstChoices.find((choice) => choice.id === draft.firstChoice);
  if (!selected) return '아직 고르지 않음';

  return [
    selected.label,
    `좋은 점: ${selected.benefit}`,
    `걸리는 점: ${selected.cost}`,
    `후배에게 남을 수 있는 반응: ${selected.likelySignal}`,
  ].join('\n');
}

function getFirstChoiceResult(round: Round, draft: PromptDraft) {
  if (!draft.firstChoice) return '아직 고르지 않음';
  return round.firstResultByChoice[draft.firstChoice] ?? '아직 확인할 내용이 없음';
}

function getSecondChoiceText(round: Round, draft: PromptDraft) {
  const selected = round.secondChoices.find((choice) => choice.id === draft.secondChoice);
  if (!selected) return '아직 고르지 않음';

  return [
    selected.label,
    selected.description,
  ].join('\n');
}

function getDevelopmentDirection(round: Round, draft: PromptDraft) {
  const selected = round.developmentDirections.find((direction) => direction.id === draft.directionId);
  if (!selected) return '아직 고르지 않음';

  return [
    selected.title,
    `왜 필요한가: ${selected.description}`,
    `어떤 상황에서 쓸 수 있나: ${selected.bestWhen}`,
    `조심할 점: ${selected.watchOut}`,
  ].join('\n');
}

export function buildKacAiPrompt(round: Round, draft: PromptDraft, pathContext: PromptPathContext = {}) {
  const finalOutputName = round.finalOutput || '2주 동안 같이 해볼 일';
  const juniorReaction = pathContext.juniorReaction || round.juniorReaction;
  const additionalSituation = pathContext.additionalSituation || round.additionalSituation;
  const developmentPathIntro = pathContext.developmentPathIntro || '';

  return [
    '[당신의 역할]',
    '당신은 한국 기업과 공공기관 현장을 잘 아는 리더십 코치이자 직장 드라마 작가입니다.',
    '교육생이 “이거 우리 팀 이야기 같은데?”라고 느낄 정도로 현실적인 말로 정리해 주세요.',
    '보고서 문체나 교과서 문체가 아니라, 실제 사무실·회의실·메신저·1:1 면담에서 입 밖으로 낼 수 있는 말로 써 주세요.',
    '너무 멋진 말보다 조금 투박해도 현장에서 바로 쓸 수 있는 말을 우선해 주세요.',
    '',
    '[라운드]',
    getRoundDisplayTitle(round),
    '',
    '[지금 벌어진 일]',
    round.situation,
    '',
    '[후배에게 자주 보이는 모습]',
    `${round.juniorName} ${round.juniorRole}: ${round.behaviorPattern}`,
    '',
    '[이번에 도와줘야 할 것]',
    round.developmentTask,
    '',
    '[내가 본 후배의 모습]',
    draft.juniorReading || '아직 적지 않음',
    '',
    '[내가 처음 고른 말]',
    getFirstChoiceText(round, draft),
    '',
    '[그 말을 고른 이유]',
    draft.firstReason || '아직 적지 않음',
    '',
    '[그 말 뒤에 벌어진 일]',
    getFirstChoiceResult(round, draft),
    '',
    '[후배가 이렇게 받아들일 수 있음]',
    juniorReaction,
    '',
    '[시간이 지나자 새로 보인 부담]',
    additionalSituation,
    '',
    '[다시 생각해 보니 걸리는 점]',
    draft.dilemma || '아직 적지 않음',
    '',
    '[다시 정한 방향: 그대로 갈지 / 조금 고칠지 / 방향을 바꿀지]',
    getSecondChoiceText(round, draft),
    '',
    '[앞 선택이 남긴 숙제]',
    developmentPathIntro || '아직 선택 경로에 따른 별도 정리 없음',
    '',
    '[이 후배에게 남길 작은 약속]',
    getDevelopmentDirection(round, draft),
    '',
    '[부탁할 결과물]',
    `아래 두 가지를 ${round.juniorName} ${round.juniorRole}에게 실제로 말하고 실행할 수 있는 말로 써 주세요.`,
    `1. ${finalOutputName}`,
    '2. 후배 코칭 대화문 5줄',
    '',
    '[현장 언어 기준]',
    '- “역량 강화”, “행동 변화 유도”, “개입 범위”처럼 딱딱한 말은 줄이고, 현장에서 실제로 쓰는 말로 바꿔 주세요.',
    '- 예를 들어 “판단 기준을 내재화하도록 지원한다”보다 “다음부터는 질문 전에 본인 생각을 한 줄로 먼저 적어오게 한다”처럼 써 주세요.',
    '- “일단 여기까지는 네가 먼저 봐보고”, “이 부분은 나랑 같이 보자”, “이건 혼자 안고 있지 말고 바로 공유해 줘”처럼 자연스러운 한국 직장 말투를 써 주세요.',
    '- 후배를 평가하는 말보다 어디서 막혔는지, 다음에는 어디까지 먼저 해볼지를 같이 정하는 말로 써 주세요.',
    '',
    '[답변을 만들 때 반드시 구분할 것]',
    '- “그 말 뒤에 벌어진 일”은 업무 흐름, 즉시 결과, 남은 실무 부담으로만 해석해 주세요.',
    '- “후배가 이렇게 받아들일 수 있음”은 후배의 감정, 해석, 다음 행동 가능성으로만 해석해 주세요.',
    '- “시간이 지나자 새로 보인 부담”은 방금 선택이 틀렸다는 뜻이 아니라, 시간이 지나며 생긴 다른 부담으로 봐 주세요.',
    '- “다시 생각해 보니 걸리는 점”은 김원중 과장이 무엇을 유지하고, 무엇을 보완하거나 전환해야 하는지로 정리해 주세요.',
    '- 답변 안에서 사건 설명과 후배 심리 해석을 섞지 말고, 실행할 일과 실제 대화문에 각각 다르게 반영해 주세요.',
    '',
    '[2주 동안 같이 해볼 일 5개 항목 작성 기준]',
    '- “2주 뒤 달라졌으면 하는 모습”은 후배에게 기대하는 작은 변화 상태입니다.',
    '- “이번 주에 맡겨볼 작은 일”은 후배가 이번 주 안에 직접 해볼 1개의 구체 행동입니다. 김원중 과장이 대신 봐주거나 같이 검토하는 범위를 쓰지 마세요.',
    '- “김원중 과장이 옆에서 도와줄 일”은 리더가 제공할 지원 방식입니다. 후배가 맡을 작은 일과 같은 문장으로 쓰지 마세요.',
    '- “언제 짧게 같이 볼지”는 점검 시점입니다.',
    '- “말할 때 조심할 표현”은 후배가 방어적으로 들을 수 있는 말을 피하는 기준입니다.',
    '',
    '[코칭 대화문 작성 기준]',
    '- 좋은 말이나 훈계가 아니라 실제 대화 문장으로 써 주세요.',
    '- 1문장은 후배의 의도와 노력을 인정하는 문장으로 써 주세요.',
    '- 1문장은 후배가 스스로 기준을 말하게 하는 질문 문장으로 써 주세요.',
    '- 3번 “이번 주에 같이 해볼 일”은 후배가 이번 주에 직접 실행할 작은 행동 약속으로만 써 주세요. 예: “이번 주에는 초안을 먼저 써보고, 확정이 어려운 표현만 표시해서 가져와 봅시다.”',
    '- 4번 “김원중 과장이 봐줄 선”은 김원중 과장이 어디까지 같이 보고, 어디부터 후배가 먼저 해볼지의 경계 기준으로만 써 주세요. 예: “배포일 변경과 대외 표현만 저와 같이 보고, 기본 정리는 먼저 해보면 됩니다.”',
    '- 3번과 4번은 같은 뜻으로 쓰지 마세요. 3번은 후배의 행동, 4번은 리더의 지원 범위입니다.',
    '- 1문장은 후배가 방어적으로 들을 수 있는 표현을 피하는 기준으로 써 주세요.',
    '- 앞에서 고른 “다시 정한 방향”과 “이 후배에게 남길 작은 약속”이 대화문에 자연스럽게 반영되게 해 주세요.',
    '- 앞 선택이 남긴 숙제까지 반영해, 이미 생긴 부담을 줄이는 말과 행동으로 써 주세요.',
    '',
    '[꼭 지킬 것]',
    '- 후배를 한 단어로 단정하지 마세요.',
    '- 한쪽이 무조건 맞다고 말하지 말고, 선택마다 얻는 것과 잃는 것을 같이 봐 주세요.',
    '- 김원중 과장이 실제로 할 수 있는 수준으로 써 주세요. 제도 개선안처럼 크게 쓰지 마세요.',
    '- 2주 안에 해볼 수 있는 작은 행동으로 써 주세요.',
    '- 최종 결과물의 이름과 성격을 지켜 주세요. 기준 점검 루틴이면 그냥 육성 플랜이 아니라 점검 루틴으로 써 주세요.',
    '- 김원중 과장이 마지막에 직접 판단해야 할 부분은 질문으로 남겨 주세요.',
    '- 표는 쓰지 말고, 스마트폰에서 읽기 쉬운 짧은 문장과 목록으로 써 주세요.',
    '- “이번 주에 맡겨볼 작은 일”과 “김원중 과장이 옆에서 도와줄 일”을 같은 내용으로 쓰지 마세요.',
    '- “이번 주에 같이 해볼 일”과 “김원중 과장이 봐줄 선”을 같은 내용으로 쓰지 마세요.',
    '',
    '[답변 형식]',
    '아래 블록 이름과 항목명은 그대로 두고 작성해 주세요. 앱이 이 항목명을 기준으로 자동 분리합니다.',
    '항목명 뒤에는 바로 실제 답변만 적어 주세요. 항목 설명문을 다시 쓰지 마세요.',
    '',
    '<FINAL_ARTIFACT>',
    `1. ${finalOutputName}`,
    '- 2주 뒤 달라졌으면 하는 모습:',
    '- 이번 주에 맡겨볼 작은 일:',
    '- 김원중 과장이 옆에서 도와줄 일:',
    '- 언제 짧게 같이 볼지:',
    '- 말할 때 조심할 표현:',
    '',
    '2. 후배 코칭 대화문 5줄',
    '1) 먼저 풀어줄 말:',
    '2) 바로 답하기 전에 물어볼 말:',
    '3) 이번 주에 같이 해볼 일:',
    '4) 김원중 과장이 봐줄 선:',
    '5) 입 밖으로 내면 안 좋은 말:',
    '</FINAL_ARTIFACT>',
    '',
    '<REVIEW_NOTES>',
    '이 답변을 그대로 쓰기 전에 김원중 과장이 한 번 더 생각해 볼 점 3가지를 적어 주세요.',
    '</REVIEW_NOTES>',
  ].join('\n');
}
