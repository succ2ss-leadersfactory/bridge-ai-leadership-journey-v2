import type { V3Case, V3CaseId, V3ChoiceId, V3SecondChoiceId } from '../v3/types';

export type V4FocusMode = 'signals' | 'priority';
export type V4Tendency = 'solve' | 'coach' | 'structure' | 'safety' | 'autonomy' | 'fairness';

export interface V4CaseExperience {
  focusMode: V4FocusMode;
  focusTitle: string;
  focusDescription: string;
  focusOptions: string[];
  focusLimit: number;
  discussionTitle: string;
  discussionInstruction: string;
  discussionPrompts: string[];
  actionGuide: {
    condition: string;
    action: string;
  }[];
  sampleTalk: string;
  avoid: string;
  firstTendency: Record<V3ChoiceId, V4Tendency>;
  secondTendency: Record<V3SecondChoiceId, V4Tendency>;
}

export const v4CaseExperience: Record<V3CaseId, V4CaseExperience> = {
  A: {
    focusMode: 'signals',
    focusTitle: '첫 대응 전에 무엇을 먼저 봐야 할까요?',
    focusDescription: '후배의 성격을 추측하지 말고, 지금 행동을 만든 단서를 2개 고르세요.',
    focusLimit: 2,
    focusOptions: [
      '윤동희 사원은 스스로 더 낫다고 보는 표현과 이유가 있다.',
      '최근 공개적으로 수정 지적을 받은 뒤 확인 질문이 늘었다.',
      '지금은 팀장에게 초안을 보낼 때까지 40분밖에 남지 않았다.',
      '팀에서 “혼자 결정해도 되는 것 / 꼭 확인할 것”을 정한 적이 없다.',
      '김원중 과장이 빠르게 답을 주며 업무를 끝낸 경험도 반복됐다.',
    ],
    discussionTitle: '같은 장면에서 왜 다른 선택을 했을까요?',
    discussionInstruction: '2~3명이 각자 첫 선택과 재결정을 보여주고, “무엇을 더 중요하게 봤는지”만 비교합니다.',
    discussionPrompts: [
      '나는 마감, 후배의 자신감, 결정 기준 중 무엇을 가장 중요하게 봤나요?',
      '새 정보가 들어온 뒤 처음 선택을 유지하거나 바꾼 이유는 무엇인가요?',
      '비슷한 질문이 반복될 때 답을 주는 것과 판단 기준을 남기는 것의 경계는 어디일까요?',
    ],
    actionGuide: [
      { condition: '마감이 매우 급할 때', action: '이번 건은 빠르게 정리하되, 업무가 끝난 뒤 5~10분 안에 “다음부터 혼자 결정할 범위”를 정합니다.' },
      { condition: '후배가 자기 의견은 있지만 확신이 없을 때', action: '정답을 말하기 전에 본인의 선택과 이유를 먼저 말하게 하고, 빠진 기준만 보완합니다.' },
      { condition: '같은 질문이 반복될 때', action: '개별 질문마다 답하지 말고 “혼자 결정 / 반드시 확인” 두 구역을 함께 만듭니다.' },
    ],
    sampleTalk: '“윤동희 사원, 이번 문구는 본인이 먼저 정해도 됩니다. 왜 두 번째 표현이 낫다고 봤는지 먼저 말해보세요. 결론이나 숫자, 다른 부서와의 약속이 바뀌는 내용만 저와 꼭 확인합시다.”',
    avoid: '“이건 그냥 이렇게 쓰면 돼요”처럼 답만 주거나, 반대로 “이제부터는 알아서 해요”처럼 기준 없이 넘기지 않습니다.',
    firstTendency: { A: 'solve', B: 'coach', C: 'structure' },
    secondTendency: { keep: 'coach', adjust: 'structure', switch: 'structure' },
  },
  B: {
    focusMode: 'signals',
    focusTitle: '피드백 전에 어떤 사실을 놓치지 말아야 할까요?',
    focusDescription: '사람 평가가 아니라 행동과 업무 조건을 설명하는 단서 2개를 고르세요.',
    focusLimit: 2,
    focusOptions: [
      '황성빈 대리는 평소 빠르고 정리력이 좋다는 평가를 받아왔다.',
      '자료의 사용처가 실무 확인용에서 임원 보고용으로 중간에 바뀌었다.',
      '숫자 자체는 맞지만 기준·단위·출처가 없어 외부 독자가 오해할 수 있다.',
      '사용처가 바뀐 뒤 완성 기준을 김원중 과장도 다시 설명하지 않았다.',
      '중요 자료를 김원중 과장이 마지막에 고쳐주는 방식이 반복돼 왔다.',
    ],
    discussionTitle: '같은 문제를 두고 어떤 피드백이 더 현실적일까요?',
    discussionInstruction: '각자 선택한 대응을 실제 말투로 20초씩 말해보고, 상대가 어떻게 받아들일지 비교합니다.',
    discussionPrompts: [
      '속도라는 강점을 살리면서 기준 누락을 어떻게 말할 수 있을까요?',
      '후배 문제와 리더의 기준 공유 부족을 어디까지 함께 다뤄야 할까요?',
      '다음번에 같은 실수를 줄이려면 개인 피드백과 팀 기준 중 무엇을 먼저 바꾸겠습니까?',
    ],
    actionGuide: [
      { condition: '지금 바로 제출해야 할 때', action: '리더가 필요한 부분을 함께 보완하되, 수정한 이유를 바로 설명해 다음번 기준으로 남깁니다.' },
      { condition: '수정 시간이 확보될 때', action: '황성빈 대리에게 다시 맡기고, 사용처가 바뀌면 무엇을 다시 확인해야 하는지 스스로 찾게 합니다.' },
      { condition: '같은 문제가 여러 명에게 반복될 때', action: '개인 피드백으로 끝내지 말고 팀의 최소 완성 기준을 공통화합니다.' },
    ],
    sampleTalk: '“황성빈 대리, 속도와 정리는 좋았습니다. 다만 이번에는 사용처가 임원 보고로 바뀌면서 기준·단위·출처가 더 필요해졌어요. 이 세 가지를 먼저 다시 보고, 다음부터 사용처가 바뀌면 무엇을 확인할지 같이 정해봅시다.”',
    avoid: '“꼼꼼함이 부족하다”처럼 사람의 성향을 평가하거나, 리더가 말없이 매번 다시 고쳐주는 방식으로 끝내지 않습니다.',
    firstTendency: { A: 'solve', B: 'structure', C: 'coach' },
    secondTendency: { keep: 'solve', adjust: 'structure', switch: 'structure' },
  },
  C: {
    focusMode: 'priority',
    focusTitle: '지금 지원을 설계하려면 무엇을 가장 먼저 확인하겠습니까?',
    focusDescription: '이번 Case는 신호 찾기보다 “어디에서 막혔는가”를 먼저 정합니다. 한 가지를 고르세요.',
    focusLimit: 1,
    focusOptions: [
      '발표 자체가 부담스러운가',
      '예상하지 못한 질문을 받는 것이 두려운가',
      '지난 공개 지적 경험이 아직 크게 남아 있는가',
      '이번 회의의 실제 난이도와 요구 수준은 어느 정도인가',
    ],
    discussionTitle: '어느 정도의 재도전이 적당할까요?',
    discussionInstruction: '2~3명이 서로 다른 재도전 수준을 선택했다면 “왜 그 정도가 적당하다고 봤는지”를 협상합니다.',
    discussionPrompts: [
      '이번에는 보호가 필요한가, 다시 해볼 경험이 필요한가?',
      '도전 수준이 너무 높거나 너무 낮을 때 각각 어떤 문제가 생길까요?',
      '김원중 과장이 어디까지 도와야 “대신 해주는 것”이 되지 않을까요?',
    ],
    actionGuide: [
      { condition: '실패 경험 직후 두려움이 큰 때', action: '역할을 없애기보다 실패 원인을 먼저 구체화하고, 다음 도전의 크기를 줄입니다.' },
      { condition: '내용 이해는 충분한데 Q&A가 두려울 때', action: '예상 질문을 준비하되 첫 답변은 본인이 하게 하고, 리더는 필요한 경우만 보완합니다.' },
      { condition: '작은 성공 경험이 생긴 뒤', action: '같은 수준에 머물지 말고 다음 회의에서 발표 범위나 질문 대응 범위를 조금씩 넓힙니다.' },
    ],
    sampleTalk: '“전민재 사원, 발표 전체가 부담스러운 건지 예상 못한 질문이 가장 어려웠던 건지부터 알고 싶어요. 이번에는 첫 3분은 직접 설명하고, 질문은 먼저 답해본 뒤 필요한 부분만 제가 보완하겠습니다.”',
    avoid: '“괜찮아, 이번엔 안 해도 돼”라고 역할을 계속 빼거나, 반대로 준비 수준을 확인하지 않고 “다시 해봐”라고 밀어붙이지 않습니다.',
    firstTendency: { A: 'safety', B: 'coach', C: 'autonomy' },
    secondTendency: { keep: 'autonomy', adjust: 'coach', switch: 'safety' },
  },
  D: {
    focusMode: 'priority',
    focusTitle: 'AI 활용 문제에서 가장 먼저 관리해야 할 것은 무엇입니까?',
    focusDescription: 'AI를 잘 쓰는가보다 업무 결과를 어떻게 통제할지가 핵심입니다. 하나를 고르세요.',
    focusLimit: 1,
    focusOptions: [
      'AI가 어떤 업무에 사용됐는지',
      '숫자·날짜·출처를 어떻게 검증할지',
      'AI가 만든 해석과 사람의 판단을 어떻게 구분할지',
      '최종 결과에 누가 책임질지',
    ],
    discussionTitle: '우리 팀이라면 AI와 사람의 경계를 어디에 둘까요?',
    discussionInstruction: '각자 선택한 관리방식을 비교하고, 중요한 보고서에서 “사람이 반드시 확인할 한 지점”을 합의합니다.',
    discussionPrompts: [
      'AI를 제한하는 것과 검증 책임을 강화하는 것 중 지금 더 필요한 것은 무엇인가요?',
      '사실 확인과 해석·제안은 같은 수준으로 검증해야 할까요?',
      '“사람이 검토했다”를 어떤 행동까지 해야 검토했다고 볼 수 있을까요?',
    ],
    actionGuide: [
      { condition: '사실·수치 오류 위험이 큰 자료', action: 'AI 사용 여부와 상관없이 원자료 대조를 필수 단계로 둡니다.' },
      { condition: '해석과 제안이 중요한 보고서', action: 'AI가 낸 해석을 그대로 채택하지 않고 담당자가 근거와 채택 이유를 직접 설명하게 합니다.' },
      { condition: '팀 전체가 AI를 이미 쓰고 있을 때', action: '사용 금지보다 “어디에서 사람이 검증·승인할지”를 공통 규칙으로 만듭니다.' },
    ],
    sampleTalk: '“고승민 대리, AI를 쓰는 것 자체가 문제는 아닙니다. 다만 숫자·날짜·출처는 원자료로 확인하고, 원인 해석과 제안은 왜 그렇게 판단했는지 본인이 설명할 수 있어야 합니다.”',
    avoid: '오류 하나 때문에 AI를 전면 금지하거나, 반대로 “사람이 한 번 봤다”는 이유만으로 검증 기준 없이 통과시키지 않습니다.',
    firstTendency: { A: 'safety', B: 'safety', C: 'structure' },
    secondTendency: { keep: 'safety', adjust: 'structure', switch: 'structure' },
  },
  E: {
    focusMode: 'priority',
    focusTitle: '이번 위임에서 가장 우선할 기준은 무엇입니까?',
    focusDescription: 'BRIDGE에서는 서로 충돌하는 기준 중 무엇에 먼저 무게를 둘지 결정합니다. 하나를 고르세요.',
    focusLimit: 1,
    focusOptions: [
      '윤동희 사원의 실제 성장 경험',
      '다른 부서 일정까지 포함한 업무 안정성',
      '윤동희 사원이 스스로 결정해볼 수 있는 자율 범위',
      '문제가 생겼을 때 김원중 과장이 다시 개입할 시점',
    ],
    discussionTitle: '위임 범위를 2분 안에 협상해보세요.',
    discussionInstruction: '한 명은 김원중 과장, 한 명은 윤동희 사원 역할을 맡습니다. 90초 뒤 역할을 바꿔 “어디까지 혼자 결정하고 언제 다시 상의할지”를 합의합니다.',
    discussionPrompts: [
      '윤동희 사원이 혼자 결정해도 되는 것은 어디까지인가요?',
      '어떤 변화가 생기면 즉시 김원중 과장과 다시 연결돼야 하나요?',
      '중간 확인이 많아질수록 실제 위임 경험은 어떻게 달라질까요?',
    ],
    actionGuide: [
      { condition: '후배 경험이 충분하고 업무 위험이 낮을 때', action: '범위를 넓게 맡기고 예외 상황에서만 바로 공유하게 합니다.' },
      { condition: '성장 경험은 필요하지만 대외·타부서 영향이 클 때', action: '실무 조율은 맡기되 일정 변경·주요 합의처럼 영향이 큰 결정만 함께 확정합니다.' },
      { condition: '처음 맡는 업무라 리더도 불안할 때', action: '상시 확인 대신 미리 정한 한 시점에만 진행을 점검하고, 안정되면 확인 빈도를 줄입니다.' },
    ],
    sampleTalk: '“윤동희 사원, 자료 요청과 일정 조율은 직접 결정해보세요. 다만 전체 일정이 하루 이상 바뀌거나 다른 부서와 약속을 새로 정해야 하면 바로 같이 보겠습니다. 그 외에는 수요일 오후에 한 번만 점검하죠.”',
    avoid: '“다 맡겼으니 알아서 해요”라고 예외 조건 없이 넘기거나, 불안하다는 이유로 중요한 메일과 결정을 매번 사전 확인하지 않습니다.',
    firstTendency: { A: 'autonomy', B: 'structure', C: 'safety' },
    secondTendency: { keep: 'autonomy', adjust: 'structure', switch: 'safety' },
  },
  F: {
    focusMode: 'priority',
    focusTitle: '이 상황에서 가장 먼저 지켜야 할 기준은 무엇입니까?',
    focusDescription: '모든 기준을 동시에 만족시키기 어렵습니다. 지금 가장 우선할 한 가지를 고르세요.',
    focusLimit: 1,
    focusOptions: [
      '내일 아침 일정에 영향을 주는 오늘의 긴급성',
      '황성빈 대리에게 반복된 추가 지원의 공정성',
      '남아 있는 팀원들과의 형평성',
      '같은 문제가 반복되는 업무 분배 구조',
    ],
    discussionTitle: '우리 팀의 “도와야 할 때” 기준을 합의해보세요.',
    discussionInstruction: '2~3명이 각자 선택한 기준을 먼저 말한 뒤, “긴급 공동지원이 필요한 조건” 한 문장을 만듭니다.',
    discussionPrompts: [
      '오늘은 정말 팀 차원의 지원이 필요한 일인가요?',
      '빠르게 일을 끝낸 사람이 반복적으로 추가 일을 맡는 구조를 어떻게 막을까요?',
      '개인의 역할 경계와 팀 책임을 동시에 존중하려면 어떤 기준이 필요할까요?',
    ],
    actionGuide: [
      { condition: '오늘 안에 반드시 끝내야 하는 진짜 긴급업무', action: '모두에게 무제한 희생을 요구하지 말고 시간과 역할을 작게 나눠 공동지원합니다.' },
      { condition: '특정 사람이 최근에도 반복 지원했을 때', action: '그 경험을 먼저 인정하고 다른 인원을 우선 배정하거나 다음 업무의 우선순위를 조정합니다.' },
      { condition: '비슷한 긴급지원이 반복될 때', action: '개인의 팀워크 문제로 보지 말고 지원 순환, 업무 분배, 긴급업무 기준을 팀 방식으로 만듭니다.' },
    ],
    sampleTalk: '“황성빈 대리, 최근에도 두 번 지원해서 이 요청이 반복으로 느껴질 수 있다는 점은 이해합니다. 오늘 건은 내일 일정 때문에 30분만 같이 봐야 합니다. 제가 역할을 작게 나누고, 다음부터는 지원이 같은 사람에게 반복되지 않도록 기준을 정하겠습니다.”',
    avoid: '“팀이면 당연히 해야죠”라고 희생을 요구하거나, 반대로 개인 업무가 끝났다는 이유만으로 실제 긴급성을 보지 않고 바로 제외하지 않습니다.',
    firstTendency: { A: 'solve', B: 'fairness', C: 'coach' },
    secondTendency: { keep: 'fairness', adjust: 'fairness', switch: 'structure' },
  },
};

