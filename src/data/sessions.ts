import type { LearningSession } from '../types';

export const sessions: LearningSession[] = [
  {
    id: 'S1',
    order: 1,
    title: 'Session 1. 후배를 제대로 읽다',
    subtitle: '보이는 행동 뒤의 역량·강점·막힌 지점을 함께 봅니다.',
    theme: '후배 파악 · 역량/강점/약점 · 막힌 지점',
    guidingQuestion: '이 후배는 무엇을 잘하고, 어디에서 막히고 있을까요?',
    miniLectureFocus: '후배를 성격으로 단정하지 않고 역량, 강점, 약점, 업무 습관, 상황 요인으로 입체적으로 보기',
    artifactName: '후배 파악 메모',
    roundIds: ['R1', 'R2'],
  },
  {
    id: 'S2',
    order: 2,
    title: 'Session 2. 키울 것을 하나로 잡다',
    subtitle: '지금 맡길 일과 확인 기준을 정합니다.',
    theme: '성장 과제 · 위임 범위 · 확인 기준',
    guidingQuestion: '지금 이 후배에게 먼저 키워야 할 한 가지는 무엇일까요?',
    miniLectureFocus: '성장 의지와 도구 활용을 실제 업무 경험, 권한, 확인 기준으로 연결하기',
    artifactName: '성장 과제 메모',
    roundIds: ['R5', 'R4'],
  },
  {
    id: 'S3',
    order: 3,
    title: 'Session 3. 다시 움직이게 하다',
    subtitle: '대화·피드백·점검으로 다음 행동을 만듭니다.',
    theme: '회복 · 피드백 · 역할 나누기',
    guidingQuestion: '후배가 위축되거나 일이 꼬였을 때 어떻게 다시 움직이게 할까요?',
    miniLectureFocus: '실수, 위축, 압박 상황 속에서도 책임과 학습을 분리하고 작은 다음 행동 만들기',
    artifactName: '다음 행동 코칭 메모',
    roundIds: ['R3', 'BOSS'],
  },
];
