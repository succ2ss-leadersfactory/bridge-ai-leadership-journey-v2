import { useEffect, useMemo, useState } from 'react';
import { kacCiLogoDataUrl } from '../assets/kacCiLogo';
import { copyTextToClipboard } from '../lib/clipboard';
import { v3CaseById, v3Cases, v3SessionGroups } from '../v3/cases';
import { emptyCaseDraft, exportV3Backup, initialV3State, loadV3State, resetV3State, saveV3State } from '../v3/storage';
import type { V3CaseDraft, V3CaseId, V3LocalState, V3StepId } from '../v3/types';
import { tendencyLabels, v4CaseExperience, type V4Tendency } from '../v4/actionSimulationConfig';

const caseSteps: V3StepId[] = [
  'situation',
  'signals',
  'firstDecision',
  'consequence',
  'secondDecision',
  'discussion',
  'theoryBridge',
  'result',
];

const legacyStepMap: Partial<Record<V3StepId, V3StepId>> = {
  newInfo: 'consequence',
  practice: 'theoryBridge',
};

const moreActions = [
  '답을 주기 전에 후배의 판단 근거를 먼저 듣는다.',
  '성격이 아니라 관찰한 행동과 다음 행동으로 피드백한다.',
  '실패 후 역할을 빼기보다 작은 재도전을 설계한다.',
  'AI 결과에서 사람이 확인·결정할 지점을 분명히 한다.',
  '위임할 때 결정권과 다시 연결될 조건을 함께 정한다.',
  '팀워크를 요구하기 전에 공동지원의 공정한 기준을 만든다.',
];

const lessActions = [
  '시간이 없다는 이유로 답을 먼저 알려준다.',
  '후배를 성격이나 세대 특성으로 먼저 단정한다.',
  '한 번 실패한 후배에게서 역할을 바로 빼준다.',
  'AI 결과가 그럴듯하면 검증 없이 채택한다.',
  '위임한 뒤 불안해서 모든 중간 과정을 다시 확인한다.',
  '팀워크를 이유로 같은 사람에게 반복적으로 추가 부담을 준다.',
];

function getCaseDraft(state: V3LocalState, caseId: V3CaseId): V3CaseDraft {
  return state.cases[caseId] ?? emptyCaseDraft();
}

function allCasesCompleted(state: V3LocalState) {
  return v3Cases.every((item) => Boolean(state.cases[item.id]?.completedAt));
}

function normalizeLoadedState(input: V3LocalState): V3LocalState {
  const mapped = legacyStepMap[input.currentStep] ?? input.currentStep;
  const safeStep = input.currentCaseId && !caseSteps.includes(mapped) && mapped !== 'result'
    ? 'situation'
    : mapped;
  return { ...input, currentStep: safeStep };
}

function getPracticeSummary(caseId: V3CaseId, draft: V3CaseDraft) {
  return v3CaseById[caseId].practiceFields
    .map((field) => ({ label: field.label, value: draft.practiceAnswers[field.id] ?? '' }))
    .filter((entry) => entry.value.trim().length > 0);
}

function getTendencySummary(state: V3LocalState) {
  const score: Record<V4Tendency, number> = {
    solve: 0,
    coach: 0,
    structure: 0,
    safety: 0,
    autonomy: 0,
    fairness: 0,
  };

  v3Cases.forEach((item) => {
    const draft = state.cases[item.id];
    if (!draft) return;
    const experience = v4CaseExperience[item.id];
    if (draft.firstChoice) score[experience.firstTendency[draft.firstChoice]] += 2;
    if (draft.secondChoice) score[experience.secondTendency[draft.secondChoice]] += 1;
  });

  return (Object.entries(score) as [V4Tendency, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key, value]) => ({ key, value, ...tendencyLabels[key] }));
}

