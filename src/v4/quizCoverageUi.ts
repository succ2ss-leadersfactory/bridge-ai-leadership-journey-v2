import type { V3CaseId } from '../v3/types';
import { quizConceptsByCase, quizReviewConcepts, type QuizConcept } from './quizCoverage';

function currentCaseId(): V3CaseId | null {
  const pc = document.querySelector('.v4pc-topbar p')?.textContent ?? '';
  const mobile = document.querySelector('.v4-header strong')?.textContent ?? '';
  const matched = `${pc} ${mobile}`.match(/CASE\s+([A-F])/);
  return (matched?.[1] as V3CaseId | undefined) ?? null;
}

function conceptCard(concept: QuizConcept, index: number) {
  const article = document.createElement('article');
  article.className = 'v41-quiz-concept';
  article.innerHTML = `
    <div class="v41-quiz-term"><span>${index + 1}</span><strong></strong></div>
    <p class="v41-quiz-definition"></p>
    <div class="v41-quiz-case-link"><b>이 Case에서</b><p></p></div>
    <div class="v41-quiz-watch"><b>헷갈리지 않기</b><p></p></div>
    <div class="v41-quiz-remember"><b>기억할 한 문장</b><p></p></div>
  `;
  const term = article.querySelector<HTMLElement>('.v41-quiz-term strong');
  const definition = article.querySelector<HTMLElement>('.v41-quiz-definition');
  const caseLink = article.querySelector<HTMLElement>('.v41-quiz-case-link p');
  const watchOut = article.querySelector<HTMLElement>('.v41-quiz-watch p');
  const remember = article.querySelector<HTMLElement>('.v41-quiz-remember p');
  if (term) term.textContent = concept.term;
  if (definition) definition.textContent = concept.definition;
  if (caseLink) caseLink.textContent = concept.caseLink;
  if (watchOut) watchOut.textContent = concept.watchOut;
  if (remember) remember.textContent = concept.remember;
  return article;
}

function buildCaseQuizPanel(caseId: V3CaseId, concepts: QuizConcept[]) {
  const panel = document.createElement('section');
  panel.className = 'v41-quiz-panel';
  panel.dataset.caseId = caseId;

  const head = document.createElement('div');
  head.className = 'v41-quiz-head';
  head.innerHTML = `
    <span>QUIZ CONNECTION</span>
    <h2>퀴즈에 연결되는 핵심 개념</h2>
    <p>방금 경험한 장면을 시험에 나오는 정확한 개념과 연결해봅니다.</p>
  `;

  const grid = document.createElement('div');
  grid.className = 'v41-quiz-grid';
  concepts.forEach((concept, index) => grid.appendChild(conceptCard(concept, index)));

  panel.append(head, grid);
  return panel;
}

function enhanceTheoryScene() {
  const section = document.querySelector<HTMLElement>('.v3-theory-card.v4-theory-practice');
  if (!section) return;

  const caseId = currentCaseId();
  if (!caseId) return;
  const concepts = quizConceptsByCase[caseId] ?? [];

  const existing = section.querySelector<HTMLElement>('.v41-quiz-panel');
  if (!concepts.length) {
    existing?.remove();
    return;
  }
  if (existing?.dataset.caseId === caseId) return;
  existing?.remove();

  const panel = buildCaseQuizPanel(caseId, concepts);
  const theoryGrid = section.querySelector('.v3-theory-grid');
  if (theoryGrid) theoryGrid.insertAdjacentElement('afterend', panel);
  else section.prepend(panel);
}

function buildFinalReview() {
  const section = document.createElement('section');
  section.className = 'v41-quiz-review v3-card';
  section.innerHTML = `
    <div class="v41-quiz-head">
      <span>QUIZ REVIEW</span>
      <h2>6개 퀴즈 핵심 개념 한 번에 정리</h2>
      <p>정답 번호를 외우기보다, 각 개념이 무엇을 뜻하는지 한 문장으로 확인합니다.</p>
    </div>
  `;
  const grid = document.createElement('div');
  grid.className = 'v41-quiz-review-grid';
  quizReviewConcepts.forEach((concept, index) => {
    const card = document.createElement('article');
    card.className = 'v41-quiz-review-card';
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('strong');
    title.textContent = concept.term;
    const remember = document.createElement('p');
    remember.textContent = concept.remember;
    card.append(number, title, remember);
    grid.appendChild(card);
  });
  section.appendChild(grid);
  return section;
}

function enhanceFinalReview() {
  if (document.querySelector('.v41-quiz-review')) return;

  const pcGrid = document.querySelector<HTMLElement>('.v4pc-playbook-grid');
  if (pcGrid) {
    pcGrid.insertAdjacentElement('beforebegin', buildFinalReview());
    return;
  }

  const finalEyebrow = Array.from(document.querySelectorAll<HTMLElement>('.v3-eyebrow')).find((el) =>
    /FINAL\s*·\s*Bridge Leader Playbook/i.test(el.textContent ?? ''),
  );
  if (!finalEyebrow) return;
  const hero = finalEyebrow.closest<HTMLElement>('.v3-hero');
  if (!hero) return;
  hero.insertAdjacentElement('afterend', buildFinalReview());
}

function enhanceQuizCoverage() {
  enhanceTheoryScene();
  enhanceFinalReview();
}

let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    enhanceQuizCoverage();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('load', schedule);
  document.addEventListener('click', () => window.setTimeout(schedule, 0), true);
  schedule();
}
