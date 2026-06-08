import type { Round } from '../types';

export const secondChoiceDepthOverrides: Partial<Record<Round['id'], Partial<Round>>> = {
  R1: {
    secondChoices: [
      {
        id: 'keep',
        label: '유지: 기준을 먼저 묻게 한다',
        description: '윤동희 사원이 먼저 본 기준을 말하게 하는 흐름은 그대로 가져간다.',
      },
      {
        id: 'revise',
        label: '일부 보완: 같이 볼 선을 덧붙인다',
        description: '기준은 먼저 묻되, 혼자 볼 일과 김원중 과장과 같이 볼 일을 함께 정한다.',
      },
      {
        id: 'change',
        label: '전환: 급한 일은 먼저 정리한다',
        description: '이번 건은 빨리 마무리하고, 회의 뒤에 다음 질문부터 쓸 기준을 짧게 약속한다.',
      },
    ],
  },
  R2: {
    secondChoices: [
      {
        id: 'keep',
        label: '유지: 오류의 무게를 먼저 짚는다',
        description: '자료 신뢰가 흔들릴 수 있었다는 점을 분명히 남긴다.',
      },
      {
        id: 'revise',
        label: '일부 보완: 속도에 기준을 붙인다',
        description: '빠른 실행은 살리되, 보내기 전 확인할 항목을 함께 정한다.',
      },
      {
        id: 'change',
        label: '전환: 루틴부터 다시 만든다',
        description: '질책보다 다음 자료부터 쓸 3분 확인 루틴으로 방향을 바꾼다.',
      },
    ],
  },
  R3: {
    secondChoices: [
      {
        id: 'keep',
        label: '유지: 먼저 불안을 낮춘다',
        description: '전민재 사원이 대화에 다시 들어올 수 있게 감정부터 받쳐준다.',
      },
      {
        id: 'revise',
        label: '일부 보완: 복기를 작게 붙인다',
        description: '안심시킨 뒤, 다음에 볼 기준을 한두 가지로만 짚는다.',
      },
      {
        id: 'change',
        label: '전환: 작은 역할부터 남긴다',
        description: '위로나 복기보다 다시 해볼 수 있는 작은 장면을 먼저 만든다.',
      },
    ],
  },
  R4: {
    secondChoices: [
      {
        id: 'keep',
        label: '유지: 책임 원칙을 먼저 잡는다',
        description: 'AI 초안이어도 최종 책임은 사람이 진다는 기준을 분명히 한다.',
      },
      {
        id: 'revise',
        label: '일부 보완: 확인 절차를 붙인다',
        description: 'AI 활용은 인정하되, 출처와 결정사항 확인을 함께 남긴다.',
      },
      {
        id: 'change',
        label: '전환: 검증 습관으로 바꾼다',
        description: 'AI 사용 여부보다 어디를 직접 확인했는지 보이게 만든다.',
      },
    ],
  },
  R5: {
    secondChoices: [
      {
        id: 'keep',
        label: '유지: 주도권을 계속 맡긴다',
        description: '윤동희 사원이 끝까지 끌고 가보는 경험을 유지한다.',
      },
      {
        id: 'revise',
        label: '일부 보완: 확인선을 다시 그린다',
        description: '맡기되 일정 변경과 대외 표현은 같이 보는 기준을 덧붙인다.',
      },
      {
        id: 'change',
        label: '전환: 역할을 나누어 맡긴다',
        description: '크게 맡기는 방식에서 혼자 할 일과 같이 볼 일을 나누는 방식으로 바꾼다.',
      },
    ],
  },
  BOSS: {
    secondChoices: [
      {
        id: 'keep',
        label: '유지: 보고 리스크를 먼저 막는다',
        description: '김원중 과장이 최종 책임을 잡고 급한 오류부터 수습한다.',
      },
      {
        id: 'revise',
        label: '일부 보완: 작은 역할을 남긴다',
        description: '보고는 과장이 책임지되, 후배에게 확인 가능한 역할을 맡긴다.',
      },
      {
        id: 'change',
        label: '전환: 역할을 다시 배분한다',
        description: '수습과 육성 중 하나를 포기하지 않고, 책임과 역할을 나눈다.',
      },
    ],
  },
};
