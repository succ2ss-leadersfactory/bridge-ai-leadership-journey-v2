import type { LearningSession } from '../types';

export const sessions: LearningSession[] = [
  {
    id: 'S1',
    order: 1,
    title: 'Session 1. 후배를 읽고 기준을 남기다',
    subtitle: '계속 묻는 후배와 빠르게 놓치는 후배를 다르게 봅니다.',
    theme: '후배 읽기 · 기준 세우기 · 점검 루틴',
    guidingQuestion: '이 후배에게 지금 필요한 것은 답일까요, 기준일까요?',
    miniLectureFocus: '후배 행동을 성격이 아니라 성장 신호로 보기',
    artifactName: '기준·루틴 카드',
    roundIds: ['R1', 'R2'],
  },
  {
    id: 'S2',
    order: 2,
    title: 'Session 2. 시도를 성장 경험으로 바꾸다',
    subtitle: '흔들린 후배가 다시 해볼 수 있게 작은 발판을 만듭니다.',
    theme: '성장지원 · 멘토링 · 재도전',
    guidingQuestion: '후배의 흔들린 시도를 어떻게 다시 움직이게 할까요?',
    miniLectureFocus: '실패 후 회복, 작은 재도전, AI 결과 검증 책임',
    artifactName: '멘토링 메모',
    roundIds: ['R3', 'R4'],
  },
  {
    id: 'S3',
    order: 3,
    title: 'Session 3. 맡기고 수습 속에서도 키우다',
    subtitle: '평상시 위임과 바쁜 순간의 역할 나누기를 함께 연습합니다.',
    theme: '위임 · 권한 경계 · 임파워먼트',
    guidingQuestion: '어디까지 맡기고, 어디서 함께 봐야 할까요?',
    miniLectureFocus: '위임의 경계, 중간 점검, 압박 상황의 작은 역할 남기기',
    artifactName: '위임·역할 카드',
    roundIds: ['R5', 'BOSS'],
  },
];
