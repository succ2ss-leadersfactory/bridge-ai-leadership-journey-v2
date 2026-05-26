import type { FlowStepId } from '../types';

export interface FlowStep {
  id: FlowStepId;
  label: string;
  description: string;
}

export const flowSteps: FlowStep[] = [
  {
    id: 'intro',
    label: '시작하기',
    description: '팀명과 닉네임을 적고 오늘 다룰 장면을 고릅니다.',
  },
  {
    id: 'situation',
    label: '오늘의 장면',
    description: '후배와 일하다가 마주칠 법한 장면을 읽습니다.',
  },
  {
    id: 'juniorReading',
    label: '이 후배, 어떻게 보이나요?',
    description: '성격을 단정하지 말고 눈에 보인 행동을 먼저 적습니다.',
  },
  {
    id: 'firstDecision',
    label: '먼저 어떻게 말할까요?',
    description: '두 가지 방식 중 지금 더 맞는 쪽을 고릅니다.',
  },
  {
    id: 'firstResult',
    label: '이 선택이 남긴 장면',
    description: '내 선택이 어떤 효과와 부담을 남겼는지 확인합니다.',
  },
  {
    id: 'juniorReaction',
    label: '후배의 다음 말',
    description: '후배가 어떻게 받아들이는지 한 번 더 살펴봅니다.',
  },
  {
    id: 'dilemmaAnalysis',
    label: '어디서 막히나요?',
    description: '일 처리와 후배 성장 사이에서 걸리는 지점을 적습니다.',
  },
  {
    id: 'secondDecision',
    label: '다시 보면, 어떻게 할까요?',
    description: '처음 생각을 유지할지, 고칠지, 바꿀지 고릅니다.',
  },
  {
    id: 'additionalSituation',
    label: '일이 한 번 더 꼬입니다',
    description: '현장에서 새로 생긴 상황을 확인합니다.',
  },
  {
    id: 'developmentDirection',
    label: '2주 동안 무엇을 도와줄까요?',
    description: '후배에게 맞는 작은 도움을 고릅니다.',
  },
  {
    id: 'aiPrompt',
    label: 'AI에게 물어볼 말 다듬기',
    description: '자동으로 만든 질문을 읽고 현장에 맞게 고쳐 복사합니다.',
  },
  {
    id: 'aiAnswerReview',
    label: 'AI 답변 골라보기',
    description: '그대로 쓸 말, 고칠 말, 조심할 말을 나눕니다.',
  },
  {
    id: 'twoWeekPlan',
    label: '2주 동안 같이 해볼 일',
    description: '후배에게 맡길 일과 내가 도와줄 일을 정합니다.',
  },
  {
    id: 'finalFiveLines',
    label: '내일 후배에게 할 말 5줄',
    description: '계획을 실제로 말할 수 있는 다섯 문장으로 바꿉니다.',
  },
  {
    id: 'result',
    label: '작성한 내용 저장',
    description: '오늘 정리한 내용을 저장합니다.',
  },
];
