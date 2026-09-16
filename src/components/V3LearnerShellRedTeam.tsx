import { useEffect, useMemo, useState } from 'react';
import { kacCiLogoDataUrl } from '../assets/kacCiLogo';
import { copyTextToClipboard } from '../lib/clipboard';
import { v3CaseById, v3Cases, v3SessionGroups } from '../v3/cases';
import { redTeamSignalOptions } from '../v3/redTeamSignalOptions';
import { emptyCaseDraft, exportV3Backup, initialV3State, loadV3State, resetV3State, saveV3State } from '../v3/storage';
import type { V3CaseDraft, V3CaseId, V3LocalState, V3StepId } from '../v3/types';

const caseSteps: V3StepId[] = [
  'situation',
  'signals',
  'firstDecision',
  'consequence',
  'newInfo',
  'secondDecision',
  'theoryBridge',
  'practice',
  'discussion',
  'result',
];

const moreActions = [
  '답을 주기 전에 후배의 판단 근거를 먼저 듣는다.',
  '성격이 아니라 관찰한 행동과 다음 행동으로 피드백한다.',
  '실패 후 역할을 빼기보다 작은 재도전을 설계한다.',
  'AI 결과에서 사람이 확인·결정할 지점을 분명히 한다.',
  '위임할 때 결정권과 에스컬레이션 기준을 함께 정한다.',
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

function getPracticeSummary(caseId: V3CaseId, draft: V3CaseDraft) {
  return v3CaseById[caseId].practiceFields
    .map((field) => ({ label: field.label, value: draft.practiceAnswers[field.id] ?? '' }))
    .filter((entry) => entry.value.trim().length > 0);
}

export function V3LearnerShellRedTeam() {
  const [state, setState] = useState<V3LocalState>(() => loadV3State());
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const currentCase = state.currentCaseId ? v3CaseById[state.currentCaseId] : null;
  const currentDraft = state.currentCaseId ? getCaseDraft(state, state.currentCaseId) : null;
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
      const validSignals = current.selectedSignals
        .filter((signal) => redTeamSignalOptions[caseId].includes(signal))
        .slice(0, 2);
      const targetStep = current.completedAt ? 'result' : (current.lastStep && caseSteps.includes(current.lastStep) ? current.lastStep : 'situation');
      return {
        ...prev,
        currentCaseId: caseId,
        currentStep: targetStep,
        cases: {
          ...prev.cases,
          [caseId]: { ...current, selectedSignals: validSignals, lastStep: targetStep },
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

  function toggleSignal(signal: string) {
    if (!state.currentCaseId || !currentDraft) return;
    const exists = currentDraft.selectedSignals.includes(signal);
    const next = exists
      ? currentDraft.selectedSignals.filter((item) => item !== signal)
      : currentDraft.selectedSignals.length < 2
        ? [...currentDraft.selectedSignals, signal]
        : currentDraft.selectedSignals;
    patchCase(state.currentCaseId, { selectedSignals: next });
  }

  function canContinue() {
    if (state.currentStep === 'intro') return state.profile.teamName.trim().length > 0 && state.profile.nickname.trim().length > 0;
    if (!currentCase || !currentDraft) return true;
    if (state.currentStep === 'signals') return currentDraft.selectedSignals.length === 2;
    if (state.currentStep === 'firstDecision') return currentDraft.firstChoice !== '';
    if (state.currentStep === 'secondDecision') return currentDraft.secondChoice !== '';
    if (state.currentStep === 'practice') return currentCase.practiceFields.every((field) => (currentDraft.practiceAnswers[field.id] ?? '').trim().length > 0);
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
    if (!window.confirm('이 기기에 저장된 v3 실습 내용과 완료 기록을 모두 지울까요?')) return;
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
      <header className="v3-header">
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
      <main className="v3-screen v3-intro">
        <section className="v3-brand-card">
          <img src={kacCiLogoDataUrl} alt="한국공항공사 CI" />
          <p>Bridge AI Leadership Journey · v3.2</p>
          <h1>후배를 키우는 과장의<br />현실적인 선택을 연습합니다.</h1>
          <p className="v3-muted">사람을 평가하는 문제가 아닙니다. 실제 상황에서 무엇을 보고, 어떤 말을 하고, 어디까지 맡길지를 연습합니다.</p>
        </section>
        <section className="v3-card">
          <h2>교육장에서 사용할 정보</h2>
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
      <main className="v3-screen">
        <Header />
        <section className="v3-hero compact">
          <p className="v3-eyebrow">나의 학습 여정</p>
          <h1>6개의 서로 다른 리더십 딜레마를 다룹니다.</h1>
          <p>READ에서 후배를 읽고, DEVELOP에서 성장 경험을 설계하고, BRIDGE에서 개인과 팀의 책임을 연결합니다.</p>
          <div className="v3-progress"><span style={{ width: `${(completedCount / 6) * 100}%` }} /></div>
          <small>{completedCount}개 완료 · Case별 진행 위치와 작성 내용이 자동 저장됩니다.</small>
        </section>
        {v3SessionGroups.map((group) => (
          <section key={group.id} className="v3-section-block">
            <div className="v3-section-title"><h2>{group.title}</h2><p>{group.subtitle}</p></div>
            <div className="v3-case-list">
              {group.caseIds.map((caseId) => {
                const item = v3CaseById[caseId];
                const draft = state.cases[caseId];
                const done = Boolean(draft?.completedAt);
                const started = Boolean(draft && draft.lastStep && draft.lastStep !== 'situation');
                return (
                  <button type="button" key={caseId} className={`v3-case-card ${done ? 'done' : ''}`} onClick={() => startCase(caseId)}>
                    <span className="v3-case-id">CASE {caseId}</span>
                    <strong>{item.title}</strong>
                    <p>{item.hook}</p>
                    <small>{done ? '완료 · 결과 다시 보기' : started ? '작성 중 · 저장한 위치에서 이어서 하기' : '시작하기'}</small>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
        <section className={`v3-card v3-playbook-callout ${completed ? 'ready' : ''}`}>
          <p className="v3-eyebrow">FINAL</p><h2>나의 Bridge Leader Playbook</h2>
          <p>{completed ? '6개 Case의 선택을 돌아보고 다음 2주에 실제로 바꿀 행동 하나를 정합니다.' : `6개 Case를 모두 마치면 열립니다. 지금 ${6 - completedCount}개 남았습니다.`}</p>
          <button type="button" className="v3-btn primary wide" disabled={!completed} onClick={() => navigate('playbook')}>종합 정리하기</button>
        </section>
        <div className="v3-utility-row"><button type="button" className="v3-btn secondary" onClick={() => exportV3Backup(state)}>내 결과 백업</button><button type="button" className="v3-btn danger" onClick={resetAll}>전체 초기화</button></div>
      </main>
    );
  }

  function Playbook() {
    const completed = allCasesCompleted(state);
    const journeyRows = v3Cases.map((item) => {
      const draft = state.cases[item.id];
      const first = item.firstChoices.find((choice) => choice.id === draft?.firstChoice)?.label ?? '—';
      const second = item.secondChoices.find((choice) => choice.id === draft?.secondChoice)?.label ?? '—';
      return { item, first, second };
    });
    return (
      <main className="v3-screen">
        <Header />
        <section className="v3-hero compact"><p className="v3-eyebrow">FINAL · Bridge Leader Playbook</p><h1>6개의 답을 1개의 행동으로 줄입니다.</h1><p>먼저 내가 실제로 어떤 선택을 했는지 돌아본 뒤, MORE · LESS · NEXT 2 WEEKS를 정합니다.</p></section>
        {!completed ? <section className="v3-card"><p>아직 완료하지 않은 Case가 있습니다.</p><button className="v3-btn primary wide" onClick={goCaseMap}>CASE MAP으로</button></section> : (
          <>
            <section className="v3-card"><p className="v3-eyebrow">MY DECISIONS</p><h2>내가 6개 장면에서 한 선택</h2><div className="v3-journey-list">{journeyRows.map(({ item, first, second }) => <article key={item.id}><span>CASE {item.id}</span><strong>{item.title}</strong><p><b>처음</b> {first}</p><p><b>새 정보 후</b> {second}</p></article>)}</div></section>
            <section className="v3-card"><p className="v3-label">앞으로 더 할 행동 1개</p><div className="v3-choice-list compact-list">{moreActions.map((action) => <button type="button" key={action} className={`v3-choice ${state.playbook.moreAction === action ? 'selected' : ''}`} onClick={() => patchState({ playbook: { ...state.playbook, moreAction: action, savedAt: undefined } })}>{action}</button>)}</div></section>
            <section className="v3-card"><p className="v3-label">앞으로 줄일 행동 1개</p><div className="v3-choice-list compact-list">{lessActions.map((action) => <button type="button" key={action} className={`v3-choice ${state.playbook.lessAction === action ? 'selected' : ''}`} onClick={() => patchState({ playbook: { ...state.playbook, lessAction: action, savedAt: undefined } })}>{action}</button>)}</div></section>
            <section className="v3-card"><label className="v3-field"><span>다음 2주 동안 실제 후배 한 명에게 할 행동</span><textarea rows={4} value={state.playbook.twoWeekAction} onChange={(event) => patchState({ playbook: { ...state.playbook, twoWeekAction: event.target.value, savedAt: undefined } })} placeholder="언제, 어떤 후배에게, 내가 무엇을 다르게 할지 한 문장으로 적어보세요." /></label><button type="button" className="v3-btn primary wide" disabled={!state.playbook.moreAction || !state.playbook.lessAction || !state.playbook.twoWeekAction.trim()} onClick={savePlaybook}>{state.playbook.savedAt ? 'Playbook 저장 완료' : '나의 Playbook 저장하기'}</button>{state.playbook.savedAt ? <p className="v3-success">이 기기에 저장했습니다.</p> : null}</section>
            <section className="v3-card v3-summary-card"><h2>나의 Bridge Leader Playbook</h2><p><strong>MORE</strong><br />{state.playbook.moreAction || '—'}</p><p><strong>LESS</strong><br />{state.playbook.lessAction || '—'}</p><p><strong>NEXT 2 WEEKS</strong><br />{state.playbook.twoWeekAction || '—'}</p><div className="v3-utility-row"><button type="button" className="v3-btn secondary" onClick={() => exportV3Backup(state)}>결과 백업</button><button type="button" className="v3-btn primary" onClick={goCaseMap}>CASE MAP</button></div></section>
          </>
        )}
      </main>
    );
  }

  if (state.currentStep === 'intro') return Intro();
  if (state.currentStep === 'caseMap' || (!currentCase && state.currentStep !== 'playbook')) return CaseMap();
  if (state.currentStep === 'playbook') return Playbook();
  if (!currentCase || !currentDraft) return CaseMap();

  const selectedFirstChoice = currentCase.firstChoices.find((choice) => choice.id === currentDraft.firstChoice);
  const choiceResult = currentDraft.firstChoice ? currentCase.consequenceByChoice[currentDraft.firstChoice] : '';
  const newInfo = currentDraft.firstChoice ? currentCase.newInfoByChoice[currentDraft.firstChoice] : '';
  const practiceSummary = getPracticeSummary(currentCase.id, currentDraft);
  const signals = redTeamSignalOptions[currentCase.id];

  return (
    <main className="v3-screen">
      <Header />
      <div className="v3-case-progress"><span>{caseSteps.indexOf(state.currentStep) + 1}</span><div><i style={{ width: `${((caseSteps.indexOf(state.currentStep) + 1) / caseSteps.length) * 100}%` }} /></div><span>{caseSteps.length}</span></div>

      {state.currentStep === 'situation' ? <section className="v3-hero"><p className="v3-eyebrow">CASE {currentCase.id} · 지금 벌어진 일</p><h1>{currentCase.title}</h1><p className="v3-dilemma">{currentCase.leadershipDilemma}</p><div className="v3-story">{currentCase.situation.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line || <br />}</p>)}</div></section> : null}

      {state.currentStep === 'signals' ? <section className="v3-card"><p className="v3-eyebrow">STEP 2 · 무엇을 먼저 볼 것인가</p><h1>{currentCase.signalQuestion}</h1><p className="v3-muted">다섯 가지 모두 볼 가치가 있습니다. 다만 지금 리더의 첫 대응을 정할 때 가장 중요한 2개만 먼저 고르세요.</p><div className="v3-choice-list">{signals.map((signal) => <button type="button" key={signal} className={`v3-choice ${currentDraft.selectedSignals.includes(signal) ? 'selected' : ''}`} onClick={() => toggleSignal(signal)}><span>{currentDraft.selectedSignals.includes(signal) ? '✓' : ''}</span>{signal}</button>)}</div><p className="v3-counter">{currentDraft.selectedSignals.length}/2 선택</p></section> : null}

      {state.currentStep === 'firstDecision' ? <section className="v3-card"><p className="v3-eyebrow">STEP 3 · 첫 대응</p><h1>{currentCase.firstQuestion}</h1><p className="v3-muted">장단점은 선택한 뒤 확인합니다. 지금 이 순간 실제로 할 법한 대응 하나를 고르세요.</p><div className="v3-choice-list">{currentCase.firstChoices.map((choice) => <button type="button" key={choice.id} className={`v3-decision-card ${currentDraft.firstChoice === choice.id ? 'selected' : ''}`} onClick={() => patchCase(currentCase.id, { firstChoice: choice.id, secondChoice: '' })}><span className="v3-choice-letter">{choice.id}</span><strong>{choice.label}</strong><p>{choice.rationale}</p></button>)}</div></section> : null}

      {state.currentStep === 'consequence' ? <section className="v3-hero"><p className="v3-eyebrow">STEP 4 · 내 선택이 만든 다음 장면</p><h1>선택에는 효과와 비용이 함께 있습니다.</h1>{selectedFirstChoice ? <div className="v3-choice-analysis"><article><span>이 선택의 힘</span><p>{selectedFirstChoice.benefit}</p></article><article><span>놓칠 수 있는 비용</span><p>{selectedFirstChoice.cost}</p></article></div> : null}<div className="v3-story emphasis"><p>{choiceResult}</p></div><p className="v3-reflection">방금 선택이 틀렸다는 뜻은 아닙니다. 지금 얻은 것과 남은 부담을 함께 봅니다.</p></section> : null}

      {state.currentStep === 'newInfo' ? <section className="v3-hero"><p className="v3-eyebrow">STEP 5 · 새로 들어온 정보</p><h1>처음에는 없던 조건이 하나 더 생겼습니다.</h1><div className="v3-story pressure"><p>{newInfo}</p></div><p className="v3-reflection">새 정보가 들어오면 좋은 리더도 처음 결정을 바꿀 수 있습니다.</p></section> : null}

      {state.currentStep === 'secondDecision' ? <section className="v3-card"><p className="v3-eyebrow">STEP 6 · 다시 결정하기</p><h1>{currentCase.secondQuestion}</h1><div className="v3-choice-list">{currentCase.secondChoices.map((choice) => <button type="button" key={choice.id} className={`v3-choice block ${currentDraft.secondChoice === choice.id ? 'selected' : ''}`} onClick={() => patchCase(currentCase.id, { secondChoice: choice.id })}><strong>{choice.label}</strong><small>{choice.description}</small></button>)}</div></section> : null}

      {state.currentStep === 'theoryBridge' ? <section className="v3-card v3-theory-card"><p className="v3-eyebrow">STEP 7 · 방금 장면을 설명하는 렌즈</p><h1>{currentCase.theory.nameKo}<br /><small>{currentCase.theory.nameEn}</small></h1><p className="v3-theory-one-line">{currentCase.theory.oneLine}</p><div className="v3-theory-grid"><article><span>이 장면에서 보인 것</span><p>{currentCase.theory.sceneSignal}</p></article><article><span>리더가 할 일</span><p>{currentCase.theory.leaderMove}</p></article><article><span>개념 연결</span><p>{currentCase.theory.quizConnection}</p></article></div></section> : null}

      {state.currentStep === 'practice' ? <section className="v3-card"><p className="v3-eyebrow">STEP 8 · 현장에서 쓸 것을 남기기</p><h1>{currentCase.practiceTitle}</h1><p className="v3-muted">{currentCase.practiceDescription}</p><div className="v3-form-stack">{currentCase.practiceFields.map((field) => <label className="v3-field" key={field.id}><span>{field.label}</span><small>{field.helper}</small><textarea rows={3} value={currentDraft.practiceAnswers[field.id] ?? ''} onChange={(event) => patchCase(currentCase.id, { practiceAnswers: { ...currentDraft.practiceAnswers, [field.id]: event.target.value } })} placeholder={field.placeholder} /></label>)}</div>{currentCase.aiMode !== 'none' ? <article className="v3-ai-card"><p className="v3-eyebrow">AI는 두 번째 의견입니다</p><h3>{currentCase.aiUseLabel}</h3><p>먼저 내 초안을 완성한 뒤 사용합니다. AI가 처음부터 리더의 판단을 대신하지 않습니다.</p><button type="button" className="v3-btn secondary wide" onClick={copyAiPrompt} disabled={!canContinue()}>내 초안을 포함한 AI 검토 프롬프트 복사</button>{copyStatus === 'success' ? <small className="v3-success">복사했습니다. 외부 AI에서 검토한 뒤 내 초안과 비교해보세요.</small> : null}{copyStatus === 'fail' ? <small className="v3-error">복사하지 못했습니다. 브라우저 권한을 확인해 주세요.</small> : null}</article> : <article className="v3-no-ai"><strong>이 Case에서는 AI를 사용하지 않습니다.</strong><p>이 장면은 리더 자신의 관찰과 판단으로 끝까지 설계해봅니다.</p></article>}</section> : null}

      {state.currentStep === 'discussion' ? <section className="v3-card"><p className="v3-eyebrow">STEP 9 · 팀 토의 PAUSE</p><h1>내 답을 설명하지 말고, 서로 다른 답의 이유를 비교해보세요.</h1><div className="v3-discussion-list">{currentCase.discussionPrompts.map((prompt, index) => <article key={prompt}><span>{index + 1}</span><p>{prompt}</p></article>)}</div><label className="v3-field"><span>팀에서 가장 의견이 갈린 한 가지 <small>(선택)</small></span><textarea rows={2} value={currentDraft.discussionNote} onChange={(event) => patchCase(currentCase.id, { discussionNote: event.target.value })} placeholder="무엇이 달라서 선택이 갈렸는지 한 줄로 적어보세요." /></label></section> : null}

      {state.currentStep === 'result' ? <section className="v3-card v3-result-card"><p className="v3-eyebrow">STEP 10 · CASE {currentCase.id} TAKE-AWAY</p><h1>{currentCase.takeaway}</h1><div className="v3-result-block"><span>처음 선택</span><p>{selectedFirstChoice?.label ?? '—'}</p></div><div className="v3-result-block"><span>새 정보 후 다시 한 결정</span><p>{currentCase.secondChoices.find((choice) => choice.id === currentDraft.secondChoice)?.label ?? '—'}</p></div>{practiceSummary.map((entry) => <div className="v3-result-block" key={entry.label}><span>{entry.label}</span><p>{entry.value}</p></div>)}<div className="v3-result-block subtle"><span>이 장면을 설명하는 렌즈</span><p>{currentCase.theory.nameKo} · {currentCase.theory.nameEn}</p></div><button type="button" className="v3-btn primary wide" onClick={completeCase}>{currentDraft.completedAt ? '확인하고 CASE MAP으로' : 'CASE 완료 저장하고 MAP으로'}</button></section> : null}

      <Nav hideNext={state.currentStep === 'result'} />
    </main>
  );
}
