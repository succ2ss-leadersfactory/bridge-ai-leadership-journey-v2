import { v3CaseById } from '../v3/cases';
import type { V3CaseId } from '../v3/types';
import { v4InstructorGuides, v4PlaybookModel } from './instructorGuideConfig';

type ClosingGuide = {
  example: string;
  close: string;
};

const closingByCase: Record<V3CaseId, ClosingGuide> = {
  A: {
    example: '마감이 급하면 이번 답은 줄 수 있습니다. 다만 같은 질문이 반복되면 윤동희 사원이 혼자 결정할 일과 김원중 과장에게 꼭 확인할 일을 나눕니다.',
    close: '핵심은 오늘 답을 줬는지가 아닙니다. 다음에는 윤동희 사원이 스스로 결정할 수 있는 기준이 남았는지가 중요합니다.',
  },
  B: {
    example: '황성빈 대리의 빠른 실행은 강점으로 인정합니다. 대신 자료의 사용자가 바뀌면 기준 시점·단위·출처를 다시 확인하게 합니다.',
    close: '좋은 피드백은 강점을 없애지 않습니다. 다음에 바꿀 행동을 분명히 남깁니다.',
  },
  C: {
    example: '전민재 사원이 다시 시도할 수 있도록 발표 역할을 작게 나눕니다. 김원중 과장은 예상 질문을 함께 보고, 실전에서는 필요한 경우만 보완합니다.',
    close: '실패 뒤에는 역할을 빼기보다 다시 해볼 수 있는 크기로 도전을 조절하는 것이 중요합니다.',
  },
  D: {
    example: '고승민 대리의 AI 활용은 유지합니다. 숫자·날짜·출처는 원자료로 확인하고, 해석과 제안은 사람이 근거를 보고 최종 결정합니다.',
    close: 'AI를 썼는지보다 누가 무엇을 확인하고 누가 최종 결정하는지가 더 중요합니다.',
  },
  E: {
    example: '윤동희 사원이 혼자 결정할 일, 바로 알려야 할 일, 다시 확인할 시간을 미리 정합니다. 그 사이에는 김원중 과장이 수시로 확인하지 않습니다.',
    close: '위임은 일을 넘기는 것이 아닙니다. 실제로 결정할 수 있는 범위와 다시 상의할 조건을 함께 정하는 것입니다.',
  },
  F: {
    example: '오늘은 필요한 만큼만 함께 돕습니다. 다음부터는 지원 시간과 순서를 정해 같은 사람에게 계속 일이 몰리지 않게 합니다.',
    close: '팀워크는 한 사람의 희생이 아닙니다. 급할 때 서로 돕되 부담이 반복되지 않게 기준을 정해야 합니다.',
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

function setTextIfDifferent(element: Element | null | undefined, text: string) {
  if (element && element.textContent !== text) element.textContent = text;
}

function neutralizeLearnerPlaceholders() {
  document.querySelectorAll<HTMLTextAreaElement>('.v4-discussion textarea').forEach((textarea) => {
    const text = '우리 조가 합의한 기준을 한 문장으로 적어보세요.';
    if (textarea.placeholder !== text) textarea.placeholder = text;
  });

  document.querySelectorAll<HTMLTextAreaElement>('.v4-theory-practice textarea').forEach((textarea) => {
    const text = '내 생각을 구체적으로 적어보세요.';
    if (textarea.placeholder !== text) textarea.placeholder = text;
  });

  document.querySelectorAll<HTMLTextAreaElement>('.v3-screen textarea').forEach((textarea) => {
    if (textarea.closest('.v4-discussion') || textarea.closest('.v4-theory-practice')) return;
    const labelText = textarea.closest('.v3-field')?.textContent ?? '';
    if (!labelText.includes('다음 2주 동안 실제 후배 한 명에게 할 행동')) return;
    const text = '언제, 누구에게, 무엇을 다르게 할지 한 문장으로 적어보세요.';
    if (textarea.placeholder !== text) textarea.placeholder = text;
  });
}

function renameGlobalGuideButton() {
  if (!isInstructorMode()) return;
  const guideToggle = document.querySelector<HTMLButtonElement>('.v4pc-guide-toggle');
  if (!guideToggle) return;
  const text = guideToggle.classList.contains('on') ? '강사 해설 숨기기' : '강사 해설 보기';
  setTextIfDifferent(guideToggle, text);
}

function buildRevealWrap(className: string, note: string, heading: string) {
  const wrap = document.createElement('div');
  wrap.className = `v41-reveal-wrap ${className}`;

  const head = document.createElement('div');
  head.className = 'v41-reveal-head';

  const noteEl = document.createElement('span');
  noteEl.className = 'v41-reveal-note';
  noteEl.textContent = note;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'v41-reveal-button';
  button.textContent = '마무리 예시 보기';

  const panel = document.createElement('div');
  panel.className = 'v41-reveal-panel';

  const label = document.createElement('span');
  label.className = 'v41-example-label';
  label.textContent = '이렇게 정리할 수 있습니다';

  const title = document.createElement('h3');
  title.textContent = heading;

  const body = document.createElement('div');
  body.className = 'v41-example-body';

  panel.append(label, title, body);
  head.append(noteEl, button);
  wrap.append(head, panel);

  button.addEventListener('click', () => {
    const opening = !panel.classList.contains('open');
    panel.classList.toggle('open', opening);
    button.classList.toggle('open', opening);
    button.textContent = opening ? '마무리 예시 숨기기' : '마무리 예시 보기';
  });

  return { wrap, button, panel, body };
}

function appendFacilitatorClose(body: HTMLElement, text: string) {
  const close = document.createElement('p');
  close.className = 'v41-facilitator-close';
  const title = document.createElement('b');
  title.textContent = '강사 마무리';
  const line = document.createElement('span');
  line.textContent = text;
  close.append(title, document.createElement('br'), line);
  body.append(close);
}

function enhanceDiscussionScene() {
  if (!isInstructorMode()) return;

  const section = Array.from(document.querySelectorAll<HTMLElement>('.v4pc-content-card')).find((card) =>
    /SCENE\s*6/.test(card.querySelector('.v3-eyebrow')?.textContent ?? ''),
  );
  if (!section) return;

  section.classList.add('v41-discussion-scene');

  const preview = section.querySelector<HTMLElement>('.v4pc-input-preview');
  const previewBody = preview?.querySelector<HTMLElement>('div');
  setTextIfDifferent(previewBody, '교육생들이 토의한 뒤, 조의 기준을 한 문장으로 정리합니다.');

  let wrap = section.querySelector<HTMLElement>('.v41-discussion-reveal');
  if (!wrap) {
    const created = buildRevealWrap(
      'v41-discussion-reveal',
      '교육생 토의와 한 줄 정리가 끝난 뒤 공개합니다.',
      '토의 마무리 예시',
    );
    wrap = created.wrap;
    preview?.insertAdjacentElement('afterend', wrap);
  }

  const caseId = currentCaseId();
  if (wrap.dataset.caseId === caseId) return;
  wrap.dataset.caseId = caseId;

  const guide = closingByCase[caseId];
  const body = wrap.querySelector<HTMLElement>('.v41-example-body');
  if (body) {
    body.replaceChildren();
    const example = document.createElement('p');
    example.className = 'v41-example-text';
    example.textContent = guide.example;
    body.append(example);
    appendFacilitatorClose(body, guide.close);
  }

  wrap.querySelector<HTMLElement>('.v41-reveal-panel')?.classList.remove('open');
  const button = wrap.querySelector<HTMLButtonElement>('.v41-reveal-button');
  button?.classList.remove('open');
  if (button) button.textContent = '마무리 예시 보기';
}

function enhancePracticeScene() {
  if (!isInstructorMode()) return;

  const section = document.querySelector<HTMLElement>('.v4pc-content-card.v4-theory-practice');
  if (!section) return;
  section.classList.add('v41-practice-scene');

  section.querySelectorAll<HTMLElement>('.v4pc-blank-answer').forEach((blank) => {
    setTextIfDifferent(blank, '교육생이 먼저 자신의 답을 작성합니다.');
  });

  const grid = section.querySelector<HTMLElement>('.v4pc-practice-grid');
  if (!grid) return;

  let wrap = section.querySelector<HTMLElement>('.v41-practice-reveal');
  if (!wrap) {
    const created = buildRevealWrap(
      'v41-practice-reveal',
      '교육생이 먼저 작성한 뒤 비교 예시로 공개합니다.',
      '현장도구 작성 예시',
    );
    wrap = created.wrap;
    grid.insertAdjacentElement('afterend', wrap);
  }

  const caseId = currentCaseId();
  if (wrap.dataset.caseId === caseId) return;
  wrap.dataset.caseId = caseId;

  const currentCase = v3CaseById[caseId];
  const guide = v4InstructorGuides[caseId];
  const body = wrap.querySelector<HTMLElement>('.v41-example-body');
  if (body) {
    body.replaceChildren();
    const list = document.createElement('div');
    list.className = 'v41-field-example-list';
    currentCase.practiceFields.forEach((field) => {
      const card = document.createElement('article');
      const label = document.createElement('strong');
      label.textContent = field.label;
      const answer = document.createElement('p');
      answer.textContent = guide.practiceAnswers[field.id] ?? '';
      card.append(label, answer);
      list.append(card);
    });
    body.append(list);
    appendFacilitatorClose(body, guide.facilitatorPoint);
  }

  wrap.querySelector<HTMLElement>('.v41-reveal-panel')?.classList.remove('open');
  const button = wrap.querySelector<HTMLButtonElement>('.v41-reveal-button');
  button?.classList.remove('open');
  if (button) button.textContent = '마무리 예시 보기';
}

function enhancePlaybook() {
  if (!isInstructorMode()) return;
  const grid = document.querySelector<HTMLElement>('.v4pc-playbook-grid');
  if (!grid) return;

  const page = grid.closest<HTMLElement>('.v4pc-page');
  page?.classList.add('v41-playbook-scene');

  let wrap = page?.querySelector<HTMLElement>('.v41-playbook-reveal') ?? null;
  if (!wrap) {
    const created = buildRevealWrap(
      'v41-playbook-reveal',
      '교육생이 MORE / LESS / NEXT 2 WEEKS를 먼저 정한 뒤 공개합니다.',
      'Bridge Leader Playbook 작성 예시',
    );
    wrap = created.wrap;
    grid.insertAdjacentElement('afterend', wrap);

    const body = wrap.querySelector<HTMLElement>('.v41-example-body');
    if (body) {
      const list = document.createElement('div');
      list.className = 'v41-field-example-list v41-playbook-example-list';
      const rows = [
        ['MORE', v4PlaybookModel.more],
        ['LESS', v4PlaybookModel.less],
        ['NEXT 2 WEEKS', v4PlaybookModel.nextTwoWeeks],
      ] as const;
      rows.forEach(([labelText, value]) => {
        const card = document.createElement('article');
        const label = document.createElement('strong');
        label.textContent = labelText;
        const answer = document.createElement('p');
        answer.textContent = value;
        card.append(label, answer);
        list.append(card);
      });
      body.append(list);
      appendFacilitatorClose(
        body,
        '“코칭을 잘하겠다”보다 언제, 누구에게, 무엇을 다르게 할지 행동으로 적게 합니다.',
      );
    }
  }
}

function enhanceInstructorInputReveals() {
  neutralizeLearnerPlaceholders();
  renameGlobalGuideButton();
  enhanceDiscussionScene();
  enhancePracticeScene();
  enhancePlaybook();
}

let scheduled = false;
function scheduleEnhance() {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    enhanceInstructorInputReveals();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('load', scheduleEnhance);
  document.addEventListener('click', () => window.setTimeout(scheduleEnhance, 0), true);
  scheduleEnhance();
}
