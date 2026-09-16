import { useMemo, useState } from 'react';
import { kacCiLogoDataUrl } from '../assets/kacCiLogo';
import { v3CaseById, v3Cases, v3SessionGroups } from '../v3/cases';
import type { V3CaseId, V3ChoiceId, V3SecondChoiceId, V3StepId } from '../v3/types';
import { v4CaseExperience } from '../v4/actionSimulationConfig';
import { v4InstructorGuides, v4PlaybookModel } from '../v4/instructorGuideConfig';

type InstructorView = 'overview' | 'case' | 'playbook';

type PcScene = Extract<
  V3StepId,
  'situation' | 'signals' | 'firstDecision' | 'consequence' | 'secondDecision' | 'discussion' | 'theoryBridge' | 'result'
>;

const pcScenes: { id: PcScene; label: string; short: string }[] = [
  { id: 'situation', label: '상황', short: '1' },
  { id: 'signals', label: '초점', short: '2' },
  { id: 'firstDecision', label: '첫 결정', short: '3' },
  { id: 'consequence', label: '결과+새 정보', short: '4' },
  { id: 'secondDecision', label: '재결정', short: '5' },
  { id: 'discussion', label: '2~3인 토의', short: '6' },
  { id: 'theoryBridge', label: '이론+현장도구', short: '7' },
  { id: 'result', label: 'Action Guide', short: '8' },
];

function getSessionClass(caseId: V3CaseId) {
  return `v4pc-${v3CaseById[caseId].session.toLowerCase()}`;
}