export const tendencyLabels: Record<V4Tendency, { title: string; description: string; strength: string; watch: string }> = {
  solve: {
    title: '빠르게 정리하는 방식',
    description: '시간 압박이 있을 때 리더가 직접 방향을 정하고 실행 속도를 확보하는 선택이 자주 보였습니다.',
    strength: '마감이 급하거나 혼선이 큰 상황에서 팀을 빠르게 안정시키는 데 강점이 됩니다.',
    watch: '반복되면 후배가 스스로 판단하고 배우는 기회가 줄어들 수 있습니다.',
  },
  coach: {
    title: '먼저 묻고 생각하게 하는 방식',
    description: '후배의 이유와 판단을 먼저 듣고 스스로 답을 찾게 하는 선택이 자주 보였습니다.',
    strength: '후배의 판단력과 자기효능감을 키우는 상황에서 강점이 됩니다.',
    watch: '마감이 매우 급하거나 기준 자체가 없는 상황에서는 질문만으로 해결되지 않을 수 있습니다.',
  },
  structure: {
    title: '기준과 역할을 분명히 하는 방식',
    description: '누가 어디까지 결정하고 무엇을 확인할지 구조를 정하는 선택이 자주 보였습니다.',
    strength: '반복되는 혼선이나 협업 경계가 모호한 상황에서 강점이 됩니다.',
    watch: '기준을 너무 촘촘하게 만들면 구성원이 스스로 판단할 공간이 줄 수 있습니다.',
  },
  safety: {
    title: '위험을 먼저 낮추는 방식',
    description: '실패나 오류 가능성을 줄이고 확인 장치를 두는 선택이 자주 보였습니다.',
    strength: '중요 보고, 대외 영향, 처음 맡는 업무처럼 실수 비용이 큰 상황에서 강점이 됩니다.',
    watch: '확인이 과해지면 속도와 자율성이 함께 떨어질 수 있습니다.',
  },
  autonomy: {
    title: '자율 범위를 넓히는 방식',
    description: '후배가 직접 결정하고 책임질 수 있는 경험을 넓혀주는 선택이 자주 보였습니다.',
    strength: '숙련도가 올라간 후배에게 성장 경험과 주도성을 주는 데 강점이 됩니다.',
    watch: '예외 조건과 다시 연결될 시점이 없으면 방치로 느껴질 수 있습니다.',
  },
  fairness: {
    title: '공정성과 팀 기준을 함께 보는 방식',
    description: '개인의 부담과 팀 전체의 책임이 어떻게 나뉘는지 함께 보는 선택이 자주 보였습니다.',
    strength: '협업 부담이 반복되거나 팀 내 형평성 이슈가 생기는 상황에서 강점이 됩니다.',
    watch: '모든 사람의 공정을 맞추려다 긴급한 결정이 늦어지지 않도록 주의해야 합니다.',
  },
};

