import { useEffect, useMemo, useState } from 'react';
import { flowSteps } from '../data/flowSteps';
import { rounds } from '../data/rounds';
import { copyTextToClipboard } from '../lib/clipboard';
import { parseAiResult } from '../lib/aiResultParser';
import { buildKacAiPrompt } from '../lib/promptBuilder';
import { clearLearnerDraft, loadLearnerDraft, saveLearnerDraft } from '../lib/localDraft';
import type { ChoiceId, FlowStepId, Round } from '../types';
import { ChoiceCard } from './ChoiceCard';
import { ProgressHeader } from './ProgressHeader';
import { RoundCard } from './RoundCard';
import { SaveResultPanel } from './SaveResultPanel';
import { StepLayout } from './StepLayout';
import { TextInputPanel } from './TextInputPanel';

const stepOrder = flowSteps.map((step) => step.id);

type DraftState = {
  teamName: string;
  nickname: string;
  juniorReading: string;
  firstChoice: ChoiceId | '';
  firstReason: string;
  dilemma: string;
  secondChoice: string;
  directionId: string;
  editedPrompt: string;
  aiRawResult: string;
  aiFinalArtifact: string;
  aiReviewNotes: string;
  aiUseAsIs: string;
  aiRevise: string;
  aiRisky: string;
  growthGoal: string;
  twoWeekTask: string;
  leaderSupport: string;
  checkTiming: string;
  watchOut: string;
  finalLines: string[];
};

const initialDraft: DraftState = {
  teamName: '',
  nickname: '',
  juniorReading: '',
  firstChoice: '',
  firstReason: '',
  dilemma: '',
  secondChoice: '',
  directionId: '',
  editedPrompt: '',
  aiRawResult: '',
  aiFinalArtifact: '',
  aiReviewNotes: '',
  aiUseAsIs: '',
  aiRevise: '',
  aiRisky: '',
  growthGoal: '',
  twoWeekTask: '',
  leaderSupport: '',
  checkTiming: '',
  watchOut: '',
  finalLines: ['', '', '', '', ''],
};

function getInitialSavedDraft() {
  return loadLearnerDraft<DraftState>();
}

function findRoundById(roundId: string | undefined) {
  return rounds.find((round) => round.id === roundId) ?? rounds[0];
}

function freshRoundDraft(prev: DraftState): DraftState {
  return {
    ...initialDraft,
    teamName: prev.teamName,
    nickname: prev.nickname,
  };
}

