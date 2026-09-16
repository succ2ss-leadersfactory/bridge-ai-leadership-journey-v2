/**
 * Small shared UI-copy polish layer.
 * Case content lives in plainLanguageEditorial.ts; this file only simplifies
 * fixed labels and instructions that are hard-coded in the mobile/PC shells.
 */

const exactTextReplacements: Record<string, string> = {
  '정답을 맞히는 퀴즈가 아닙니다. 선택하고, 동료와 비교하고, 현장에서 실제로 바꿀 행동까지 남깁니다.':
    '정답을 맞히는 퀴즈가 아닙니다. 먼저 선택하고, 동료와 이유를 비교한 뒤, 다음 업무에서 바꿀 행동을 정합니다.',
  '성장을 설계한다': '성장을 돕는다',
  '개인과 팀을 연결한다': '개인과 팀을 함께 본다',
  '혼자 먼저 결정': '먼저 혼자 선택',
  '2~3명이 선택 이유 비교': '2~3명이 이유 비교',
  '이론으로 장면 해석': '이론으로 이유 이해',
  '현장 행동 도구 완성': '다음 행동 정리',
  'Case가 진행될수록 “후배 한 명 읽기”에서 “개인과 팀의 기준 조정”으로 판단 난이도가 올라갑니다.':
    '앞에서는 후배의 행동을 읽고, 뒤로 갈수록 개인과 팀의 필요를 함께 다룹니다.',
  '행동의 단서를 2개 골라 성격이 아닌 상황으로 읽습니다.':
    '행동을 만든 단서 2개를 고릅니다. 사람 성격부터 단정하지 않습니다.',
  '후배가 어디에서 막혔는지 한 가지 초점을 정하고 지원 수준을 설계합니다.':
    '후배가 어디에서 막혔는지 먼저 고르고, 어느 정도 도울지 정합니다.',
  '서로 충돌하는 기준 중 무엇을 우선할지 결정하고 동료와 협상합니다.':
    '개인과 팀의 필요가 부딪힐 때 무엇을 먼저 볼지 정하고 동료와 비교합니다.',
  '6개 선택에서 반복된 나의 리더 행동 경향을 보고, 다음 2주에 바꿀 행동을 정합니다.':
    '6개 Case에서 반복된 내 행동을 보고, 다음 2주에 바꿀 한 가지를 정합니다.',
  '좋고 나쁨을 평가하지 않습니다. 어떤 상황에서 자주 쓰는 방식인지 보고, 더 할 행동과 줄일 행동을 정합니다.':
    '좋고 나쁨을 평가하지 않습니다. 내가 자주 쓰는 방식을 보고, 더 할 행동과 줄일 행동을 정합니다.',
  '내 선택이 만든 다음 장면을 봅니다.': '내 선택 뒤에 무슨 일이 생겼는지 봅니다.',
  '처음 선택이 틀렸다는 뜻은 아닙니다. 정보가 달라졌을 때 결정을 유지할지 바꿀지가 다음 판단입니다.':
    '처음 선택이 틀렸다는 뜻은 아닙니다. 새 정보를 보고 그대로 갈지 바꿀지 다시 결정합니다.',
  '새 정보를 반영해, 실제로 운영할 방식 하나를 고르세요.':
    '새 정보를 보고, 실제로 할 방법 하나를 고르세요.',
  '이론으로 해석하고 현장 도구 만들기': '이론으로 이해하고 다음 행동 정하기',
  'MY FIELD TOOL': '현장에 가져갈 도구',
  'FIELD TOOL': '현장에 가져갈 도구',
  '먼저 내 초안을 완성한 뒤 사용합니다. AI가 리더의 첫 판단을 대신하지 않습니다.':
    '먼저 내 답을 적은 뒤 AI로 비교합니다. 첫 판단은 사람이 합니다.',
  '하나의 정답은 아닙니다. 상황 조건에 따라 행동을 달리할 수 있도록 기준을 남깁니다.':
    '하나의 정답은 아닙니다. 상황에 따라 골라 쓸 수 있는 행동 방법입니다.',
  '현장에서 이렇게 말해볼 수 있습니다': '현장에서는 이렇게 말할 수 있습니다',
  '이 장면을 설명하는 렌즈': '이 장면을 이해하는 개념',
  '모바일 학습 경험은 그대로,': '모바일과 같은 내용으로,',
  '강의 화면에는 해설과 모범 가이드를 더했습니다.': '강사는 필요한 순간에 해설과 예시를 보여줍니다.',
  '교육생용 모바일 버전의 상황·선택·이론·Action Guide 콘텐츠를 그대로 사용합니다. PC에서는 Case와 장면을 자유롭게 이동하고, 토의 후 모범 가이드를 필요한 순간에만 공개할 수 있습니다.':
    '모바일과 같은 내용을 사용합니다. PC에서는 장면을 자유롭게 이동하고, 교육생이 먼저 생각한 뒤 강사 예시를 보여줄 수 있습니다.',
  '교육생이 먼저 결정': '교육생이 먼저 선택',
  '강사는 모범 가이드를 숨긴 상태로 동일한 상황과 선택지만 제시합니다.':
    '강사는 예시를 보여주지 않고 상황과 선택지만 먼저 제시합니다.',
  '교육생들이 자신의 선택과 이유를 비교한 뒤 강사가 의견 차이를 받아냅니다.':
    '교육생들이 서로 다른 선택과 이유를 비교합니다.',
  '가이드 공개': '예시 공개',
  '상단의 ‘모범 가이드 보기’를 눌러 선택의 활용 조건과 토의 정리 방향을 설명합니다.':
    '교육생 토의가 끝난 뒤 ‘마무리 예시 보기’를 눌러 함께 정리합니다.',
  '현장 행동 연결': '다음 행동 연결',
  '교육생 입력 항목마다 예시 답안을 보여주고, 실제 팀에서 사용할 행동 문장으로 마무리합니다.':
    '교육생이 먼저 작성한 뒤 예시와 비교하고, 실제 팀에서 할 행동으로 마무리합니다.',
  '선택 전에 모범 가이드를 먼저 보여주지 않습니다.': '교육생이 먼저 선택하기 전에는 예시를 보여주지 않습니다.',
  '“정답은 C입니다”가 아니라 각 선택이 어떤 조건에서 현실적인지를 설명합니다.':
    '정답을 발표하지 않습니다. 각 선택이 언제 현실적인지 비교합니다.',
  '교육생의 답과 모범 예시가 다르더라도 행동 기준이 분명하면 비교·토의 재료로 사용합니다.':
    '교육생의 답이 예시와 달라도 괜찮습니다. 이유가 분명하면 비교할 재료로 사용합니다.',
  '마지막에는 반드시 “다음 업무에서 무엇을 다르게 할 것인가”로 연결합니다.':
    '마지막에는 “다음 업무에서 무엇을 다르게 할까?”로 연결합니다.',
  '세 보기 모두 실제 중간관리자가 선택할 수 있는 대응입니다.':
    '세 가지 모두 실제 과장이 선택할 수 있는 방법입니다.',
  '교육생에게 먼저 선택하게 한 뒤, 강사는 각 방식이 현실적인 조건과 비용을 비교합니다.':
    '교육생이 먼저 고른 뒤, 각 방법이 언제 유용하고 무엇을 놓칠 수 있는지 비교합니다.',
  '선택에는 효과와 비용이 함께 있습니다.': '어떤 선택이든 얻는 것과 놓치는 것이 있습니다.',
  '이번에는 “좋은 행동”을 고르는 것이 아니라 운영방식을 선택합니다.':
    '좋아 보이는 답을 찾는 것이 아닙니다. 실제로 쓸 방법 하나를 고릅니다.',
  '상황, 시간, 후배의 준비 수준에 따라 다른 선택이 가능합니다.':
    '상황과 시간, 후배의 준비 정도에 따라 선택은 달라질 수 있습니다.',
  '이 결과는 진단 점수가 아니라 6개 시뮬레이션에서 선택한 행동의 단순 경향입니다.':
    '이 결과는 평가 점수가 아닙니다. 6개 Case에서 내가 자주 고른 행동을 간단히 보여줍니다.',
};

