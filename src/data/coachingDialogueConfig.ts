export const coachingDialogueFields = [
  {
    id: 'recognition',
    label: '1. 먼저 풀어줄 말',
    resultLabel: '먼저 풀어줄 말',
    helper: '후배가 방어하지 않도록, 의도나 노력부터 짧게 짚습니다.',
    placeholder: '예: 윤동희 사원, 외부로 나가는 문구를 조심해서 보려는 건 좋은 태도예요.',
    required: true,
  },
  {
    id: 'question',
    label: '2. 바로 답하기 전에 물어볼 말',
    resultLabel: '바로 답하기 전에 물어볼 말',
    helper: '답을 대신 주기 전에 후배가 본 기준을 먼저 꺼내게 합니다.',
    placeholder: '예: 이번 문구는 어떤 기준 때문에 한 번 더 봐야 한다고 생각했어요?',
    required: true,
  },
  {
    id: 'action',
    label: '3. 이번 주에 같이 해볼 일',
    resultLabel: '이번 주에 같이 해볼 일',
    helper: '내일부터 바로 해볼 수 있는 작은 행동으로 약속합니다.',
    placeholder: '예: 이번 주에는 질문하기 전에 “제 판단은 이렇고, 이 부분만 확인받고 싶습니다”를 한 줄로 먼저 가져와 봅시다.',
    required: true,
  },
  {
    id: 'support',
    label: '4. 김원중 과장이 봐줄 선',
    resultLabel: '김원중 과장이 봐줄 선',
    helper: '다 해주는 것이 아니라, 어디까지 같이 보고 어디부터 맡길지 말합니다.',
    placeholder: '예: 처음 두 번은 제가 같이 보고, 그다음부터는 윤동희 사원이 먼저 기준을 잡아보는 방식으로 해봅시다.',
    required: false,
  },
  {
    id: 'watchOut',
    label: '5. 입 밖으로 내면 안 좋은 말',
    resultLabel: '입 밖으로 내면 안 좋은 말',
    helper: '후배가 닫히거나 변명하게 만들 수 있는 표현은 미리 바꿔 둡니다.',
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