export function V4ActionSimulationShell() {
  const [state, setState] = useState<V3LocalState>(() => normalizeLoadedState(loadV3State()));
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const currentCase = state.currentCaseId ? v3CaseById[state.currentCaseId] : null;
  const currentDraft = state.currentCaseId ? getCaseDraft(state, state.currentCaseId) : null;
  const currentExperience = state.currentCaseId ? v4CaseExperience[state.currentCaseId] : null;
  const completedCount = v3Cases.filter((item) => Boolean(state.cases[item.id]?.completedAt)).length;

  useEffect(() => {
    saveV3State(state);
  }, [state]);

  function patchState(patch: Partial<V3LocalState>) {
    setState((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));
  }

  function patchCase(caseId: V3CaseId, patch: Partial<V3CaseDraft>) {
    setState((prev) => {
      const current = getCaseDraft(prev, caseId);
      return {
        ...prev,
        cases: { ...prev.cases, [caseId]: { ...current, ...patch } },
        updatedAt: new Date().toISOString(),
      };
    });
  }

  function navigate(step: V3StepId) {
    setState((prev) => {
      if (prev.currentCaseId && caseSteps.includes(step)) {
        const current = getCaseDraft(prev, prev.currentCaseId);
        return {
          ...prev,
          currentStep: step,
          cases: { ...prev.cases, [prev.currentCaseId]: { ...current, lastStep: step } },
          updatedAt: new Date().toISOString(),
        };
      }
      return { ...prev, currentStep: step, updatedAt: new Date().toISOString() };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startCase(caseId: V3CaseId) {
    setCopyStatus('idle');
    setState((prev) => {
      const current = getCaseDraft(prev, caseId);
      const experience = v4CaseExperience[caseId];
      const validFocus = current.selectedSignals
        .filter((value) => experience.focusOptions.includes(value))
        .slice(0, experience.focusLimit);
      const storedStep = current.lastStep ? (legacyStepMap[current.lastStep] ?? current.lastStep) : 'situation';
      const targetStep = current.completedAt
        ? 'result'
        : caseSteps.includes(storedStep)
          ? storedStep
          : 'situation';
      return {
        ...prev,
        currentCaseId: caseId,
        currentStep: targetStep,
        cases: {
          ...prev.cases,
          [caseId]: { ...current, selectedSignals: validFocus, lastStep: targetStep },
        },
        updatedAt: new Date().toISOString(),
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goCaseMap() {
    setCopyStatus('idle');
    patchState({ currentStep: 'caseMap', currentCaseId: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBackCaseStep() {
    const index = caseSteps.indexOf(state.currentStep);
    if (index <= 0) return goCaseMap();
    navigate(caseSteps[index - 1]);
  }

  function goNextCaseStep() {
    const index = caseSteps.indexOf(state.currentStep);
    if (index >= 0 && index < caseSteps.length - 1) navigate(caseSteps[index + 1]);
  }

  function toggleFocus(option: string) {
    if (!state.currentCaseId || !currentDraft || !currentExperience) return;
    const exists = currentDraft.selectedSignals.includes(option);
    let next: string[];
    if (currentExperience.focusLimit === 1) {
      next = exists ? [] : [option];
    } else {
      next = exists
        ? currentDraft.selectedSignals.filter((item) => item !== option)
        : currentDraft.selectedSignals.length < currentExperience.focusLimit
          ? [...currentDraft.selectedSignals, option]
          : currentDraft.selectedSignals;
    }
    patchCase(state.currentCaseId, { selectedSignals: next });
  }

  function canContinue() {
    if (state.currentStep === 'intro') return state.profile.teamName.trim().length > 0 && state.profile.nickname.trim().length > 0;
    if (!currentCase || !currentDraft || !currentExperience) return true;
    if (state.currentStep === 'signals') return currentDraft.selectedSignals.length === currentExperience.focusLimit;
    if (state.currentStep === 'firstDecision') return currentDraft.firstChoice !== '';
    if (state.currentStep === 'secondDecision') return currentDraft.secondChoice !== '';
    if (state.currentStep === 'theoryBridge') return currentCase.practiceFields.every((field) => (currentDraft.practiceAnswers[field.id] ?? '').trim().length > 0);
    return true;
  }

  const aiPrompt = useMemo(() => {
    if (!currentCase || !currentDraft || currentCase.aiMode === 'none' || !currentCase.aiPromptTemplate) return '';
    const draftText = currentCase.practiceFields
      .map((field) => `${field.label}: ${currentDraft.practiceAnswers[field.id] || '(아직 작성하지 않음)'}`)
      .join('\n');
    return `[상황]\n${currentCase.situation}\n\n[내가 먼저 만든 초안]\n${draftText}\n\n[AI에게 요청]\n${currentCase.aiPromptTemplate}`;
  }, [currentCase, currentDraft]);

  async function copyAiPrompt() {
    if (!aiPrompt || !state.currentCaseId) return;
    const copied = await copyTextToClipboard(aiPrompt);
    setCopyStatus(copied ? 'success' : 'fail');
    if (copied) patchCase(state.currentCaseId, { aiPromptUsed: true });
  }

  function completeCase() {
    if (!state.currentCaseId) return;
    const caseId = state.currentCaseId;
    setState((prev) => {
      const current = getCaseDraft(prev, caseId);
      return {
        ...prev,
        currentCaseId: null,
        currentStep: 'caseMap',
        cases: { ...prev.cases, [caseId]: { ...current, lastStep: 'result', completedAt: new Date().toISOString() } },
        updatedAt: new Date().toISOString(),
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetAll() {
    if (!window.confirm('이 기기에 저장된 실습 내용과 완료 기록을 모두 지울까요?')) return;
    resetV3State();
    setState(initialV3State());
    setCopyStatus('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function savePlaybook() {
    if (!state.playbook.moreAction || !state.playbook.lessAction || !state.playbook.twoWeekAction.trim()) return;
    patchState({ playbook: { ...state.playbook, savedAt: new Date().toISOString() } });
  }

  function Header() {
    return (
      <header className="v3-header v4-header">
        <div>
          <p className="v3-header-kicker">한국공항공사 · 과장급 Bridge Leader Lab</p>
          <strong>{currentCase ? `CASE ${currentCase.id} · ${currentCase.session}` : 'Bridge AI Leadership Journey'}</strong>
        </div>
        <span>{completedCount}/6</span>
      </header>
    );
  }

  function Nav({ hideNext = false }: { hideNext?: boolean }) {
    return (
      <nav className="v3-bottom-nav">
        <button type="button" className="v3-btn secondary" onClick={goBackCaseStep}>이전</button>
        <button type="button" className="v3-btn ghost" onClick={goCaseMap}>CASE MAP</button>
        {!hideNext ? <button type="button" className="v3-btn primary" onClick={goNextCaseStep} disabled={!canContinue()}>다음</button> : <span />}
      </nav>
    );
  }

  function Intro() {
    const teamOptions = Array.from({ length: 8 }, (_, index) => `${index + 1}팀`);
    return (
      <main className="v3-screen v3-intro v4-screen">
        <section className="v3-brand-card v4-brand-card">
          <img src={kacCiLogoDataUrl} alt="한국공항공사 CI" />
          <p>Bridge AI Leadership Journey · Action Simulation</p>
          <h1>후배를 키우는 과장의<br />현실적인 선택을 연습합니다.</h1>
          <p className="v3-muted">정답을 맞히는 퀴즈가 아닙니다. 선택하고, 동료와 비교하고, 현장에서 실제로 바꿀 행동까지 남깁니다.</p>
          <div className="v4-journey-strip">
            <span><b>READ</b> 행동을 읽는다</span>
            <i>→</i>
            <span><b>DEVELOP</b> 성장을 설계한다</span>
            <i>→</i>
            <span><b>BRIDGE</b> 개인과 팀을 연결한다</span>
          </div>
        </section>
        <section className="v3-card">
          <h2>진행 방식</h2>
          <div className="v4-how-grid">
            <article><strong>1</strong><span>혼자 먼저 결정</span></article>
            <article><strong>2</strong><span>2~3명이 선택 이유 비교</span></article>
            <article><strong>3</strong><span>이론으로 장면 해석</span></article>
            <article><strong>4</strong><span>현장 행동 도구 완성</span></article>
          </div>
          <p className="v3-muted">입력 내용은 이 기기의 브라우저에만 저장됩니다. 실제 직원 이름이나 민감정보는 입력하지 않습니다.</p>
          <p className="v3-label">우리 팀</p>
          <div className="v3-chip-grid">{teamOptions.map((team) => <button type="button" key={team} className={`v3-chip ${state.profile.teamName === team ? 'selected' : ''}`} onClick={() => patchState({ profile: { ...state.profile, teamName: team } })}>{team}</button>)}</div>
          <label className="v3-field"><span>이름/닉네임</span><input value={state.profile.nickname} onChange={(event) => patchState({ profile: { ...state.profile, nickname: event.target.value } })} placeholder="예: 김과장" /></label>
          <button type="button" className="v3-btn primary wide" disabled={!canContinue()} onClick={() => navigate('caseMap')}>CASE MAP 보기</button>
        </section>
      </main>
    );
  }

  function CaseMap() {
    const completed = allCasesCompleted(state);
    return (
      <main className="v3-screen v4-screen">
        <Header />
        <section className="v3-hero compact v4-map-hero">
          <p className="v3-eyebrow">나의 학습 여정</p>
          <h1>6개의 상황, 6개의 다른 리더 행동을 연습합니다.</h1>
          <p>Case가 진행될수록 “후배 한 명 읽기”에서 “개인과 팀의 기준 조정”으로 판단 난이도가 올라갑니다.</p>
          <div className="v3-progress"><span style={{ width: `${(completedCount / 6) * 100}%` }} /></div>
          <small>{completedCount}개 완료 · 진행 위치와 작성 내용이 자동 저장됩니다.</small>
        </section>
        {v3SessionGroups.map((group) => (
          <section key={group.id} className={`v3-section-block v4-session v4-${group.id.toLowerCase()}`}>
            <div className="v3-section-title">
              <h2>{group.title}</h2>
              <p>{group.subtitle}</p>
              <div className="v4-session-method">
                {group.id === 'READ' ? '행동의 단서를 2개 골라 성격이 아닌 상황으로 읽습니다.' : null}
                {group.id === 'DEVELOP' ? '후배가 어디에서 막혔는지 한 가지 초점을 정하고 지원 수준을 설계합니다.' : null}
                {group.id === 'BRIDGE' ? '서로 충돌하는 기준 중 무엇을 우선할지 결정하고 동료와 협상합니다.' : null}
              </div>
            </div>
            <div className="v3-case-list">
              {group.caseIds.map((caseId) => {
                const item = v3CaseById[caseId];
                const draft = state.cases[caseId];
                const done = Boolean(draft?.completedAt);
                const started = Boolean(draft && draft.lastStep && draft.lastStep !== 'situation');
                return (
                  <button type="button" key={caseId} className={`v3-case-card v4-case-card ${done ? 'done' : ''}`} onClick={() => startCase(caseId)}>
                    <span className="v3-case-id">CASE {caseId}</span>
                    <strong>{item.title}</strong>
                    <p>{item.hook}</p>
                    <small>{done ? '완료 · 행동가이드 다시 보기' : started ? '작성 중 · 이어서 하기' : '시작하기'}</small>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
        <section className={`v3-card v3-playbook-callout ${completed ? 'ready' : ''}`}>
          <p className="v3-eyebrow">FINAL</p><h2>나의 Bridge Leader Playbook</h2>
          <p>{completed ? '6개 선택에서 반복된 나의 리더 행동 경향을 보고, 다음 2주에 바꿀 행동을 정합니다.' : `6개 Case를 모두 마치면 열립니다. 지금 ${6 - completedCount}개 남았습니다.`}</p>
          <button type="button" className="v3-btn primary wide" disabled={!completed} onClick={() => navigate('playbook')}>종합 정리하기</button>
        </section>
        <div className="v3-utility-row"><button type="button" className="v3-btn secondary" onClick={() => exportV3Backup(state)}>내 결과 백업</button><button type="button" className="v3-btn danger" onClick={resetAll}>전체 초기화</button></div>
      </main>
    );
  }

  function Playbook() {
    const completed = allCasesCompleted(state);
    const tendencies = getTendencySummary(state);
    const journeyRows = v3Cases.map((item) => {
      const draft = state.cases[item.id];
      const first = item.firstChoices.find((choice) => choice.id === draft?.firstChoice)?.label ?? '—';
      const second = item.secondChoices.find((choice) => choice.id === draft?.secondChoice)?.label ?? '—';
      return { item, first, second };
    });
    return (
      <main className="v3-screen v4-screen">
        <Header />
        <section className="v3-hero compact"><p className="v3-eyebrow">FINAL · Bridge Leader Playbook</p><h1>6개의 선택에서 내 리더 행동 패턴을 찾습니다.</h1><p>좋고 나쁨을 평가하지 않습니다. 어떤 상황에서 자주 쓰는 방식인지 보고, 더 할 행동과 줄일 행동을 정합니다.</p></section>
        {!completed ? <section className="v3-card"><p>아직 완료하지 않은 Case가 있습니다.</p><button className="v3-btn primary wide" onClick={goCaseMap}>CASE MAP으로</button></section> : (
          <>
            <section className="v3-card v4-pattern-card"><p className="v3-eyebrow">MY PATTERN</p><h2>내 선택에서 자주 나타난 방식</h2><div className="v4-pattern-grid">{tendencies.map((item) => <article key={item.key}><strong>{item.title}</strong><p>{item.description}</p><small><b>강점이 되는 때</b> {item.strength}</small><small><b>주의할 때</b> {item.watch}</small></article>)}</div><p className="v3-muted">이 결과는 진단 점수가 아니라 6개 시뮬레이션에서 선택한 행동의 단순 경향입니다.</p></section>
            <section className="v3-card"><p className="v3-eyebrow">MY DECISIONS</p><h2>6개 장면에서 내가 실제로 한 선택</h2><div className="v3-journey-list">{journeyRows.map(({ item, first, second }) => <article key={item.id}><span>CASE {item.id}</span><strong>{item.title}</strong><p><b>처음</b> {first}</p><p><b>새 정보 후</b> {second}</p></article>)}</div></section>
            <section className="v3-card"><p className="v3-label">앞으로 더 할 행동 1개</p><div className="v3-choice-list compact-list">{moreActions.map((action) => <button type="button" key={action} className={`v3-choice ${state.playbook.moreAction === action ? 'selected' : ''}`} onClick={() => patchState({ playbook: { ...state.playbook, moreAction: action, savedAt: undefined } })}>{action}</button>)}</div></section>
            <section className="v3-card"><p className="v3-label">앞으로 줄일 행동 1개</p><div className="v3-choice-list compact-list">{lessActions.map((action) => <button type="button" key={action} className={`v3-choice ${state.playbook.lessAction === action ? 'selected' : ''}`} onClick={() => patchState({ playbook: { ...state.playbook, lessAction: action, savedAt: undefined } })}>{action}</button>)}</div></section>
            <section className="v3-card"><label className="v3-field"><span>다음 2주 동안 실제 후배 한 명에게 할 행동</span><textarea rows={4} value={state.playbook.twoWeekAction} onChange={(event) => patchState({ playbook: { ...state.playbook, twoWeekAction: event.target.value, savedAt: undefined } })} placeholder="예: 다음 주 화요일 업무 요청 때 윤곽만 알려주고, 판단 기준 두 가지를 먼저 말하게 한다." /></label><button type="button" className="v3-btn primary wide" disabled={!state.playbook.moreAction || !state.playbook.lessAction || !state.playbook.twoWeekAction.trim()} onClick={savePlaybook}>{state.playbook.savedAt ? 'Playbook 저장 완료' : '나의 Playbook 저장하기'}</button>{state.playbook.savedAt ? <p className="v3-success">이 기기에 저장했습니다.</p> : null}</section>
            <section className="v3-card v3-summary-card"><h2>나의 Bridge Leader Playbook</h2><p><strong>MORE</strong><br />{state.playbook.moreAction || '—'}</p><p><strong>LESS</strong><br />{state.playbook.lessAction || '—'}</p><p><strong>NEXT 2 WEEKS</strong><br />{state.playbook.twoWeekAction || '—'}</p><div className="v3-utility-row"><button type="button" className="v3-btn secondary" onClick={() => exportV3Backup(state)}>결과 백업</button><button type="button" className="v3-btn primary" onClick={goCaseMap}>CASE MAP</button></div></section>
          </>
        )}
      </main>
    );
  }

  if (state.currentStep === 'intro') return Intro();
  if (state.currentStep === 'caseMap' || (!currentCase && state.currentStep !== 'playbook')) return CaseMap();
  if (state.currentStep === 'playbook') return Playbook();
  if (!currentCase || !currentDraft || !currentExperience) return CaseMap();

  const selectedFirstChoice = currentCase.firstChoices.find((choice) => choice.id === currentDraft.firstChoice);
  const choiceResult = currentDraft.firstChoice ? currentCase.consequenceByChoice[currentDraft.firstChoice] : '';
  const newInfo = currentDraft.firstChoice ? currentCase.newInfoByChoice[currentDraft.firstChoice] : '';
  const selectedSecondChoice = currentCase.secondChoices.find((choice) => choice.id === currentDraft.secondChoice);
  const practiceSummary = getPracticeSummary(currentCase.id, currentDraft);
  const stepIndex = caseSteps.indexOf(state.currentStep);

  return (
    <main className={`v3-screen v4-screen v4-case-${currentCase.session.toLowerCase()}`}>
      <Header />
      <div className="v3-case-progress"><span>{stepIndex + 1}</span><div><i style={{ width: `${((stepIndex + 1) / caseSteps.length) * 100}%` }} /></div><span>{caseSteps.length}</span></div>

      {state.currentStep === 'situation' ? <section className="v3-hero v4-situation"><p className="v3-eyebrow">SCENE 1 · 지금 벌어진 일</p><h1>{currentCase.title}</h1><p className="v3-dilemma">{currentCase.leadershipDilemma}</p><div className="v3-story">{currentCase.situation.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line || <br />}</p>)}</div><div className="v4-scene-tip"><b>읽을 때</b><span>“이 후배는 어떤 사람인가?”보다 “무슨 일이 이 행동을 만들었나?”를 먼저 봅니다.</span></div></section> : null}

      {state.currentStep === 'signals' ? <section className="v3-card"><p className="v3-eyebrow">SCENE 2 · {currentCase.session === 'READ' ? '행동을 읽기' : currentCase.session === 'DEVELOP' ? '지원 초점 정하기' : '우선 기준 정하기'}</p><h1>{currentExperience.focusTitle}</h1><p className="v3-muted">{currentExperience.focusDescription}</p><div className="v3-choice-list">{currentExperience.focusOptions.map((option) => <button type="button" key={option} className={`v3-choice ${currentDraft.selectedSignals.includes(option) ? 'selected' : ''}`} onClick={() => toggleFocus(option)}><span>{currentDraft.selectedSignals.includes(option) ? '✓' : ''}</span>{option}</button>)}</div><p className="v3-counter">{currentDraft.selectedSignals.length}/{currentExperience.focusLimit} 선택</p></section> : null}

      {state.currentStep === 'firstDecision' ? <section className="v3-card"><p className="v3-eyebrow">SCENE 3 · 첫 결정</p><h1>{currentCase.firstQuestion}</h1><div className="v4-real-choice-note"><strong>세 보기 모두 실제 중간관리자가 선택할 수 있는 대응입니다.</strong><span>정답을 찾기보다 지금 무엇을 우선할지 결정하세요.</span></div><div className="v3-choice-list">{currentCase.firstChoices.map((choice) => <button type="button" key={choice.id} className={`v3-decision-card ${currentDraft.firstChoice === choice.id ? 'selected' : ''}`} onClick={() => patchCase(currentCase.id, { firstChoice: choice.id, secondChoice: '' })}><span className="v3-choice-letter">{choice.id}</span><strong>{choice.label}</strong><p>{choice.rationale}</p></button>)}</div></section> : null}

      {state.currentStep === 'consequence' ? <section className="v3-hero v4-consequence"><p className="v3-eyebrow">SCENE 4 · 선택 이후 + 새 정보</p><h1>내 선택이 만든 다음 장면을 봅니다.</h1>{selectedFirstChoice ? <div className="v3-choice-analysis"><article><span>이 선택의 힘</span><p>{selectedFirstChoice.benefit}</p></article><article><span>놓칠 수 있는 비용</span><p>{selectedFirstChoice.cost}</p></article></div> : null}<div className="v3-story emphasis"><p>{choiceResult}</p></div><div className="v4-new-info"><span>NEW INFO</span><p>{newInfo}</p></div><p className="v3-reflection">처음 선택이 틀렸다는 뜻은 아닙니다. 정보가 달라졌을 때 결정을 유지할지 바꿀지가 다음 판단입니다.</p></section> : null}

      {state.currentStep === 'secondDecision' ? <section className="v3-card"><p className="v3-eyebrow">SCENE 5 · 다시 결정하기</p><h1>{currentCase.secondQuestion}</h1><p className="v3-muted">새 정보를 반영해, 실제로 운영할 방식 하나를 고르세요.</p><div className="v3-choice-list">{currentCase.secondChoices.map((choice) => <button type="button" key={choice.id} className={`v3-choice block ${currentDraft.secondChoice === choice.id ? 'selected' : ''}`} onClick={() => patchCase(currentCase.id, { secondChoice: choice.id })}><strong>{choice.label}</strong><small>{choice.description}</small></button>)}</div></section> : null}

      {state.currentStep === 'discussion' ? <section className="v3-card v4-discussion"><p className="v3-eyebrow">SCENE 6 · PAIR / TRIO TALK · 약 4분</p><h1>{currentExperience.discussionTitle}</h1><p className="v3-muted">{currentExperience.discussionInstruction}</p><div className="v4-my-decisions"><article><span>내 첫 선택</span><p>{selectedFirstChoice?.label ?? '—'}</p></article><article><span>새 정보 후</span><p>{selectedSecondChoice?.label ?? '—'}</p></article></div><div className="v3-discussion-list">{currentExperience.discussionPrompts.map((prompt, index) => <article key={prompt}><span>{index + 1}</span><p>{prompt}</p></article>)}</div><label className="v3-field"><span>우리 조가 합의한 행동 기준 한 줄 <small>(선택)</small></span><textarea rows={2} value={currentDraft.discussionNote} onChange={(event) => patchCase(currentCase.id, { discussionNote: event.target.value })} placeholder="예: 마감이 급해도 답만 주지 말고 다음부터 쓸 결정 기준 하나는 남긴다." /></label></section> : null}

      {state.currentStep === 'theoryBridge' ? <section className="v3-card v3-theory-card v4-theory-practice"><p className="v3-eyebrow">SCENE 7 · 이론으로 해석하고 현장 도구 만들기</p><h1>{currentCase.theory.nameKo}<br /><small>{currentCase.theory.nameEn}</small></h1><p className="v3-theory-one-line">{currentCase.theory.oneLine}</p><div className="v3-theory-grid"><article><span>이 장면에서 보인 것</span><p>{currentCase.theory.sceneSignal}</p></article><article><span>과장이 할 일</span><p>{currentCase.theory.leaderMove}</p></article></div><div className="v4-tool-head"><span>MY FIELD TOOL</span><h2>{currentCase.practiceTitle}</h2><p>{currentCase.practiceDescription}</p></div><div className="v3-form-stack">{currentCase.practiceFields.map((field) => <label className="v3-field" key={field.id}><span>{field.label}</span><small>{field.helper}</small><textarea rows={3} value={currentDraft.practiceAnswers[field.id] ?? ''} onChange={(event) => patchCase(currentCase.id, { practiceAnswers: { ...currentDraft.practiceAnswers, [field.id]: event.target.value } })} placeholder={field.placeholder} /></label>)}</div>{currentCase.aiMode !== 'none' ? <article className="v3-ai-card"><p className="v3-eyebrow">AI는 두 번째 의견입니다</p><h3>{currentCase.aiUseLabel}</h3><p>먼저 내 초안을 완성한 뒤 사용합니다. AI가 리더의 첫 판단을 대신하지 않습니다.</p><button type="button" className="v3-btn secondary wide" onClick={copyAiPrompt} disabled={!canContinue()}>내 초안을 포함한 AI 검토 프롬프트 복사</button>{copyStatus === 'success' ? <small className="v3-success">복사했습니다. 외부 AI에서 검토한 뒤 내 초안과 비교해보세요.</small> : null}{copyStatus === 'fail' ? <small className="v3-error">복사하지 못했습니다. 브라우저 권한을 확인해 주세요.</small> : null}</article> : <article className="v3-no-ai"><strong>이 Case에서는 AI를 사용하지 않습니다.</strong><p>이 장면은 리더 자신의 관찰과 판단으로 끝까지 설계합니다.</p></article>}</section> : null}

      {state.currentStep === 'result' ? <section className="v3-card v3-result-card v4-action-guide"><p className="v3-eyebrow">SCENE 8 · CASE {currentCase.id} ACTION GUIDE</p><h1>이런 상황에서는 이렇게 행동할 수 있습니다.</h1><p className="v3-muted">하나의 정답은 아닙니다. 상황 조건에 따라 행동을 달리할 수 있도록 기준을 남깁니다.</p><div className="v4-condition-grid">{currentExperience.actionGuide.map((guide, index) => <article key={guide.condition}><span>{index + 1}</span><div><strong>{guide.condition}</strong><p>{guide.action}</p></div></article>)}</div><div className="v4-talk-box"><span>현장에서 이렇게 말해볼 수 있습니다</span><p>“{currentExperience.sampleTalk.replace(/^“|”$/g, '')}”</p></div><div className="v4-avoid-box"><span>피해야 할 접근</span><p>{currentExperience.avoid}</p></div>{practiceSummary.length > 0 ? <div className="v4-my-tool"><span>내가 만든 현장 도구</span>{practiceSummary.map((entry) => <p key={entry.label}><b>{entry.label}</b><br />{entry.value}</p>)}</div> : null}<div className="v3-result-block subtle"><span>이 장면을 설명하는 렌즈</span><p>{currentCase.theory.nameKo} · {currentCase.theory.nameEn}</p></div><button type="button" className="v3-btn primary wide" onClick={completeCase}>{currentDraft.completedAt ? '확인하고 CASE MAP으로' : 'CASE 완료 저장하고 MAP으로'}</button></section> : null}

      <Nav hideNext={state.currentStep === 'result'} />
    </main>
  );
}
