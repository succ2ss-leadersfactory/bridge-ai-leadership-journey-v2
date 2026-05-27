import type { FlowStepId } from '../types';

export interface FlowStep {
  id: FlowStepId;
  label: string;
  description: string;
}

export const flowSteps: FlowStep[] = [
  {
    id: 'intro',
    label: 'Lab 시작하기',
    description: '교육장에서 부를 이름을 적고 시작합니다.',
  },
  {
    id: 'sessionMap',
    label: '오늘 볼 흐름 고르기',
    description: '후배를 읽고, 키울 것을 정하고, 다시 움직이게 하는 흐름을 확인합니다.',
  },
  {
    id: 'roundMap',
    label: '장면 고르기',
    description: '선택한 흐름 안에서 직접 다뤄볼 현업 장면을 고릅니다.',
  },
  {
    id: 'situation',
    label: '지금 벌어진 일',
    description: '후배와 일하다가 실제로 마주칠 법한 장면을 읽습니다.',
  },
  {
    id: 'juniorReading',
    label: '후배를 제대로 읽기',
    description: '성격이나 태도로 단정하지 말고 역량, 강점, 약점, 막힌 지점을 함께 봅니다.',
  },
  {
    id: 'firstDecision',
    label: '김원중 과장의 첫마디',
    description: '정답을 맞히기보다 지금 실제로 할 법한 첫 대응을 고릅니다.',
  },
  {
    id: 'firstResult',
    label: '그 선택이 만든 변화',
    description: '내 선택이 어떤 효과와 부담을 남겼는지 확인합니다.',
  },
  {
    id: 'juniorReaction',
    label: '후배가 이렇게 받아들입니다',
    description: '후배의 반응 속에서 다음에 도와줄 지점을 찾습니다.',
  },
  {
    id: 'additionalSituation',
    label: '그런데, 일이 조금 달라집니다',
    description: '새로 들어온 말, 압박, 오해 때문에 처음 판단을 다시 봐야 하는 순간입니다.',
  },
  {
    id: 'dilemmaAnalysis',
    label: '다시 보면 걸리는 지점',
    description: '처음 판단이 새 상황에서도 괜찮은지, 놓치기 쉬운 비용을 봅니다.',
  },
  {
    id: 'secondDecision',
    label: '판단을 다시 잡기',
    description: '처음 생각을 유지할지, 일부 보완할지, 방향을 전환할지 고릅니다.',
  },
  {
    id: 'developmentDirection',
    label: '키울 것을 하나로 잡기',
    description: '김원중 과장이 이 후배에게 남길 작은 약속을 하나로 좁힙니다.',
  },
  {
    id: 'aiPrompt',
    label: 'AI에게 대화 초안 요청하기',
    description: '자동으로 만든 질문을 읽고 현장에 맞게 고쳐 복사합니다.',
  },
  {
    id: 'aiAnswerReview',
    label: '쓸 말·고칠 말·버릴 말',
    description: 'AI 답변을 그대로 믿지 않고 현장에서 쓸 말로 골라냅니다.',
  },
  {
    id: 'twoWeekPlan',
    label: '2주 동안 같이 해볼 일',
    description: '후배에게 맡길 일과 내가 도와줄 일을 현실적으로 정합니다.',
  },
  {
    id: 'finalFiveLines',
    label: '내일 바로 할 5줄 대화',
    description: '계획을 실제로 말할 수 있는 다섯 문장으로 바꿉니다.',
  },
  {
    id: 'result',
    label: '나의 코칭 대화문',
    description: '오늘 정리한 판단과 대화문을 확인합니다.',
  },
];