export function LearnerShell() {
  const savedDraft = getInitialSavedDraft();
  const [selectedRound, setSelectedRound] = useState<Round>(() => findRoundById(savedDraft?.selectedRoundId));
  const [currentStep, setCurrentStep] = useState<FlowStepId>(() => savedDraft?.currentStep ?? 'intro');
  const [draft, setDraft] = useState<DraftState>(() => ({ ...initialDraft, ...(savedDraft?.draft ?? {}) }));
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => savedDraft?.savedAt ?? null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const stepIndex = stepOrder.indexOf(currentStep);

  const generatedPrompt = useMemo(() => buildKacAiPrompt(selectedRound, draft), [draft, selectedRound]);
  const promptText = draft.editedPrompt || generatedPrompt;
  const parsedAiResult = useMemo(() => parseAiResult(draft.aiRawResult), [draft.aiRawResult]);
  const finalArtifact = draft.aiFinalArtifact || parsedAiResult.finalArtifact;
  const reviewNotes = draft.aiReviewNotes || parsedAiResult.reviewNotes;

  useEffect(() => {
    saveLearnerDraft({ selectedRoundId: selectedRound.id, currentStep, draft });
    setLastSavedAt(new Date().toISOString());
  }, [currentStep, draft, selectedRound.id]);

  function updateDraft<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateAiRawResult(value: string) {
    const parsed = parseAiResult(value);
    setDraft((prev) => ({
      ...prev,
      aiRawResult: value,
      aiFinalArtifact: parsed.finalArtifact,
      aiReviewNotes: parsed.reviewNotes,
    }));
  }

  function goNext() {
    setCurrentStep(stepOrder[Math.min(stepIndex + 1, stepOrder.length - 1)]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setCurrentStep(stepOrder[Math.max(stepIndex - 1, 0)]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectRound(nextRound: Round) {
    setSelectedRound(nextRound);
    setDraft((prev) => freshRoundDraft(prev));
    setCopyStatus('idle');
  }

  function returnToRoundMap() {
    setDraft((prev) => freshRoundDraft(prev));
    setCopyStatus('idle');
    setCurrentStep('roundMap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function canGoNext() {
    if (currentStep === 'intro') return draft.teamName.trim().length > 0 && draft.nickname.trim().length > 0;
    if (currentStep === 'roundMap') return Boolean(selectedRound);
    if (currentStep === 'juniorReading') return draft.juniorReading.trim().length > 0;
    if (currentStep === 'firstDecision') return draft.firstChoice !== '' && draft.firstReason.trim().length > 0;
    if (currentStep === 'dilemmaAnalysis') return draft.dilemma.trim().length > 0;
    if (currentStep === 'secondDecision') return draft.secondChoice !== '';
    if (currentStep === 'developmentDirection') return draft.directionId !== '';
    if (currentStep === 'aiPrompt') return promptText.trim().length > 0;
    if (currentStep === 'aiAnswerReview') {
      return draft.aiRawResult.trim().length > 0 && (
        draft.aiUseAsIs.trim().length > 0 || draft.aiRevise.trim().length > 0 || draft.aiRisky.trim().length > 0
      );
    }
    if (currentStep === 'twoWeekPlan') {
      return [draft.growthGoal, draft.twoWeekTask, draft.leaderSupport, draft.checkTiming, draft.watchOut].every(
        (value) => value.trim().length > 0,
      );
    }
    if (currentStep === 'finalFiveLines') return draft.finalLines.every((line) => line.trim().length > 0);
    return true;
  }

  function setFinalLine(index: number, value: string) {
    setDraft((prev) => {
      const nextLines = [...prev.finalLines];
      nextLines[index] = value;
      return { ...prev, finalLines: nextLines };
    });
  }

  async function handleCopyPrompt() {
    const copied = await copyTextToClipboard(promptText);
    setCopyStatus(copied ? 'success' : 'fail');
  }

  function handleResetParticipant() {
    clearLearnerDraft();
    setSelectedRound(rounds[0]);
    setCurrentStep('intro');
    setDraft(initialDraft);
    setCopyStatus('idle');
    setLastSavedAt(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderSaveIndicator() {
    if (!lastSavedAt) return null;
    return (
      <p className="save-indicator">
        임시 저장됨 · {new Date(lastSavedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
      </p>
    );
  }

  function renderStep() {
    switch (currentStep) {
      case 'intro':
        return (
          <StepLayout eyebrow="시작하기" title="먼저 팀명과 닉네임을 적어주세요" description="입장 정보는 처음 한 번만 적습니다. 이후에는 라운드 Map에서 다른 장면을 이어서 선택할 수 있습니다." canGoBack={false} canGoNext={canGoNext()} onBack={goBack} onNext={goNext} nextLabel="라운드 Map 보기">
            <div className="form-stack">
              <TextInputPanel label="팀명" helper="강사용 화면에서 팀별로 보기 위한 이름입니다." value={draft.teamName} placeholder="예: 3팀" minRows={2} onChange={(value) => updateDraft('teamName', value)} />
              <TextInputPanel label="닉네임" helper="실명 대신 교육장에서 쓸 이름을 적어 주세요." value={draft.nickname} placeholder="예: 브릿지과장" minRows={2} onChange={(value) => updateDraft('nickname', value)} />
            </div>
          </StepLayout>
        );
      case 'roundMap':
        return (
          <StepLayout eyebrow="라운드 Map" title="오늘 해볼 장면을 고르세요" description="한 라운드를 저장한 뒤에도 이 화면으로 돌아와 다른 장면을 이어서 할 수 있습니다." canGoBack canGoNext={canGoNext()} onBack={handleResetParticipant} onNext={goNext} nextLabel="선택한 장면 시작">
            <div className="round-list">
              {rounds.map((round) => (
                <RoundCard key={round.id} round={round} isSelected={round.id === selectedRound.id} onSelect={selectRound} />
              ))}
            </div>
          </StepLayout>
        );
      case 'situation':
        return <StepLayout eyebrow="오늘의 장면" title={selectedRound.title} description={selectedRound.subtitle} canGoBack canGoNext onBack={goBack} onNext={goNext}><article className="story-card">{selectedRound.situation}</article></StepLayout>;
      case 'juniorReading':
        return (
          <StepLayout eyebrow="후배 보기" title={`${selectedRound.juniorName} ${selectedRound.juniorRole}, 어떻게 보이나요?`} description="성격을 단정하지 말고, 실제로 보인 말과 행동을 기준으로 적어봅니다." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext}>
            <div className="signal-list">{selectedRound.juniorSignals.map((signal) => <p key={signal}>{signal}</p>)}</div>
            <TextInputPanel label="내 눈에 보인 모습" helper="예: 확신이 없으면 혼자 판단하기보다 먼저 확인하려는 모습으로 보인다." value={draft.juniorReading} placeholder="후배의 말과 행동을 한두 문장으로 적어 주세요." onChange={(value) => updateDraft('juniorReading', value)} />
          </StepLayout>
        );
      case 'firstDecision':
        return (
          <StepLayout eyebrow="첫 대응" title={selectedRound.firstQuestion} description="정답을 맞히는 화면이 아닙니다. 지금 내가 실제로 할 법한 말을 골라보세요." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext}>
            <div className="choice-stack">{selectedRound.firstChoices.map((choice) => <ChoiceCard key={choice.id} choice={choice} isSelected={draft.firstChoice === choice.id} onSelect={(choiceId) => updateDraft('firstChoice', choiceId)} />)}</div>
            <TextInputPanel label="왜 그렇게 말하려고 하나요?" helper="지금 상황에서 이 선택이 더 낫다고 본 이유를 적어 주세요." value={draft.firstReason} placeholder="내 선택 이유를 적어 주세요." onChange={(value) => updateDraft('firstReason', value)} />
          </StepLayout>
        );
      case 'firstResult':
        return <StepLayout eyebrow="선택 뒤 장면" title="이 선택이 남긴 장면입니다" description="일은 조금 풀릴 수 있지만, 다른 부담이 남을 수도 있습니다." canGoBack canGoNext onBack={goBack} onNext={goNext}><article className="story-card emphasis">{draft.firstChoice ? selectedRound.firstResultByChoice[draft.firstChoice] : '아직 선택한 내용이 없습니다.'}</article></StepLayout>;
      case 'juniorReaction':
        return <StepLayout eyebrow="후배의 다음 말" title="후배가 이렇게 받아들입니다" description="후배의 말 속에 다음에 도와줄 지점이 숨어 있습니다." canGoBack canGoNext onBack={goBack} onNext={goNext}><article className="story-card">{selectedRound.juniorReaction}</article></StepLayout>;
      case 'dilemmaAnalysis':
        return (
          <StepLayout eyebrow="걸리는 지점" title="지금 어디서 막히나요?" description={selectedRound.dilemmaPrompt} canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext}>
            <div className="signal-list">{selectedRound.dilemmaHints.map((hint) => <p key={hint}>{hint}</p>)}</div>
            <TextInputPanel label="내가 지금 고민하는 지점" helper="예: 바로 답을 주면 일은 빨리 끝나지만, 다음에도 과장의 답을 기다릴 수 있다." value={draft.dilemma} placeholder="지금 걸리는 지점을 적어 주세요." onChange={(value) => updateDraft('dilemma', value)} />
          </StepLayout>
        );
      case 'secondDecision':
        return (
          <StepLayout eyebrow="다시 보기" title={selectedRound.secondQuestion} description="처음 생각을 그대로 갈 수도 있고, 조금 고치거나 방향을 바꿀 수도 있습니다." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext}>
            <div className="choice-stack">{selectedRound.secondChoices.map((choice) => <button key={choice.id} type="button" className={`direction-card ${draft.secondChoice === choice.id ? 'selected' : ''}`} onClick={() => updateDraft('secondChoice', choice.id)}><strong>{choice.label}</strong><span>{choice.description}</span></button>)}</div>
          </StepLayout>
        );
      case 'additionalSituation':
        return <StepLayout eyebrow="일이 한 번 더 꼬입니다" title="현장은 한 번 더 흔들립니다" description="새로 생긴 상황까지 보고, 앞으로 2주 동안 어떻게 도와줄지 정합니다." canGoBack canGoNext onBack={goBack} onNext={goNext}><article className="story-card">{selectedRound.additionalSituation}</article></StepLayout>;
      case 'developmentDirection':
        return (
          <StepLayout eyebrow="2주 도움 고르기" title="앞으로 2주, 무엇을 도와줄까요?" description="후배가 조금 달라질 수 있는 작은 도움을 하나 골라봅니다." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={() => { if (!draft.editedPrompt) updateDraft('editedPrompt', generatedPrompt); setCopyStatus('idle'); goNext(); }}>
            <div className="choice-stack">{selectedRound.developmentDirections.map((direction) => <button key={direction.id} type="button" className={`direction-card ${draft.directionId === direction.id ? 'selected' : ''}`} onClick={() => updateDraft('directionId', direction.id)}><strong>{direction.title}</strong><span>{direction.description}</span><small>조심할 점: {direction.watchOut}</small></button>)}</div>
          </StepLayout>
        );
      case 'aiPrompt':
        return (
          <StepLayout eyebrow="AI에게 물어볼 말" title="AI에게 줄 질문을 먼저 다듬습니다" description="내 선택, 후배 반응, 다시 생각한 내용이 들어간 질문입니다. 그대로 복사하기 전에 우리 현장에 맞는지 한 번 봐 주세요." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext} nextLabel="AI 답변 가져오기">
            <div className="copy-panel"><p>복사한 뒤 GPT, Gemini, Claude 같은 AI 도구에 붙여넣고 답변을 받아오면 됩니다.</p><button type="button" className="copy-button" onClick={handleCopyPrompt}>AI 질문 복사하기</button>{copyStatus === 'success' ? <span className="copy-status success">복사되었습니다.</span> : null}{copyStatus === 'fail' ? <span className="copy-status fail">복사에 실패했습니다. 길게 눌러 직접 복사해 주세요.</span> : null}</div>
            <TextInputPanel label="AI에게 물어볼 내용" helper="민감한 고객 정보, 내부 수치, 실명 정보가 들어가지 않았는지 확인해 주세요." value={promptText} placeholder="AI에게 물어볼 말을 고쳐 주세요." minRows={12} onChange={(value) => { updateDraft('editedPrompt', value); setCopyStatus('idle'); }} />
          </StepLayout>
        );
      case 'aiAnswerReview':
        return (
          <StepLayout eyebrow="AI 답변 보기" title="AI 답변을 바로 쓰지 말고 골라봅니다" description="AI 도구에서 받은 답변을 붙여넣고, 쓸 말과 고칠 말을 나눠봅니다." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext}>
            <TextInputPanel label="AI 답변 전체 붙여넣기" helper="AI가 준 답변 전체를 그대로 붙여넣으세요. 결과물이 있으면 아래에 따로 보입니다." value={draft.aiRawResult} placeholder="AI 답변 전체를 붙여넣어 주세요." minRows={10} onChange={updateAiRawResult} />
            {finalArtifact ? <article className="ai-artifact-card"><h3>AI가 써준 초안</h3><pre>{finalArtifact}</pre></article> : <article className="ai-artifact-card muted-card"><h3>아직 따로 보이는 결과물이 없습니다</h3><p>AI 답변을 붙여넣으면 여기에서 참고할 초안을 확인할 수 있습니다.</p></article>}
            {reviewNotes ? <article className="ai-artifact-card review"><h3>한 번 더 생각해 볼 점</h3><pre>{reviewNotes}</pre></article> : null}
            <TextInputPanel label="그대로 참고할 부분" helper="우리 현장에서도 쓸 만한 문장이나 흐름을 적습니다." value={draft.aiUseAsIs} placeholder="그대로 참고할 부분" onChange={(value) => updateDraft('aiUseAsIs', value)} />
            <TextInputPanel label="고쳐야 할 부분" helper="말투, 강도, 타이밍을 우리 상황에 맞게 고칠 부분입니다." value={draft.aiRevise} placeholder="고쳐야 할 부분" onChange={(value) => updateDraft('aiRevise', value)} />
            <TextInputPanel label="그대로 쓰면 위험한 부분" helper="후배를 단정하거나, 책임을 떠넘기거나, 우리 조직 분위기와 맞지 않는 부분입니다." value={draft.aiRisky} placeholder="조심할 부분" onChange={(value) => updateDraft('aiRisky', value)} />
          </StepLayout>
        );
      case 'twoWeekPlan':
        return (
          <StepLayout eyebrow="2주 동안 해볼 일" title={selectedRound.finalOutput} description="AI 초안은 참고만 하고, 실제로 할 일은 과장님의 말로 다시 정리합니다." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext}>
            {finalArtifact ? <article className="ai-artifact-card compact"><h3>참고할 AI 초안</h3><pre>{finalArtifact}</pre></article> : null}
            <TextInputPanel label="2주 뒤 달라졌으면 하는 모습" helper="후배가 무엇을 조금 더 잘하게 되면 좋을까요?" value={draft.growthGoal} placeholder={selectedRound.twoWeekPlanGuide.growthGoalPlaceholder} onChange={(value) => updateDraft('growthGoal', value)} />
            <TextInputPanel label="이번 주에 맡겨볼 작은 일" helper="후배에게 실제로 맡길 수 있는 작고 분명한 일입니다." value={draft.twoWeekTask} placeholder={selectedRound.twoWeekPlanGuide.taskPlaceholder} onChange={(value) => updateDraft('twoWeekTask', value)} />
            <TextInputPanel label="내가 옆에서 도와줄 일" helper="대신 해주는 것이 아니라, 해볼 수 있게 받쳐주는 일입니다." value={draft.leaderSupport} placeholder={selectedRound.twoWeekPlanGuide.supportPlaceholder} onChange={(value) => updateDraft('leaderSupport', value)} />
            <TextInputPanel label="언제 짧게 같이 볼지" helper="언제, 얼마나 짧게 확인할지 정합니다." value={draft.checkTiming} placeholder={selectedRound.twoWeekPlanGuide.checkTimingPlaceholder} onChange={(value) => updateDraft('checkTiming', value)} />
            <TextInputPanel label="말할 때 조심할 표현" helper="후배가 위축되거나 오해하지 않게 조심할 말입니다." value={draft.watchOut} placeholder={selectedRound.twoWeekPlanGuide.watchOutPlaceholder} onChange={(value) => updateDraft('watchOut', value)} />
          </StepLayout>
        );
      case 'finalFiveLines':
        return (
          <StepLayout eyebrow="내일 할 말" title="후배에게 실제로 할 말 5줄" description="AI 초안은 참고하되, 마지막 문장은 내 말투로 다듬습니다." canGoBack canGoNext={canGoNext()} onBack={goBack} onNext={goNext} nextLabel="결과 보기">
            {finalArtifact ? <article className="ai-artifact-card compact"><h3>참고할 AI 초안</h3><pre>{finalArtifact}</pre></article> : null}
            {selectedRound.finalFiveLineGuide.map((guide, index) => <TextInputPanel key={guide} label={`${index + 1}번째 문장`} helper={guide} value={draft.finalLines[index]} placeholder="한 문장으로 적어 주세요." minRows={3} onChange={(value) => setFinalLine(index, value)} />)}
          </StepLayout>
        );
      case 'result':
      default:
        return (
          <StepLayout eyebrow="저장" title="오늘 정리한 내용이 준비됐습니다" description="저장 버튼을 누르면 강사용 화면에서 함께 확인할 수 있습니다." canGoBack canGoNext={false} onBack={goBack} onNext={goNext}>
            <SaveResultPanel round={selectedRound} draft={draft} generatedPrompt={generatedPrompt} promptText={promptText} onStartOver={returnToRoundMap} />
          </StepLayout>
        );
    }
  }

  return (
    <div className="mobile-learner-shell">
      <ProgressHeader currentStep={currentStep} roundTitle={currentStep === 'intro' || currentStep === 'roundMap' ? undefined : selectedRound.title} />
      {renderSaveIndicator()}
      {renderStep()}
    </div>
  );
}
