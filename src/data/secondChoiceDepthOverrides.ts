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
};