const placeholderReplacements: Array<[RegExp, string]> = [
  [/^예:\s*김과장$/, '예: 브릿지리더1'],
  [/^예:\s*마감이 급해도.*$/, '우리 조가 합의한 기준을 한 문장으로 적어보세요.'],
  [/^예:\s*다음 주 화요일.*$/, '언제, 누구에게, 무엇을 다르게 할지 한 문장으로 적어보세요.'],
];

function replaceExactTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const current = node.textContent ?? '';
    const trimmed = current.trim();
    const replacement = exactTextReplacements[trimmed];
    if (replacement && replacement !== trimmed) {
      const leading = current.match(/^\s*/)?.[0] ?? '';
      const trailing = current.match(/\s*$/)?.[0] ?? '';
      node.textContent = `${leading}${replacement}${trailing}`;
    }
    node = walker.nextNode();
  }
}

function replacePlaceholders() {
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[placeholder], textarea[placeholder]').forEach((field) => {
    for (const [pattern, replacement] of placeholderReplacements) {
      if (pattern.test(field.placeholder)) {
        field.placeholder = replacement;
        break;
      }
    }
  });
}

function polishUi() {
  replaceExactTextNodes();
  replacePlaceholders();
}

let scheduled = false;
function schedulePolish() {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    polishUi();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(schedulePolish);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder'] });
  window.addEventListener('load', schedulePolish);
  document.addEventListener('click', () => window.setTimeout(schedulePolish, 0), true);
  schedulePolish();
}
