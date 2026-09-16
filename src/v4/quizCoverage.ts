import type { V3CaseId } from '../v3/types';

export type QuizConcept = {
  term: string;
  definition: string;
  caseLink: string;
  watchOut: string;
  remember: string;
};

/**
 * Source: [퀴즈]Bridge_AI_Leadership_Journey_김현택.docx
 * The wording below stays within the concepts and explanations supplied in the quiz file.
 */
export const quizConceptsByCase: Partial<Record<V3CaseId, QuizConcept[]>> = {
  A: [
    {
      term: '기본적 귀인 오류',
      definition: '상황적 요인보다 개인의 성향을 지나치게 원인으로 보는 경향입니다.',
      caseLink: '윤동희 사원의 반복 질문을 곧바로 “스스로 판단하지 못하는 사람”이라고 단정하지 않습니다. 최근 지적 경험, 마감 압박, 결정 범위가 불분명했던 상황도 함께 봅니다.',
      watchOut: '후배의 행동을 성격 문제로 너무 빨리 단정하는 것이 핵심 오류입니다.',
      remember: '사람부터 판단하지 말고, 그 행동을 만든 상황도 함께 봅니다.',
    },
    {
      term: '피그말리온 효과',
      definition: '리더의 기대와 시선은 후배가 자신을 어떻게 인식하고 행동하는지에 영향을 줄 수 있습니다.',
      caseLink: '김원중 과장이 “이 정도는 윤동희 사원이 스스로 결정할 수 있다”는 기대를 말과 행동으로 보여주면, 윤동희 사원이 자신의 판단을 시도하는 데 영향을 줄 수 있습니다.',
      watchOut: '후배는 리더의 기대와 완전히 무관하게 행동하는 것이 아닙니다. 높은 기대가 언제나 부담만 되는 것도 아닙니다.',
      remember: '리더의 기대는 후배의 행동과 성장에 영향을 줄 수 있습니다.',
    },
  ],
  B: [
    {
      term: '피드백 개입 이론',
      definition: '효과적인 피드백은 사람 자체를 평가하기보다 다음 행동을 바꾸는 기준과 과정에 초점을 둡니다.',
      caseLink: '황성빈 대리에게 “꼼꼼하지 않다”고 말하기보다, 사용처가 바뀌었을 때 출처·기준 시점·단위를 다시 확인해야 했다는 행동 기준을 알려줍니다.',
      watchOut: '사람의 성격, 과거의 잘못 자체, 다른 사람과의 비교에 초점을 두지 않습니다.',
      remember: '피드백은 사람 평가보다 다음 행동을 바꾸는 기준과 과정에 둡니다.',
    },
  ],
  C: [
    {
      term: '상황적 리더십',
      definition: '후배의 준비도, 역량, 의지에 따라 지시·코칭·지원·위임 방식을 조정해야 한다는 관점입니다.',
      caseLink: '전민재 사원에게 항상 같은 방식으로 발표를 맡기거나 빼는 것이 아니라, 현재 준비 수준과 의지를 보고 역할의 크기와 김원중 과장의 지원을 조절합니다.',
      watchOut: '모든 후배에게 같은 리더십 방식을 적용하거나, 항상 지시하거나, 반대로 항상 맡겨두는 방식이 아닙니다.',
      remember: '후배의 역량과 의지에 따라 리더의 방식도 달라져야 합니다.',
    },
    {
      term: '심리적 안전감',
      definition: '구성원이 실수나 질문을 해도 무시당하거나 처벌받지 않을 것이라고 느끼는 상태입니다.',
      caseLink: '전민재 사원이 지난 실패를 숨기거나 질문을 피하지 않고, 어려웠던 점을 말하고 다시 시도할 수 있게 만드는 것이 중요합니다.',
      watchOut: '갈등이 전혀 없는 상태, 리더가 항상 친절한 상태, 어려운 일을 맡지 않는 상태를 뜻하지 않습니다.',
      remember: '심리적 안전감은 실수·질문·우려를 안전하게 말할 수 있는 분위기입니다.',
    },
  ],
  E: [
    {
      term: '자기결정성이론',
      definition: '사람의 내적 동기와 관련된 세 가지 기본 욕구는 자율성, 유능감, 관계성입니다.',
      caseLink: '윤동희 사원에게 실제 결정할 수 있는 자율성을 주고, 해낼 수 있는 경험을 쌓게 하며, 필요할 때 김원중 과장과 다시 연결될 수 있게 합니다.',
      watchOut: '경쟁성은 자기결정성이론의 세 가지 기본 욕구에 포함되지 않습니다.',
      remember: '자기결정성이론의 세 가지 기본 욕구는 자율성·유능감·관계성입니다.',
    },
  ],
};

export const quizReviewConcepts: QuizConcept[] = [
  ...(quizConceptsByCase.A ?? []),
  ...(quizConceptsByCase.B ?? []),
  ...(quizConceptsByCase.C ?? []),
  ...(quizConceptsByCase.E ?? []),
];