export function applyActionSimulationOverrides(cases: V3Case[]) {
  const byId = Object.fromEntries(cases.map((item) => [item.id, item])) as Record<V3CaseId, V3Case>;

  byId.A.firstQuestion = '마감 40분 전, 윤동희 사원에게 지금 어떻게 대응하시겠습니까?';
  byId.A.firstChoices = [
    { id: 'A', label: '“이번 문구는 제가 정해드릴게요. 회의 끝나고 비슷한 질문 기준을 10분만 같이 정리하죠.”', rationale: '현재 마감을 먼저 지키고 학습은 업무 후에 연결하는 방식입니다.', benefit: '당장의 속도와 품질을 확보할 수 있습니다.', cost: '바쁜 상황마다 리더가 답을 주는 패턴이 반복될 수 있습니다.' },
    { id: 'B', label: '“윤동희 사원은 둘 중 어느 표현이 더 낫다고 봐요? 이유를 먼저 말해보세요.”', rationale: '후배의 판단 근거를 확인한 뒤 필요한 부분만 보완하는 방식입니다.', benefit: '후배의 판단 경험을 유지하면서 현재 결정을 함께 검토할 수 있습니다.', cost: '시간이 촉박할 때 대화가 길어질 수 있습니다.' },
    { id: 'C', label: '“이 정도 문구는 윤동희 사원이 결정해도 됩니다. 숫자·결론·대외 약속이 바뀌는 경우만 저와 확인합시다.”', rationale: '지금부터 결정권의 경계를 분명히 하는 방식입니다.', benefit: '반복 질문을 줄이고 자율 범위를 명확히 할 수 있습니다.', cost: '팀장 선호처럼 후배가 알기 어려운 숨은 기준이 있으면 다시 수정될 수 있습니다.' },
  ];
  byId.A.secondQuestion = '새 정보를 반영해, 앞으로 비슷한 질문을 어떤 방식으로 줄이겠습니까?';
  byId.A.secondChoices = [
    { id: 'keep', label: '이번 주는 윤동희 사원이 먼저 결정하고 하루 한 번만 묶어서 확인한다.', description: '짧은 전환기간을 두고 확인 빈도를 점차 줄이는 방식' },
    { id: 'adjust', label: '업무별로 “혼자 결정 / 반드시 확인” 두 구역을 함께 만든다.', description: '질문 횟수보다 결정 기준 자체를 눈에 보이게 만드는 방식' },
    { id: 'switch', label: '팀장 선호처럼 후배가 알기 어려운 기준만 김원중 과장이 먼저 공유한다.', description: '숨은 기준을 리더가 제거하고 나머지는 후배 판단에 맡기는 방식' },
  ];

  byId.B.firstQuestion = '황성빈 대리의 자료를 확인한 지금, 가장 현실적인 첫 대응은 무엇입니까?';
  byId.B.firstChoices = [
    { id: 'A', label: '김원중 과장이 필요한 부분을 빠르게 보완하고, 제출 뒤 수정 이유를 짧게 설명한다.', rationale: '마감과 품질을 우선해 리더가 마지막 완성도를 책임지는 방식입니다.', benefit: '제출 지연 없이 품질을 확보할 수 있습니다.', cost: '중요 자료는 결국 과장이 고친다는 기대가 남을 수 있습니다.' },
    { id: 'B', label: '“사용처가 임원 보고로 바뀌었으니 기준·단위·출처를 다시 넣어주세요. 20분 뒤 같이 봅시다.”', rationale: '기대 수준을 구체적으로 말하고 재작업 책임은 후배에게 두는 방식입니다.', benefit: '행동 기준과 책임을 분명히 할 수 있습니다.', cost: '리더가 알려준 항목만 맞추는 수동적 수정에 머물 수 있습니다.' },
    { id: 'C', label: '“외부 사람이 이 자료를 처음 본다고 생각하고, 오해할 수 있는 부분 3개를 먼저 표시해보세요.”', rationale: '후배가 스스로 완성 기준을 발견하게 하는 방식입니다.', benefit: '다음 업무에도 적용할 자기점검 기준을 만들 수 있습니다.', cost: '시간이 부족하면 검토 시간이 더 필요할 수 있습니다.' },
  ];
  byId.B.secondQuestion = '이번 일을 계기로 가장 먼저 바꿀 업무 방식 하나를 고른다면?';
  byId.B.secondChoices = [
    { id: 'keep', label: '중요 자료는 제출 전 5분만 “사용처·단위·출처”를 확인한다.', description: '개인에게 바로 적용할 짧은 사전점검 루틴' },
    { id: 'adjust', label: '사용처가 바뀌는 순간 완성 기준도 다시 확인하는 규칙을 둔다.', description: '업무 조건이 바뀔 때 자동으로 재점검하게 하는 방식' },
    { id: 'switch', label: '팀 전체가 쓰는 최소 완성 기준을 4개 이내로 정해 공통으로 사용한다.', description: '개인 실수보다 팀의 기준 공유 방식을 바꾸는 방식' },
  ];

  byId.C.firstQuestion = '이번 금요일 발표 역할을 어떻게 정하시겠습니까?';
  byId.C.firstChoices = [
    { id: 'A', label: '이번 회의에서는 발표를 빼고 자료를 맡긴 뒤, 다음 회의에서 2분 진행상황 설명부터 다시 시작한다.', rationale: '당장의 부담을 낮추고 재도전 시점을 명확히 잡는 방식입니다.', benefit: '과도한 긴장을 줄이면서 회피가 무기한 이어지는 것을 막을 수 있습니다.', cost: '이번 회의의 낮은 난이도를 활용할 기회를 놓칠 수 있습니다.' },
    { id: 'B', label: '발표 여부를 바로 정하지 않고, 지난번에 가장 막혔던 지점을 먼저 확인한 뒤 역할을 조정한다.', rationale: '실패 원인을 확인한 뒤 도전 수준을 결정하는 방식입니다.', benefit: '후배에게 필요한 지원을 더 정확히 맞출 수 있습니다.', cost: '결정을 늦추면 준비 시간이 줄어들 수 있습니다.' },
    { id: 'C', label: '5분 발표는 그대로 맡기되 예상 질문 3개를 같이 준비하고, 질문은 전민재 사원이 먼저 답하게 한다.', rationale: '도전은 유지하고 성공 가능성을 높이는 최소 지원을 붙이는 방식입니다.', benefit: '빠르게 재도전 경험을 만들 수 있습니다.', cost: '두려움이 아직 크다면 압박으로 느낄 수 있습니다.' },
  ];
  byId.C.secondQuestion = '이번 회의에서 어느 정도의 재도전을 설계하시겠습니까?';
  byId.C.secondChoices = [
    { id: 'keep', label: '5분 전체 발표 + 예상 질문 3개를 준비한다.', description: '도전 수준은 유지하고 지원만 붙이는 방식' },
    { id: 'adjust', label: '3분 진행상황 설명 + 질문 1개까지 직접 답하게 한다.', description: '역할 범위를 줄여 성공 가능성과 도전을 함께 확보하는 방식' },
    { id: 'switch', label: '마지막 1분 핵심 정리만 맡기고 다음 회의에서 3분으로 넓힌다.', description: '아주 작은 재도전부터 단계적으로 확장하는 방식' },
  ];

  byId.D.firstQuestion = '이번 보고서를 어떻게 수정·검증하게 하시겠습니까?';
  byId.D.firstChoices = [
    { id: 'A', label: '이번 보고서의 사실·수치는 원자료로 다시 작성하고, AI는 문장 정리에만 쓰게 한다.', rationale: '오류 위험이 큰 부분에서 AI 역할을 제한하는 방식입니다.', benefit: '이번 보고서의 사실 오류 가능성을 빠르게 낮출 수 있습니다.', cost: 'AI 활용 범위를 지나치게 좁히면 생산성 이점을 잃을 수 있습니다.' },
    { id: 'B', label: 'AI 초안은 유지하되 숫자·날짜·출처 옆에 근거 자료를 표시한 뒤 제출하게 한다.', rationale: 'AI 활용은 유지하고 증거 검증을 강화하는 방식입니다.', benefit: '속도를 살리면서 사실 확인 책임을 분명히 할 수 있습니다.', cost: '해석이나 제안의 타당성까지 자동으로 검증되는 것은 아닙니다.' },
    { id: 'C', label: 'AI는 요약과 구조화에 쓰고, 원인 해석과 개선 제안은 고승민 대리가 직접 작성하게 한다.', rationale: 'AI와 사람의 역할을 업무 성격에 따라 나누는 방식입니다.', benefit: '최종 판단과 제안에 사람의 책임을 남길 수 있습니다.', cost: '사실 검증 절차가 별도로 없으면 숫자 오류는 다시 생길 수 있습니다.' },
  ];
  byId.D.secondQuestion = '다음 보고서부터 어떤 AI 운영방식을 우선 적용하시겠습니까?';
  byId.D.secondChoices = [
    { id: 'keep', label: '증거 확인형: AI는 자유롭게 쓰되 사실·수치에는 반드시 원자료 근거를 붙인다.', description: '사용 범위보다 증거 검증을 통제하는 방식' },
    { id: 'adjust', label: '역할 분리형: AI는 요약·문장 구성, 사람은 해석·추천·최종 판단을 맡는다.', description: 'AI와 사람의 역할 경계를 업무 유형으로 나누는 방식' },
    { id: 'switch', label: '중요 보고 검토형: AI 활용 범위는 열어두되 제출 전 다른 사람이 한 번 교차 검토한다.', description: '개인 검증에만 의존하지 않고 검토 장치를 하나 더 두는 방식' },
  ];

  byId.E.firstQuestion = '윤동희 사원에게 이번 3주 업무를 어떤 방식으로 맡기시겠습니까?';
  byId.E.firstChoices = [
    { id: 'A', label: '업무 전체를 맡기고, 전체 일정이나 다른 부서와의 약속이 바뀔 때만 바로 공유하게 한다.', rationale: '자율 범위를 넓게 주고 예외 상황에서만 개입하는 방식입니다.', benefit: '실제 책임 경험과 주도성을 크게 줄 수 있습니다.', cost: '“공유해야 할 예외”를 서로 다르게 이해하면 리더가 늦게 알 수 있습니다.' },
    { id: 'B', label: '자료 취합과 실무 조율은 윤동희 사원이 맡고, 주요 일정 변경과 중요한 합의만 함께 결정한다.', rationale: '실무는 위임하되 영향이 큰 결정은 공동으로 가져가는 방식입니다.', benefit: '성장 경험과 업무 안정성을 함께 확보할 수 있습니다.', cost: '중요 결정의 경계가 모호하면 사소한 일까지 함께 결정하려 할 수 있습니다.' },
    { id: 'C', label: '첫 주에는 두 번 확인하고, 문제가 없으면 둘째 주부터 확인 횟수를 줄이는 방식으로 맡긴다.', rationale: '처음에는 점검을 두고 안정되면 자율 범위를 넓히는 방식입니다.', benefit: '리더와 후배 모두 부담을 낮추며 위임 수준을 점차 높일 수 있습니다.', cost: '초기 확인이 과하면 후배가 계속 사전 승인을 기다릴 수 있습니다.' },
  ];
  byId.E.secondQuestion = '새 정보를 반영해 앞으로 3주 동안 어떤 운영방식으로 위임하시겠습니까?';
  byId.E.secondChoices = [
    { id: 'keep', label: '예외 보고형: 전체 일정이나 외부 약속이 바뀔 때만 바로 공유한다.', description: '일상 결정은 넓게 맡기고 위험 신호에서만 다시 연결하는 방식' },
    { id: 'adjust', label: '결정 구역형: 혼자 결정 / 사전 협의 / 즉시 공유를 세 구역으로 나눈다.', description: '결정권 자체를 눈에 보이게 나눠 운영하는 방식' },
    { id: 'switch', label: '고정 점검형: 수요일 오후 한 번만 진행을 같이 보고 그 사이에는 맡긴다.', description: '상시 확인 대신 정해진 시점에만 다시 연결하는 방식' },
  ];

  byId.F.firstQuestion = '황성빈 대리에게 지금 어떻게 요청하시겠습니까?';
  byId.F.firstChoices = [
    { id: 'A', label: '“오늘 건은 내일 일정에 영향이 있어서 30분만 같이 도와주세요. 제가 역할을 나눠 오래 끌지 않겠습니다.”', rationale: '오늘의 긴급성을 인정하되 지원 범위를 제한하는 방식입니다.', benefit: '필요한 공동 대응을 빠르게 확보할 수 있습니다.', cost: '반복 지원의 공정성 문제가 해결되지 않으면 불만이 남을 수 있습니다.' },
    { id: 'B', label: '“최근에도 두 번 지원했으니 오늘은 다른 인원부터 배정하겠습니다. 그래도 남으면 다시 부탁드릴게요.”', rationale: '최근 부담 이력을 반영해 공정성을 먼저 조정하는 방식입니다.', benefit: '빠르게 일한 사람이 반복적으로 추가 부담을 지는 문제를 줄일 수 있습니다.', cost: '다른 팀원에게 또 다른 불공정으로 느껴질 수 있습니다.' },
    { id: 'C', label: '“오늘 꼭 필요한 일만 나눠볼게요. 황성빈 대리가 가능한 지원 범위를 말해주면 그 안에서 역할을 정하겠습니다.”', rationale: '긴급 대응과 개인 경계를 협의해 범위를 정하는 방식입니다.', benefit: '당사자의 경험을 존중하면서 필요한 지원을 확보할 수 있습니다.', cost: '긴급한 상황에서는 협의 시간이 추가로 들 수 있습니다.' },
  ];
  byId.F.secondQuestion = '이번 일을 계기로 팀 운영에서 가장 먼저 무엇을 바꾸시겠습니까?';
  byId.F.secondChoices = [
    { id: 'keep', label: '지원 순환형: 긴급지원은 최근 지원 이력을 보고 순서를 돌린다.', description: '같은 사람에게 반복적으로 부담이 몰리지 않게 하는 방식' },
    { id: 'adjust', label: '지원 보정형: 추가 지원한 사람은 다음 업무의 우선순위나 부담을 조정한다.', description: '지원 자체보다 이후 업무 균형까지 함께 관리하는 방식' },
    { id: 'switch', label: '업무 재설계형: 빠르게 끝낸 사람이 자동 백업이 되지 않도록 업무 배분 구조를 다시 본다.', description: '반복되는 긴급지원의 원인을 구조에서 줄이는 방식' },
  ];
}