export function V4InstructorPcShell() {
  const [view, setView] = useState<InstructorView>('overview');
  const [caseId, setCaseId] = useState<V3CaseId>('A');
  const [scene, setScene] = useState<PcScene>('situation');
  const [showGuides, setShowGuides] = useState(false);
  const [focusByCase, setFocusByCase] = useState<Partial<Record<V3CaseId, string[]>>>({});
  const [firstByCase, setFirstByCase] = useState<Partial<Record<V3CaseId, V3ChoiceId>>>({});
  const [secondByCase, setSecondByCase] = useState<Partial<Record<V3CaseId, V3SecondChoiceId>>>({});

  const currentCase = v3CaseById[caseId];
  const experience = v4CaseExperience[caseId];
  const guide = v4InstructorGuides[caseId];
  const selectedFocus = focusByCase[caseId] ?? [];
  const selectedFirst = firstByCase[caseId];
  const selectedSecond = secondByCase[caseId];
  const selectedFirstChoice = currentCase.firstChoices.find((choice) => choice.id === selectedFirst);
  const selectedSecondChoice = currentCase.secondChoices.find((choice) => choice.id === selectedSecond);

  const sceneIndex = pcScenes.findIndex((item) => item.id === scene);

  const modelPracticeRows = useMemo(
    () => currentCase.practiceFields.map((field) => ({ ...field, model: guide.practiceAnswers[field.id] ?? '' })),
    [currentCase, guide],
  );

  function openCase(nextCaseId: V3CaseId, nextScene: PcScene = 'situation') {
    setCaseId(nextCaseId);
    setScene(nextScene);
    setView('case');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function moveScene(delta: number) {
    const nextIndex = Math.max(0, Math.min(pcScenes.length - 1, sceneIndex + delta));
    setScene(pcScenes[nextIndex].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleFocus(option: string) {
    setFocusByCase((prev) => {
      const current = prev[caseId] ?? [];
      if (experience.focusLimit === 1) {
        return { ...prev, [caseId]: current.includes(option) ? [] : [option] };
      }
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : current.length < experience.focusLimit
          ? [...current, option]
          : current;
      return { ...prev, [caseId]: next };
    });
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // Fullscreen may be blocked in some browsers; the lecture screen still works normally.
    }
  }

  function GuidePanel({ title = '모범 가이드', children }: { title?: string; children: React.ReactNode }) {
    if (!showGuides) return null;
    return (
      <aside className="v4pc-guide-panel">
        <div className="v4pc-guide-title"><span>INSTRUCTOR</span><strong>{title}</strong></div>
        <div className="v4pc-guide-body">{children}</div>
      </aside>
    );
  }

  function Sidebar() {
    return (
      <aside className="v4pc-sidebar">
        <div className="v4pc-brand">
          <img src={kacCiLogoDataUrl} alt="한국공항공사 CI" />
          <span>강사용 PC</span>
          <strong>Bridge AI Leadership Journey</strong>
          <p>Action Simulation · Instructor View</p>
        </div>

        <button type="button" className={`v4pc-nav-home ${view === 'overview' ? 'active' : ''}`} onClick={() => setView('overview')}>
          <span>OVERVIEW</span><strong>전체 진행 구조</strong>
        </button>

        <div className="v4pc-case-nav">
          {v3SessionGroups.map((group) => (
            <section key={group.id}>
              <div className={`v4pc-session-label ${group.id.toLowerCase()}`}>
                <strong>{group.id}</strong><span>{group.title.replace(`${group.id} · `, '')}</span>
              </div>
              {group.caseIds.map((id) => {
                const item = v3CaseById[id];
                const active = view === 'case' && caseId === id;
                return (
                  <button type="button" key={id} className={`v4pc-case-nav-btn ${active ? 'active' : ''}`} onClick={() => openCase(id)}>
                    <span>CASE {id}</span><strong>{item.title}</strong>
                  </button>
                );
              })}
            </section>
          ))}
        </div>

        <button type="button" className={`v4pc-nav-home v4pc-final-link ${view === 'playbook' ? 'active' : ''}`} onClick={() => setView('playbook')}>
          <span>FINAL</span><strong>Bridge Leader Playbook</strong>
        </button>
      </aside>
    );
  }

  function Topbar() {
    return (
      <header className="v4pc-topbar">
        <div>
          <p>{view === 'overview' ? '강의용 전체 구조' : view === 'playbook' ? 'FINAL · Bridge Leader Playbook' : `CASE ${caseId} · ${currentCase.session}`}</p>
          <strong>{view === 'overview' ? '강사용 PC Lecture View' : view === 'playbook' ? '현장 행동까지 연결하는 종합 정리' : currentCase.title}</strong>
        </div>
        <div className="v4pc-top-actions">
          <button type="button" className={`v4pc-guide-toggle ${showGuides ? 'on' : ''}`} onClick={() => setShowGuides((prev) => !prev)}>
            {showGuides ? '모범 가이드 숨기기' : '모범 가이드 보기'}
          </button>
          <button type="button" className="v3-btn ghost" onClick={toggleFullscreen}>전체화면</button>
        </div>
      </header>
    );
  }

  function Overview() {
    return (
      <div className="v4pc-page">
        <section className="v3-hero v4pc-overview-hero">
          <p className="v3-eyebrow">INSTRUCTOR · PC LECTURE VIEW</p>
          <h1>모바일 학습 경험은 그대로,<br />강의 화면에는 해설과 모범 가이드를 더했습니다.</h1>
          <p>교육생용 모바일 버전의 상황·선택·이론·Action Guide 콘텐츠를 그대로 사용합니다. PC에서는 Case와 장면을 자유롭게 이동하고, 토의 후 모범 가이드를 필요한 순간에만 공개할 수 있습니다.</p>
          <div className="v4-journey-strip v4pc-journey-strip">
            <span><b>READ</b> 행동을 읽는다</span><i>→</i><span><b>DEVELOP</b> 성장을 설계한다</span><i>→</i><span><b>BRIDGE</b> 개인과 팀을 연결한다</span>
          </div>
        </section>

        <section className="v4pc-overview-grid">
          <article className="v3-card"><span className="v4pc-number">01</span><h2>교육생이 먼저 결정</h2><p>강사는 모범 가이드를 숨긴 상태로 동일한 상황과 선택지만 제시합니다.</p></article>
          <article className="v3-card"><span className="v4pc-number">02</span><h2>2~3인 토의</h2><p>교육생들이 자신의 선택과 이유를 비교한 뒤 강사가 의견 차이를 받아냅니다.</p></article>
          <article className="v3-card"><span className="v4pc-number">03</span><h2>가이드 공개</h2><p>상단의 ‘모범 가이드 보기’를 눌러 선택의 활용 조건과 토의 정리 방향을 설명합니다.</p></article>
          <article className="v3-card"><span className="v4pc-number">04</span><h2>현장 행동 연결</h2><p>교육생 입력 항목마다 예시 답안을 보여주고, 실제 팀에서 사용할 행동 문장으로 마무리합니다.</p></article>
        </section>

        <section className="v3-card v4pc-case-overview">
          <p className="v3-eyebrow">6 CASES</p>
          <h2>강의에서 바로 이동할 수 있습니다.</h2>
          <div className="v4pc-case-overview-grid">
            {v3Cases.map((item) => (
              <button type="button" key={item.id} className={`v4pc-overview-case ${item.session.toLowerCase()}`} onClick={() => openCase(item.id)}>
                <span>CASE {item.id} · {item.session}</span><strong>{item.title}</strong><p>{item.hook}</p>
              </button>
            ))}
          </div>
        </section>

        <GuidePanel title="강의 운영 원칙">
          <ul>
            <li>선택 전에 모범 가이드를 먼저 보여주지 않습니다.</li>
            <li>“정답은 C입니다”가 아니라 각 선택이 어떤 조건에서 현실적인지를 설명합니다.</li>
            <li>교육생의 답과 모범 예시가 다르더라도 행동 기준이 분명하면 비교·토의 재료로 사용합니다.</li>
            <li>마지막에는 반드시 “다음 업무에서 무엇을 다르게 할 것인가”로 연결합니다.</li>
          </ul>
        </GuidePanel>
      </div>
    );
  }

  function SceneRail() {
    return (
      <nav className="v4pc-scene-rail">
        {pcScenes.map((item) => (
          <button type="button" key={item.id} className={scene === item.id ? 'active' : ''} onClick={() => setScene(item.id)}>
            <span>{item.short}</span><strong>{item.label}</strong>
          </button>
        ))}
      </nav>
    );
  }

  function CaseScene() {
    return (
      <div className={`v4pc-page v4pc-case-page ${getSessionClass(caseId)}`}>
        <SceneRail />

        {scene === 'situation' ? (
          <section className="v3-hero v4-situation v4pc-content-card">
            <p className="v3-eyebrow">SCENE 1 · 지금 벌어진 일</p>
            <h1>{currentCase.title}</h1>
            <p className="v3-dilemma">{currentCase.leadershipDilemma}</p>
            <div className="v3-story">{currentCase.situation.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line || <br />}</p>)}</div>
            <div className="v4-scene-tip"><b>읽을 때</b><span>“이 후배는 어떤 사람인가?”보다 “무슨 일이 이 행동을 만들었나?”를 먼저 봅니다.</span></div>
            <GuidePanel title="강사의 장면 해석">
              <p>{guide.focusGuide}</p>
              <p className="v4pc-emphasis">강의 포인트: {guide.facilitatorPoint}</p>
            </GuidePanel>
          </section>
        ) : null}

        {scene === 'signals' ? (
          <section className="v3-card v4pc-content-card">
            <p className="v3-eyebrow">SCENE 2 · {currentCase.session === 'READ' ? '행동을 읽기' : currentCase.session === 'DEVELOP' ? '지원 초점 정하기' : '우선 기준 정하기'}</p>
            <h1>{experience.focusTitle}</h1>
            <p className="v3-muted">{experience.focusDescription}</p>
            <div className="v4pc-choice-grid">
              {experience.focusOptions.map((option) => (
                <button type="button" key={option} className={`v3-choice ${selectedFocus.includes(option) ? 'selected' : ''}`} onClick={() => toggleFocus(option)}>
                  <span>{selectedFocus.includes(option) ? '✓' : ''}</span>{option}
                </button>
              ))}
            </div>
            <p className="v3-counter">강의 시연 선택 {selectedFocus.length}/{experience.focusLimit}</p>
            <GuidePanel title="초점 선택 모범 가이드"><p>{guide.focusGuide}</p></GuidePanel>
          </section>
        ) : null}

        {scene === 'firstDecision' ? (
          <section className="v3-card v4pc-content-card">
            <p className="v3-eyebrow">SCENE 3 · 첫 결정</p>
            <h1>{currentCase.firstQuestion}</h1>
            <div className="v4-real-choice-note"><strong>세 보기 모두 실제 중간관리자가 선택할 수 있는 대응입니다.</strong><span>교육생에게 먼저 선택하게 한 뒤, 강사는 각 방식이 현실적인 조건과 비용을 비교합니다.</span></div>
            <div className="v4pc-decision-grid">
              {currentCase.firstChoices.map((choice) => (
                <button type="button" key={choice.id} className={`v3-decision-card ${selectedFirst === choice.id ? 'selected' : ''}`} onClick={() => setFirstByCase((prev) => ({ ...prev, [caseId]: choice.id }))}>
                  <span className="v3-choice-letter">{choice.id}</span><strong>{choice.label}</strong><p>{choice.rationale}</p>
                  {showGuides ? <div className="v4pc-inline-guide"><b>강사 해설</b><span>{guide.firstChoiceGuide[choice.id]}</span></div> : null}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {scene === 'consequence' ? (
          <section className="v3-hero v4pc-content-card">
            <p className="v3-eyebrow">SCENE 4 · 내 선택이 만든 장면 + 새 정보</p>
            <h1>선택에는 효과와 비용이 함께 있습니다.</h1>
            {!selectedFirstChoice ? (
              <div className="v4pc-empty-state"><strong>먼저 시연할 첫 선택을 골라주세요.</strong><div>{currentCase.firstChoices.map((choice) => <button key={choice.id} type="button" className="v3-btn secondary" onClick={() => setFirstByCase((prev) => ({ ...prev, [caseId]: choice.id }))}>{choice.id} 선택</button>)}</div></div>
            ) : (
              <>
                <div className="v3-choice-analysis"><article><span>이 선택의 힘</span><p>{selectedFirstChoice.benefit}</p></article><article><span>놓칠 수 있는 비용</span><p>{selectedFirstChoice.cost}</p></article></div>
                <div className="v3-story emphasis"><p>{currentCase.consequenceByChoice[selectedFirstChoice.id]}</p></div>
                <div className="v4-new-info"><span>새로 들어온 정보</span><p>{currentCase.newInfoByChoice[selectedFirstChoice.id]}</p></div>
                <GuidePanel title="이 선택을 어떻게 해석할까"><p>{guide.firstChoiceGuide[selectedFirstChoice.id]}</p><p className="v4pc-emphasis">정리: 선택의 좋고 나쁨보다, 지금 얻은 것과 남은 부담을 함께 보게 합니다.</p></GuidePanel>
              </>
            )}
          </section>
        ) : null}

        {scene === 'secondDecision' ? (
          <section className="v3-card v4pc-content-card">
            <p className="v3-eyebrow">SCENE 5 · 새 정보 후 재결정</p>
            <h1>{currentCase.secondQuestion}</h1>
            <div className="v4-real-choice-note"><strong>이번에는 “좋은 행동”을 고르는 것이 아니라 운영방식을 선택합니다.</strong><span>상황, 시간, 후배의 준비 수준에 따라 다른 선택이 가능합니다.</span></div>
            <div className="v4pc-decision-grid three">
              {currentCase.secondChoices.map((choice) => (
                <button type="button" key={choice.id} className={`v3-choice block ${selectedSecond === choice.id ? 'selected' : ''}`} onClick={() => setSecondByCase((prev) => ({ ...prev, [caseId]: choice.id }))}>
                  <strong>{choice.label}</strong><small>{choice.description}</small>
                  {showGuides ? <span className="v4pc-inline-guide"><b>강사 해설</b><span>{guide.secondChoiceGuide[choice.id]}</span></span> : null}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {scene === 'discussion' ? (
          <section className="v3-card v4pc-content-card">
            <p className="v3-eyebrow">SCENE 6 · PAIR / TRIO TALK</p>
            <h1>{experience.discussionTitle}</h1>
            <p className="v3-muted">{experience.discussionInstruction}</p>
            <div className="v3-discussion-list">{experience.discussionPrompts.map((prompt, index) => <article key={prompt}><span>{index + 1}</span><p>{prompt}</p></article>)}</div>
            <div className="v4pc-input-preview"><span>교육생 입력</span><strong>우리 조가 합의한 행동 기준 한 줄</strong><div>토의가 끝난 뒤 한 문장으로 정리합니다.</div></div>
            <GuidePanel title="토의 모범 정리 방향">
              <ol>{guide.discussionGuide.map((item) => <li key={item}>{item}</li>)}</ol>
              <p className="v4pc-emphasis">강의 마무리: {guide.facilitatorPoint}</p>
            </GuidePanel>
          </section>
        ) : null}

        {scene === 'theoryBridge' ? (
          <section className="v3-card v3-theory-card v4-theory-practice v4pc-content-card">
            <p className="v3-eyebrow">SCENE 7 · 경험을 이론과 현장도구로 연결</p>
            <h1>{currentCase.theory.nameKo}<br /><small>{currentCase.theory.nameEn}</small></h1>
            <p className="v3-theory-one-line">{currentCase.theory.oneLine}</p>
            <div className="v3-theory-grid"><article><span>이 장면에서 보인 것</span><p>{currentCase.theory.sceneSignal}</p></article><article><span>과장이 할 일</span><p>{currentCase.theory.leaderMove}</p></article><article><span>개념 연결</span><p>{currentCase.theory.quizConnection}</p></article></div>

            <div className="v4-tool-head"><span>FIELD TOOL</span><h2>{currentCase.practiceTitle}</h2><p>{currentCase.practiceDescription}</p></div>
            <div className="v4pc-practice-grid">
              {modelPracticeRows.map((field) => (
                <article className="v4pc-practice-field" key={field.id}>
                  <div><strong>{field.label}</strong><p>{field.helper}</p></div>
                  <div className="v4pc-blank-answer">교육생 입력 영역</div>
                  {showGuides ? <div className="v4pc-model-answer"><span>모범 가이드 예시</span><p>{field.model}</p></div> : null}
                </article>
              ))}
            </div>

            {currentCase.aiMode !== 'none' ? <article className="v3-ai-card v4pc-ai-card"><p className="v3-eyebrow">AI는 두 번째 의견입니다</p><h3>{currentCase.aiUseLabel}</h3><p>교육생이 먼저 자신의 기준을 만든 뒤 AI로 비교·검토하도록 안내합니다. AI가 첫 판단을 대신하지 않게 합니다.</p></article> : <article className="v3-no-ai"><strong>이 Case에서는 AI를 사용하지 않습니다.</strong><p>리더 자신의 관찰과 판단으로 행동 도구를 완성합니다.</p></article>}

            <GuidePanel title="현장도구 지도 포인트"><p>{guide.facilitatorPoint}</p></GuidePanel>
          </section>
        ) : null}

        {scene === 'result' ? (
          <section className="v3-card v4-action-guide v4pc-content-card">
            <p className="v3-eyebrow">SCENE 8 · CASE {caseId} ACTION GUIDE</p>
            <h1>이런 상황에서는<br />이렇게 행동할 수 있습니다.</h1>
            <p className="v3-muted">하나의 정답이 아닙니다. 상황 조건에 따라 사용할 수 있는 현실적인 행동 옵션입니다.</p>
            <div className="v4-condition-grid">{experience.actionGuide.map((item, index) => <article key={item.condition}><span>{index + 1}</span><div><strong>{item.condition}</strong><p>{item.action}</p></div></article>)}</div>
            <div className="v4-talk-box"><span>현장에서 이렇게 말해볼 수 있습니다</span><p>{experience.sampleTalk}</p></div>
            <div className="v4-avoid-box"><span>피해야 할 접근</span><p>{experience.avoid}</p></div>
            {showGuides ? <div className="v4pc-model-summary"><span>입력 예시 요약</span>{modelPracticeRows.map((field) => <p key={field.id}><b>{field.label}</b><br />{field.model}</p>)}</div> : null}
          </section>
        ) : null}

        <div className="v4pc-scene-footer">
          <button type="button" className="v3-btn secondary" disabled={sceneIndex <= 0} onClick={() => moveScene(-1)}>← 이전 장면</button>
          <span>{sceneIndex + 1} / {pcScenes.length}</span>
          <button type="button" className="v3-btn primary" disabled={sceneIndex >= pcScenes.length - 1} onClick={() => moveScene(1)}>다음 장면 →</button>
        </div>
      </div>
    );
  }

  function Playbook() {
    return (
      <div className="v4pc-page">
        <section className="v3-hero v4pc-overview-hero">
          <p className="v3-eyebrow">FINAL · BRIDGE LEADER PLAYBOOK</p>
          <h1>6개 Case를<br />다음 2주의 행동 하나로 줄입니다.</h1>
          <p>강의에서는 개인의 선택을 좋고 나쁨으로 평가하지 않고, 자주 쓰는 행동 방식의 강점과 주의점을 연결한 뒤 실제 행동계획으로 마무리합니다.</p>
        </section>

        <section className="v4pc-playbook-grid">
          <article className="v3-card"><p className="v3-eyebrow">MORE</p><h2>앞으로 더 할 행동</h2><div className="v4pc-input-preview large">교육생이 6개 Case 중 더 자주 해볼 행동 하나를 선택합니다.</div>{showGuides ? <div className="v4pc-model-answer"><span>모범 가이드 예시</span><p>{v4PlaybookModel.more}</p></div> : null}</article>
          <article className="v3-card"><p className="v3-eyebrow">LESS</p><h2>앞으로 줄일 행동</h2><div className="v4pc-input-preview large">무심코 반복하지만 후배의 판단·성장을 막을 수 있는 행동 하나를 선택합니다.</div>{showGuides ? <div className="v4pc-model-answer"><span>모범 가이드 예시</span><p>{v4PlaybookModel.less}</p></div> : null}</article>
          <article className="v3-card"><p className="v3-eyebrow">NEXT 2 WEEKS</p><h2>실제 행동계획</h2><div className="v4pc-input-preview large">언제, 누구에게, 무엇을 다르게 할지 한 문장으로 작성합니다.</div>{showGuides ? <div className="v4pc-model-answer"><span>모범 가이드 예시</span><p>{v4PlaybookModel.nextTwoWeeks}</p></div> : null}</article>
        </section>

        <GuidePanel title="Playbook 디브리핑">
          <ul>
            <li>MORE/LESS는 성격 목표가 아니라 관찰 가능한 행동으로 적게 합니다.</li>
            <li>“코칭을 잘하겠다”보다 “답을 주기 전에 판단 근거를 먼저 묻겠다”처럼 씁니다.</li>
            <li>NEXT 2 WEEKS에는 시점·대상·행동이 모두 들어가야 실제 실행 가능성이 높아집니다.</li>
          </ul>
        </GuidePanel>
      </div>
    );
  }

  return (
    <div className="v4pc-shell">
      <Sidebar />
      <div className="v4pc-workspace">
        <Topbar />
        <main className="v4pc-main">
          {view === 'overview' ? <Overview /> : null}
          {view === 'case' ? <CaseScene /> : null}
          {view === 'playbook' ? <Playbook /> : null}
        </main>
      </div>
    </div>
  );
}
