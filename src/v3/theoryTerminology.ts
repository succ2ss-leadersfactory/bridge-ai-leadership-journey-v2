import type { V3Case, V3CaseId } from './types';

type TheoryCopy = V3Case['theory'];

const theoryTerminology: Record<V3CaseId, TheoryCopy> = {
  A: {
    nameKo: '자기효능감',
    nameEn: 'Self-efficacy · Scaffolding',
    oneLine: '사람은 작은 성공 경험을 쌓을수록 “나도 해낼 수 있다”는 믿음이 커집니다. 리더는 처음에는 필요한 만큼 돕고, 후배가 익숙해질수록 지원을 줄여갑니다.',
    sceneSignal: '윤 사원은 능력이 부족하다기보다, 반복 수정 경험 이후 “내가 정해도 괜찮은가”에 대한 자신감이 낮아진 상태에 가깝습니다.',
    leaderMove: '답을 계속 주기보다 혼자 결정할 범위와 반드시 확인할 조건을 분명히 하고, 작은 성공 경험을 쌓게 합니다.',
    quizConnection: '자기효능감(Self-efficacy)은 “내가 이 일을 해낼 수 있다”는 믿음입니다. 필요한 만큼 지원하고 점차 도움을 줄이는 방식은 Scaffolding으로 설명할 수 있습니다.',
  },
  B: {
    nameKo: '행동 중심 피드백',
    nameEn: 'Behavioral Feedback · Feedforward',
    oneLine: '사람의 성격을 평가하기보다 실제로 관찰한 행동과 그 영향을 말하고, 다음에는 무엇을 다르게 할지 구체적으로 정하는 피드백 방식입니다.',
    sceneSignal: '문제는 “황 대리는 꼼꼼하지 않다”가 아니라, 자료의 사용처가 바뀌었는데도 확인 기준을 다시 적용하지 않은 행동입니다.',
    leaderMove: '강점은 인정하되 어떤 행동이 어떤 영향을 만들었는지 설명하고, 다음 업무에서 바꿀 행동을 구체적으로 합의합니다.',
    quizConnection: '행동 중심 피드백은 관찰 가능한 행동에 초점을 둡니다. 다음 행동과 미래의 개선 방향을 함께 제시하는 접근은 Feedforward라고 부릅니다.',
  },
  C: {
    nameKo: '심리적 안전감 · 귀인이론',
    nameEn: 'Psychological Safety · Attribution Theory',
    oneLine: '실수나 어려움을 숨기지 않고 말할 수 있는 분위기를 만들고, 실패의 원인을 사람의 성격이 아니라 상황과 행동까지 함께 살펴보는 관점입니다.',
    sceneSignal: '민재 사원의 회피를 “원래 소극적인 사람”이라고 보면 역할을 빼는 쪽으로 가기 쉽습니다. 실제로는 공개적인 실패 경험과 예상하지 못한 질문에 대한 두려움이 영향을 주고 있습니다.',
    leaderMove: '책임을 없애기보다 실패 원인을 구체적으로 확인하고, 다시 시도할 수 있도록 난이도와 지원 수준을 조절합니다.',
    quizConnection: '심리적 안전감(Psychological Safety)은 실수와 어려움을 말할 수 있는 환경이고, 귀인이론(Attribution Theory)은 행동이나 결과의 원인을 어떻게 해석하는지 설명합니다.',
  },
  D: {
    nameKo: '휴먼 인 더 루프(HITL) · 책임성',
    nameEn: 'Human-in-the-loop · Accountability',
    oneLine: 'AI가 초안과 대안을 만들더라도 중요한 사실은 사람이 확인하고, 최종 판단과 결과에 대한 책임도 사람이 갖는 방식입니다.',
    sceneSignal: '문제는 AI를 썼다는 사실 자체가 아니라, 그럴듯한 결과를 검증 없이 받아들이고 누가 최종 판단할지 기준이 없었다는 점입니다.',
    leaderMove: 'AI 사용을 막기보다 사실·수치·출처는 사람이 확인하고, 해석과 제안은 담당자가 근거를 보고 최종 결정하도록 역할을 나눕니다.',
    quizConnection: 'Human-in-the-loop(HITL)는 AI의 판단 과정에 사람이 검토·승인·수정할 지점을 두는 방식입니다. Accountability는 최종 결과에 대해 누가 책임지는지를 분명히 하는 개념입니다.',
  },
  E: {
    nameKo: '권한위임',
    nameEn: 'Delegation · Empowerment',
    oneLine: '권한위임은 일을 넘기는 것이 아니라, 후배가 스스로 결정할 범위와 리더에게 다시 공유해야 할 조건을 함께 정하는 과정입니다.',
    sceneSignal: '전부 맡기는 것과 안전한 일만 맡기는 것 모두 성장 경험을 약하게 만들 수 있습니다. 핵심은 어디까지 혼자 결정하고 언제 다시 리더와 상의해야 하는지입니다.',
    leaderMove: '스스로 결정할 일, 미리 협의할 일, 바로 공유할 일을 구분하고 중간 확인은 꼭 필요한 수준으로 줄입니다.',
    quizConnection: 'Delegation은 업무와 함께 필요한 권한을 맡기는 것이고, Empowerment는 구성원이 실제로 판단하고 책임질 수 있도록 자율성과 역량을 키우는 접근입니다.',
  },
  F: {
    nameKo: '역할 명확성 · 팀 상호의존성',
    nameEn: 'Role Clarity · Team Interdependence',
    oneLine: '개인이 책임질 일과 팀이 함께 책임져야 할 일을 분명히 하고, 서로의 일이 연결돼 있을 때 공정하게 협력할 기준을 만드는 관점입니다.',
    sceneSignal: '황 대리의 말을 세대나 태도 문제로만 보면 “팀워크가 부족하다”는 결론으로 가기 쉽습니다. 실제로는 반복 지원의 공정성, 긴급업무 기준, 역할 경계가 함께 얽혀 있습니다.',
    leaderMove: '개인의 역할 경계를 존중하면서도 언제 공동지원이 필요한지, 부담을 어떻게 나눌지, 같은 사람에게 반복되지 않게 어떻게 조정할지 기준을 세웁니다.',
    quizConnection: '역할 명확성(Role Clarity)은 각자의 책임 범위를 분명히 하는 개념이고, 팀 상호의존성(Team Interdependence)은 서로의 일이 연결돼 있어 협력이 필요한 정도를 뜻합니다.',
  },
};

export function applyTheoryTerminology(cases: V3Case[]) {
  cases.forEach((item) => {
    item.theory = theoryTerminology[item.id];
  });
}
