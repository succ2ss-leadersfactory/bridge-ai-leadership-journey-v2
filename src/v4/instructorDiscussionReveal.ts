import type { V3CaseId } from '../v3/types';

type ClosingGuide = {
  example: string;
  close: string;
};

const closingByCase: Record<V3CaseId, ClosingGuide> = {
  A: {
    example: '마감이 급할 때는 필요한 답을 줄 수 있지만, 같은 질문이 반복되면 윤동희 사원이 혼자 결정할 범위와 반드시 확인할 조건을 함께 정한다.',
    close: '오늘 답을 줬느냐보다 중요한 것은, 다음에도 같은 질문을 반복하게 만드는 구조를 그대로 두었느냐입니다.',
  },
  B: {
    example: '황성빈 대리의 빠른 실행은 강점으로 인정하되, 자료의 사용자가 바뀌면 출처·기준 시점·단위를 다시 확인하도록 자기점검 기준을 남긴다.',
    close: '좋은 피드백은 빠른 사람을 느리게 만드는 것이 아니라, 중요한 순간에 확인 기준을 바꿀 수 있게 만드는 것입니다.',
  },
  C: {
    example: '전민재 사원이 다시 시도할 수 있도록 작은 발표 역할을 주고, 김원중 과장은 예상 질문 점검과 필요한 보완만 지원한다.',
    close: '실패 후 육성의 핵심은 다시 시킬지 말지가 아니라, 다음 시도의 크기와 리더 지원의 양을 어떻게 설계할지에 있습니다.',
  },
  D: {
    example: '고승민 대리의 AI 활용은 유지하되, 숫자·날짜·출처는 원자료와 대조하고 해석과 제안은 사람이 근거를 확인해 최종 결정한다.',
    close: 'AI 사용 여부보다 누가 무엇을 검증하고, 누가 최종 결정과 결과에 책임지는지가 더 중요합니다.',
  },
  E: {
    example: '윤동희 사원이 스스로 결정할 범위, 반드시 공유할 예외, 다시 확인할 시점을 미리 정하고 그 사이에는 김원중 과장이 수시로 개입하지 않는다.',
    close: '위임은 일을 넘기는 것이 아니라, 실제 결정할 공간과 다시 연결될 조건을 함께 설계하는 것입니다.',
  },
  F: {
    example: '긴급 공동지원은 필요할 수 있지만, 지원 시간과 범위를 먼저 정하고 최근 지원 부담이 적은 사람부터 순환해 같은 사람에게 반복되지 않게 한다.',
    close: '팀워크를 개인 희생으로 설명하지 않고, 공동책임이 필요한 순간과 부담을 공정하게 나누는 기준을 함께 만들어야 합니다.',
  },
};

function isInstructorMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode') === 'instructor' || document.documentElement.dataset.appMode === 'instructor';
}

function currentCaseId(): V3CaseId {
  const text = document.querySelector('.v4pc-topbar p')?.textContent ?? '';
  const matched = text.match(/CASE\s+([A-F])/);
  return (matched?.[1] as V3CaseId | undefined) ?? 'A';
}

function enhanceDiscussionScene() {
  if (!isInstructorMode()) return;

  const guideToggle = document.querySelector<HTMLButtonElement>('.v4pc-guide-toggle');
  if (guideToggle) {
    guideToggle.textContent = guideToggle.classList.contains('on') ? '강사 해설 숨기기' : '강사 해설 보기';
  }

  const section = Array.from(document.querySelectorAll<HTMLElement>('.v4pc-content-card')).find((card) =>
    /SCENE\s*6/.test(card.querySelector('.v3-eyebrow')?.textContent ?? ''),
  );
  if (!section) return;

  section.classList.add('v41-discussion-scene');

  const preview = section.querySelector<HTMLElement>('.v4pc-input-preview');
  const previewBody = preview?.querySelector<HTMLElement>('div');
  if (previewBody) {
    previewBody.textContent = '교육생들이 토의한 뒤, 각 조의 기준을 한 문장으로 정리합니다.';
  }

  let wrap = section.querySelector<HTMLElement>('.v41-discussion-close-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'v41-discussion-close-wrap';
    wrap.innerHTML = `
      <div class="v41-discussion-close-head">
        <span class="v41-discussion-close-note">교육생 토의가 끝난 뒤 강사가 공개합니다.</span>
        <button type="button" class="v41-discussion-reveal">마무리 예시 보기</button>
      </div>
      <div class="v41-discussion-example">
        <span class="example-label">이렇게 정리할 수 있습니다</span>
        <h3>토의 마무리 예시</h3>
        <p class="example-text"></p>
        <p class="facilitator-close"><b>강사 마무리</b><br /><span></span></p>
      </div>
    `;
    preview?.insertAdjacentElement('afterend', wrap);

    const reveal = wrap.querySelector<HTMLButtonElement>('.v41-discussion-reveal');
    const panel = wrap.querySelector<HTMLElement>('.v41-discussion-example');
    reveal?.addEventListener('click', () => {
      if (!panel || !reveal) return;
      const opening = !panel.classList.contains('open');
      panel.classList.toggle('open', opening);
      reveal.classList.toggle('open', opening);
      reveal.textContent = opening ? '마무리 예시 숨기기' : '마무리 예시 보기';
    });
  }

  const caseId = currentCaseId();
  if (wrap.dataset.caseId !== caseId) {
    wrap.dataset.caseId = caseId;
    const guide = closingByCase[caseId];
    const example = wrap.querySelector<HTMLElement>('.example-text');
    const close = wrap.querySelector<HTMLElement>('.facilitator-close span');
    const reveal = wrap.querySelector<HTMLButtonElement>('.v41-discussion-reveal');
    const panel = wrap.querySelector<HTMLElement>('.v41-discussion-example');
    if (example) example.textContent = guide.example;
    if (close) close.textContent = guide.close;
    panel?.classList.remove('open');
    reveal?.classList.remove('open');
    if (reveal) reveal.textContent = '마무리 예시 보기';
  }
}

let scheduled = false;
function scheduleEnhance() {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    enhanceDiscussionScene();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('load', scheduleEnhance);
  document.addEventListener('click', () => window.setTimeout(scheduleEnhance, 0), true);
  scheduleEnhance();
}
