import type { FlowStepId } from '../types';

export interface FlowStep {
  id: FlowStepId;
  label: string;
  description: string;
}

export const flowSteps: FlowStep[] = [
  {
    id: 'intro',
    label: '입장',
    description: '팀명과 닉네임을 입력하고 v2.0 후배 육성 Lab을 시작합니다.',
  },
  {
    id: 'situation',
    label: '상황 읽기',
    description: '후배와 함께 일하는 실제 장면을 읽습니다.',
  },
  {
    id: 'juniorReading',
    label: '후배 행동 읽기',
    description: '후배를 낙인찍지 않고 관찰 가능한 행동 패턴으로 해석합니다.',
  },
  {
    id: 'firstDecision',
    label: '1차 육성 판단',
    description: '두 가지 육성 접근 중 하나를 선택하고 이유를 적습니다.',
  },
  {
    id: 'firstResult',
    label: '선택 결과',
    description: '선택의 장점과 비용을 함께 확인합니다.',
  },
  {
    id: 'juniorReaction',
    label: '후배 반응',
    description: '후배가 어떻게 받아들이는지 추가 신호를 읽습니다.',
  },
  {
    id: 'dilemmaAnalysis',
    label: '육성 딜레마 분석',
    description: '속도, 기준, 관계, 책임 사이의 충돌을 정리합니다.',
  },
  {
    id: 'secondDecision',
    label: '다시 판단',
    description: '처음 판단을 유지할지, 보완할지, 바꿀지 결정합니다.',
  },
  {
    id: 'additionalSituation',
    label: '추가 상황',
    description: '현장에서 새롭게 드러난 제약과 압박을 확인합니다.',
  },
  {
    id: 'developmentDirection',
    label: '육성 방향 선택',
    description: '후배에게 맞는 2주 육성 방향을 고릅니다.',
  },
  {
    id: 'aiPrompt',
    label: 'AI 프롬프트 수정',
    description: '자동 생성된 프롬프트를 읽고 현장에 맞게 고친 뒤 복사합니다.',
  },
  {
    id: 'aiAnswerReview',
    label: 'AI 답변 골라보기',
    description: 'AI 답변 중 그대로 쓸 것, 고칠 것, 조심할 것을 나눕니다.',
  },
  {
    id: 'twoWeekPlan',
    label: '2주 미니 육성 플랜',
    description: '성장 목표, 과제, 지원, 점검 시점, 주의점을 작성합니다.',
  },
  {
    id: 'finalFiveLines',
    label: '5줄 현장 실행문',
    description: '후배에게 실제로 말하고 실행할 5줄 문장으로 정리합니다.',
  },
  {
    id: 'result',
    label: '결과 저장',
    description: '작성 내용을 저장하고 강사용 대시보드에서 확인할 수 있게 합니다.',
  },
];
