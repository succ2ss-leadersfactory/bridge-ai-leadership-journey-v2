import { useEffect, useMemo, useState } from 'react';
import { kacCiLogoDataUrl } from '../assets/kacCiLogo';
import { copyTextToClipboard } from '../lib/clipboard';
import { v3CaseById, v3Cases, v3SessionGroups } from '../v3/cases';
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
  '후배를 소극적·꼼꼼하지 않음·개인주의처럼 성격으로 단정한다.',
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
  const item = v3CaseById[caseId];
  return item.practiceFields
    .map((field) => ({ label: field.label, value: draft.practiceAnswers[field.id] ?? '' }))
    .filter((entry) => entry.value.trim().length > 0);
}

export function V3LearnerShell() {
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

  function goTo(step: V3StepId) {
    patchState({ currentStep: step });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startCase(caseId: V3CaseId) {
    setCopyStatus('idle');
    setState((prev) => ({
      ...prev,
      currentCaseId: caseId,
      currentStep: 'situation',
      cases: { ...prev.cases, [caseId]: prev.cases[caseId] ?? emptyCaseDraft() },
      updatedAt: new Date().toISOString(),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goCaseMap() {
    setCopyStatus('idle');
    patchState({ currentStep: 'caseMap', currentCaseId: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBackCaseStep() {
    if (!currentCase) return;
    const index = caseSteps.indexOf(state.currentStep);
    if (index <= 0) {
      goCaseMap();
      return;
    }
    goTo(caseSteps[index - 1]);
  }

  function goNextCaseStep() {
    const index = caseSteps.indexOf(state.currentStep);
    if (index < 0 || index >= caseSteps.length - 1) return;
    goTo(caseSteps[index + 1]);
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
    if (state.currentStep === 'practice') {
      return currentCase.practiceFields.every((field) => (currentDraft.practiceAnswers[field.id] ?? '').trim().length > 0);
    }
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
    patchCase(state.currentCaseId, { completedAt: new Date().toISOString() });
    setTimeout(() => {
      setState((prev) => ({ ...prev, currentCaseId: null, currentStep: 'caseMap', updatedAt: new Date().toISOString() }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
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
    setState((prev) => ({
      ...prev,
      playbook: { ...prev.playbook, savedAt: new Date().toISOString() },
      updatedAt: new Date().toISOString(),
    }));
  }

  function Header() {
    const title = currentCase ? `CASE ${currentCase.id} · ${currentCase.session}` : 'Bridge AI Leadership Journey';
    return (
      <header className="v3-header">
        <div>
          <p className="v3-header-kicker">한국공항공사 · 과장급 Bridge Leader Lab</p>
          <strong>{title}</strong>
        </div>
        <span>{completedCount}/6</span>
      </header>
    );
  }

  function Nav({ nextLabel = '다음', hideNext = false }: { nextLabel?: string; hideNext?: boolean }) {
    return (
      <nav className="v3-bottom-nav">
        <button type="button" className="v3-btn secondary" onClick={goBackCaseStep}>이전</button>
        <button type="button" className="v3-btn ghost" onClick={goCaseMap}>CASE MAP</button>
        {!hideNext ? <button type="button" className="v3-btn primary" onClick={goNextCaseStep} disabled={!canContinue()}>{nextLabel}</button> : <span />}
      </nav>
    );
  }

  function Intro() {
    const teamOptions = Array.from({ length: 8 }, (_, index) => `${index + 1}팀`);
    return (
      <main className="v3-screen v3-intro">
        <section className="v3-brand-card">
          <img src={kacCiLogoDataUrl} alt="한국공항공사 CI" />
          <p>Bridge AI Leadership Journey · v3</p>
          <h1>후배를 키우는 과장의<br />현실적인 선택을 연습합니다.</h1>
          <p className="v3-muted">정답을 맞히는 과정이 아닙니다. 실제 현장에서 할 법한 선택을 하고, 그 선택의 효과와 비용을 본 뒤 다시 결정합니다.</p>
        </section>

        <section className="v3-card">
          <h2>교육장에서 사용할 정보</h2>
          <p className="v3-muted">입력 내용은 이 기기의 브라우저에만 저장됩니다. 실제 직원 이름이나 민감정보는 입력하지 않습니다.</p>
          <p className="v3-label">우리 팀</p>
          <div className="v3-chip-grid">
            {teamOptions.map((team) => <button type="button" key={team} className={`v3-chip ${state.profile.teamName === team ? 'selected' : ''}`} onClick={() => patchState({ profile: { ...state.profile, teamName: team } })}>{team}</button>)}
          </div>
          <label className="v3-field">
            <span>이름/닉네임</span>
            <input value={state.profile.nickname} onChange={(event) => patchState({ profile: { ...state.profile, nickname: event.target.value } })} placeholder="예: 김과장" />
          </label>
          <button type="button" className="v3-btn primary wide" disabled={!canContinue()} onClick={() => goTo('caseMap')}>CASE MAP 보기</button>
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
          <p>같은 질문을 반복하지 않습니다. 각 Case마다 과장급 브릿지 리더가 실제로 해야 하는 역할과 산출물이 다릅니다.</p>
          <div className="v3-progress"><span style={{ width: `${(completedCount / 6) * 100}%` }} /></div>
          <small>{completedCount}개 완료 · 진행 내용은 자동으로 이 기기에 저장됩니다.</small>
        </section>

        {v3SessionGroups.map((group) => (
          <section key={group.id} className="v3-section-block">
            <div className="v3-section-title"><h2>{group.title}</h2><p>{group.subtitle}</p></div>
            <div className="v3-case-list">
              {group.caseIds.map((caseId) => {
                const item = v3CaseById[caseId];
                const caseDraft = state.cases[caseId];
                const done = Boolean(caseDraft?.completedAt);
                const started = Boolean(caseDraft && (caseDraft.firstChoice || caseDraft.selectedSignals.length));
                return (
                  <button type="button" key={caseId} className={`v3-case-card ${done ? 'done' : ''}`} onClick={() => startCase(caseId)}>
                    <span className="v3-case-id">CASE {caseId}</span>
                    <strong>{item.title}</strong>
                    <p>{item.hook}</p>
                    <small>{done ? '완료 · 다시 보기 가능' : started ? '작성 중 · 이어서 하기' : '시작하기'}</small>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <section className={`v3-card v3-playbook-callout ${completed ? 'ready' : ''}`}>
          <p className="v3-eyebrow">FINAL</p>
          <h2>나의 Bridge Leader Playbook</h2>
          <p>{completed ? '6개 Case에서 한 선택을 하나의 현장 행동으로 정리합니다.' : `6개 Case를 모두 마치면 열립니다. 지금 ${6 - completedCount}개 남았습니다.`}</p>
          <button type="button" className="v3-btn primary wide" disabled={!completed} onClick={() => goTo('playbook')}>종합 정리하기</button>
        </section>

        <div className="v3-utility-row">
          <button type="button" className="v3-btn secondary" onClick={() => exportV3Backup(state)}>내 결과 백업</button>
          <button type="button" className="v3-btn danger" onClick={resetAll}>전체 초기화</button>
        </div>
      </main>
    );
  }

  if (state.currentStep === 'intro') return <Intro />;
  if (state.currentStep === 'caseMap' || (!currentCase && state.currentStep !== 'playbook')) return <CaseMap />;

  if (state.currentStep === 'playbook') {
    const completed = allCasesCompleted(state);
    return (
      <main className="v3-screen">
        <Header />
        <section className="v3-hero compact">
          <p className="v3-eyebrow">FINAL · Bridge Leader Playbook</p>
          <h1>6개의 답을 1개의 행동으로 줄입니다.</h1>
          <p>실행계획 6개를 만들지 않습니다. 앞으로 더 할 행동 하나, 줄일 행동 하나, 다음 2주에 실제 후배에게 적용할 행동 하나만 남깁니다.</p>
        </section>
        {!completed ? <section className="v3-card"><p>아직 완료하지 않은 Case가 있습니다.</p><button className="v3-btn primary wide" onClick={goCaseMap}>CASE MAP으로</button></section> : (
          <>
            <section className="v3-card">
              <p className="v3-label">앞으로 더 할 행동 1개</p>
              <div className="v3-choice-list compact-list">{moreActions.map((action) => <button type="button" key={action} className={`v3-choice ${state.playbook.moreAction === action ? 'selected' : ''}`} onClick={() => patchState({ playbook: { ...state.playbook, moreAction: action, savedAt: undefined } })}>{action}</button>)}</div>
            </section>
            <section className="v3-card">
              <p className="v3-label">앞으로 줄일 행동 1개</p>
              <div className="v3-choice-list compact-list">{lessActions.map((action) => <button type="button" key={action} className={`v3-choice ${state.playbook.lessAction === action ? 'selected' : ''}`} onClick={() => patchState({ playbook: { ...state.playbook, lessAction: action, savedAt: undefined } })}>{action}</button>)}</div>
            </section>
            <section className="v3-card">
              <label className="v3-field"><span>다음 2주 동안 실제 후배 한 명에게 할 행동</span><textarea rows={4} value={state.playbook.twoWeekAction} onChange={(event) => patchState({ playbook: { ...state.playbook, twoWeekAction: event.target.value, savedAt: undefined } })} placeholder="예: 다음 주 운영자료를 맡길 때 제가 답을 주기 전에 먼저 본인의 판단 기준 두 가지를 말하게 하고, 혼자 결정할 범위와 반드시 확인할 조건을 함께 정한다." /></label>
              <button type="button" className="v3-btn primary wide" disabled={!state.playbook.moreAction || !state.playbook.lessAction || !state.playbook.twoWeekAction.trim()} onClick={savePlaybook}>{state.playbook.savedAt ? 'Playbook 저장 완료' : '나의 Playbook 저장하기'}</button>
              {state.playbook.savedAt ? <p className="v3-success">이 기기에 저장했습니다.</p> : null}
            </section>
            <section className="v3-card v3-summary-card">
              <h2>나의 Bridge Leader Playbook</h2>
              <p><strong>MORE</strong><br />{state.playbook.moreAction || '—'}</p>
              <p><strong>LESS</strong><br />{state.playbook.lessAction || '—'}</p>
              <p><strong>NEXT 2 WEEKS</strong><br />{state.playbook.twoWeekAction || '—'}</p>
              <div className="v3-utility-row"><button type="button" className="v3-btn secondary" onClick={() => exportV3Backup(state)}>결과 백업</button><button type="button" className="v3-btn primary" onClick={goCaseMap}>CASE MAP</button></div>
            </section>
          </>
        )}
      </main>
    );
  }

  if (!currentCase || !currentDraft) return <CaseMap />;

  const choiceResult = currentDraft.firstChoice ? currentCase.consequenceByChoice[currentDraft.firstChoice] : '';
  const newInfo = currentDraft.firstChoice ? currentCase.newInfoByChoice[currentDraft.firstChoice] : '';
  const practiceSummary = getPracticeSummary(currentCase.id, currentDraft);

  return (
    <main className="v3-screen">
      <Header />
      <div className="v3-case-progress"><span>{caseSteps.indexOf(state.currentStep) + 1}</span><div><i style={{ width: `${((caseSteps.indexOf(state.currentStep) + 1) / caseSteps.length) * 100}%` }} /></div><span>{caseSteps.length}</span></div>

      {state.currentStep === 'situation' ? (
        <section className="v3-hero">
          <p className="v3-eyebrow">CASE {currentCase.id} · 지금 벌어진 일</p>
          <h1>{currentCase.title}</h1>
          <p className="v3-dilemma">{currentCase.leadershipDilemma}</p>
          <div className="v3-story">{currentCase.situation.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line || <br />}</p>)}</div>
        </section>
      ) : null}

      {state.currentStep === 'signals' ? (
        <section className="v3-card">
          <p className="v3-eyebrow">STEP 2 · 사람을 단정하기 전에</p>
          <h1>{currentCase.signalQuestion}</h1>
          <p className="v3-muted">정답 찾기가 아닙니다. 지금 판단에 가장 중요한 신호 2개만 고르세요.</p>
          <div className="v3-choice-list">{currentCase.signalOptions.map((signal) => <button type="button" key={signal} className={`v3-choice ${currentDraft.selectedSignals.includes(signal) ? 'selected' : ''}`} onClick={() => toggleSignal(signal)}><span>{currentDraft.selectedSignals.includes(signal) ? '✓' : ''}</span>{signal}</button>)}</div>
          <p className="v3-counter">{currentDraft.selectedSignals.length}/2 선택</p>
        </section>
      ) : null}

      {state.currentStep === 'firstDecision' ? (
        <section className="v3-card">
          <p className="v3-eyebrow">STEP 3 · 첫 대응</p>
          <h1>{currentCase.firstQuestion}</h1>
          <p className="v3-muted">세 선택 모두 현실적인 이유가 있습니다. “교육적으로 좋아 보이는 답”보다 실제 내가 할 선택을 고르세요.</p>
          <div className="v3-choice-list">{currentCase.firstChoices.map((choice) => <button type="button" key={choice.id} className={`v3-decision-card ${currentDraft.firstChoice === choice.id ? 'selected' : ''}`} onClick={() => patchCase(currentCase.id, { firstChoice: choice.id, secondChoice: '' })}><span className="v3-choice-letter">{choice.id}</span><strong>{choice.label}</strong><p>{choice.rationale}</p><div><small><b>좋은 점</b> {choice.benefit}</small><small><b>비용</b> {choice.cost}</small></div></button>)}</div>
        </section>
      ) : null}

      {state.currentStep === 'consequence' ? (
        <section className="v3-hero">
          <p className="v3-eyebrow">STEP 4 · 내 선택이 만든 다음 장면</p>
          <h1>좋은 의도가 있어도 다른 비용이 남을 수 있습니다.</h1>
          <div className="v3-story emphasis"><p>{choiceResult}</p></div>
          <p className="v3-reflection">방금 선택이 틀렸다는 뜻이 아닙니다. 효과와 비용을 함께 보고 다음 판단을 준비합니다.</p>
        </section>
      ) : null}

      {state.currentStep === 'newInfo' ? (
        <section className="v3-hero">
          <p className="v3-eyebrow">STEP 5 · 새로 들어온 정보</p>
          <h1>처음에는 없던 조건이 하나 더 생겼습니다.</h1>
          <div className="v3-story pressure"><p>{newInfo}</p></div>
          <p className="v3-reflection">리더십 딜레마는 정보가 추가될 때 더 선명해집니다. 처음 선택을 지킬지 바꿀지는 이제 다시 결정합니다.</p>
        </section>
      ) : null}

      {state.currentStep === 'secondDecision' ? (
        <section className="v3-card">
          <p className="v3-eyebrow">STEP 6 · 다시 결정하기</p>
          <h1>{currentCase.secondQuestion}</h1>
          <div className="v3-choice-list">{currentCase.secondChoices.map((choice) => <button type="button" key={choice.id} className={`v3-choice block ${currentDraft.secondChoice === choice.id ? 'selected' : ''}`} onClick={() => patchCase(currentCase.id, { secondChoice: choice.id })}><strong>{choice.label}</strong><small>{choice.description}</small></button>)}</div>
        </section>
      ) : null}

      {state.currentStep === 'theoryBridge' ? (
        <section className="v3-card v3-theory-card">
          <p className="v3-eyebrow">STEP 7 · 방금 장면을 설명하는 렌즈</p>
          <h1>{currentCase.theory.nameKo}<br /><small>{currentCase.theory.nameEn}</small></h1>
          <p className="v3-theory-one-line">{currentCase.theory.oneLine}</p>
          <div className="v3-theory-grid"><article><span>이 장면에서 보인 신호</span><p>{currentCase.theory.sceneSignal}</p></article><article><span>브릿지 리더가 할 일</span><p>{currentCase.theory.leaderMove}</p></article><article><span>퀴즈·개념 연결</span><p>{currentCase.theory.quizConnection}</p></article></div>
          <p className="v3-muted">이론을 먼저 외우지 않습니다. 방금 내가 한 결정을 설명하고 다음 행동을 더 정확하게 만드는 언어로 사용합니다.</p>
        </section>
      ) : null}

      {state.currentStep === 'practice' ? (
        <section className="v3-card">
          <p className="v3-eyebrow">STEP 8 · 현장에서 쓸 것을 남기기</p>
          <h1>{currentCase.practiceTitle}</h1>
          <p className="v3-muted">{currentCase.practiceDescription}</p>
          <div className="v3-form-stack">{currentCase.practiceFields.map((field) => <label className="v3-field" key={field.id}><span>{field.label}</span><small>{field.helper}</small><textarea rows={4} value={currentDraft.practiceAnswers[field.id] ?? ''} onChange={(event) => patchCase(currentCase.id, { practiceAnswers: { ...currentDraft.practiceAnswers, [field.id]: event.target.value } })} placeholder={field.placeholder} /></label>)}</div>
          {currentCase.aiMode !== 'none' ? <article className="v3-ai-card"><p className="v3-eyebrow">AI는 두 번째 의견입니다</p><h3>{currentCase.aiUseLabel}</h3><p>먼저 내 초안을 작성한 뒤 사용하세요. AI에게 처음부터 답을 맡기지 않습니다.</p><button type="button" className="v3-btn secondary wide" onClick={copyAiPrompt} disabled={!canContinue()}>내 초안을 포함한 AI 검토 프롬프트 복사</button>{copyStatus === 'success' ? <small className="v3-success">복사했습니다. 외부 AI에 붙여넣어 비교할 수 있습니다.</small> : null}{copyStatus === 'fail' ? <small className="v3-error">복사하지 못했습니다. 브라우저 권한을 확인해 주세요.</small> : null}</article> : <article className="v3-no-ai"><strong>이 Case에서는 AI를 사용하지 않습니다.</strong><p>후배를 읽고 작은 성장 경험을 설계하는 판단은 먼저 리더 자신의 사고로 끝까지 해봅니다.</p></article>}
        </section>
      ) : null}

      {state.currentStep === 'discussion' ? (
        <section className="v3-card">
          <p className="v3-eyebrow">STEP 9 · 팀 토의 PAUSE</p>
          <h1>옆 사람과 3분만 비교해보세요.</h1>
          <div className="v3-discussion-list">{currentCase.discussionPrompts.map((prompt, index) => <article key={prompt}><span>{index + 1}</span><p>{prompt}</p></article>)}</div>
          <label className="v3-field"><span>팀에서 가장 의견이 갈린 한 가지 <small>(선택)</small></span><textarea rows={3} value={currentDraft.discussionNote} onChange={(event) => patchCase(currentCase.id, { discussionNote: event.target.value })} placeholder="예: 답을 바로 주는 것이 언제는 좋은 리더 행동인지 의견이 갈렸다." /></label>
        </section>
      ) : null}

      {state.currentStep === 'result' ? (
        <section className="v3-card v3-result-card">
          <p className="v3-eyebrow">STEP 10 · CASE {currentCase.id} TAKE-AWAY</p>
          <h1>{currentCase.takeaway}</h1>
          <div className="v3-result-block"><span>내 첫 선택</span><p>{currentCase.firstChoices.find((choice) => choice.id === currentDraft.firstChoice)?.label}</p></div>
          <div className="v3-result-block"><span>새 정보 후 다시 한 결정</span><p>{currentCase.secondChoices.find((choice) => choice.id === currentDraft.secondChoice)?.label}</p></div>
          {practiceSummary.map((entry) => <div className="v3-result-block" key={entry.label}><span>{entry.label}</span><p>{entry.value}</p></div>)}
          <div className="v3-result-block subtle"><span>이론 렌즈</span><p>{currentCase.theory.nameKo} · {currentCase.theory.nameEn}</p></div>
          <button type="button" className="v3-btn primary wide" onClick={completeCase}>{currentDraft.completedAt ? '내용 저장하고 CASE MAP으로' : 'CASE 완료 저장하고 MAP으로'}</button>
        </section>
      ) : null}

      <Nav hideNext={state.currentStep === 'result'} />
    </main>
  );
}
