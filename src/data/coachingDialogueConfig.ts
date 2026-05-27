export const coachingDialogueFields = [
  {
    id: 'recognition',
    label: '1. 먼저 인정할 말',
    resultLabel: '먼저 인정할 말',
    helper: '후배의 의도, 노력, 조심스러움을 먼저 인정합니다.',
    placeholder: '예: 윤동희 사원, 외부로 나가는 문구를 조심해서 보려는 태도는 좋아요.',
    required: true,
  },
  {
    id: 'question',
    label: '2. 스스로 생각하게 할 질문',
    resultLabel: '스스로 생각하게 할 질문',
    helper: '답을 바로 주기보다 후배가 먼저 기준을 말하게 돕습니다.',
    placeholder: '예: 이번 문구는 어떤 기준 때문에 확인이 필요하다고 봤어요?',
    required: true,
  },
  {
    id: 'action',
    label: '3. 이번 주 함께 정할 행동',
    resultLabel: '이번 주 함께 정할 행동',
    helper: '내일부터 바로 해볼 작은 행동을 약속합니다.',
    placeholder: '예: 이번 주에는 질문하기 전에 1차 의견과 확인받고 싶은 이유를 한 줄로 먼저 가져와 봅시다.',
    required: true,
  },
  {
    id: 'support',
    label: '4. 김원중 과장이 도와줄 방식',
    resultLabel: '김원중 과장이 도와줄 방식',
    helper: '처음부터 다 맡기지 않고, 어디까지 도와줄지 말합니다.',
    placeholder: '예: 처음 두 번은 제가 같이 보고, 그다음부터는 윤동희 사원이 먼저 기준을 잡아보는 방식으로 해봅시다.',
    required: false,
  },
  {
    id: 'watchOut',
    label: '5. 조심할 표현',
    resultLabel: '조심할 표현',
    helper: '후배가 방어적으로 들을 수 있는 말은 피하고, 바꿔 말할 표현을 적습니다.',
    placeholder: '예: “왜 또 물어봐요?” 대신 “이번 건은 어떤 기준 때문에 확인이 필요하다고 봤어요?”라고 말합니다.',
    required: false,
  },
] as const;

export function createEmptyCoachingDialogueLines() {
  return coachingDialogueFields.map(() => '');
}

export function getCoachingDialogueLabel(index: number) {
  return coachingDialogueFields[index]?.resultLabel ?? `코칭 문장 ${index + 1}`;
}

export function hasRequiredCoachingDialogueLines(finalLines: string[]) {
  return coachingDialogueFields.every((field, index) => {
    if (!field.required) return true;
    return (finalLines[index] ?? '').trim().length > 0;
  });
}
