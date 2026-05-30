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
    helper: '후배가 이번 주 안에 직접 해볼 작은 행동만 적습니다. 과장이 봐줄 범위는 4번에 따로 씁니다.',
    placeholder: '예: 이번 주에는 초안을 먼저 써보고, 확정이 어려운 표현만 표시해서 가져와 봅시다.',
    required: true,
  },
  {
    id: 'support',
    label: '4. 김원중 과장이 봐줄 선',
    resultLabel: '김원중 과장이 봐줄 선',
    helper: '김원중 과장이 어디까지 같이 보고, 어디부터 후배가 먼저 해볼지 경계를 말합니다.',
    placeholder: '예: 배포일 변경과 대외 표현만 저와 같이 보고, 기본 정리는 윤동희 사원이 먼저 해보면 됩니다.',
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
