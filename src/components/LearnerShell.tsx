import { useEffect, useMemo, useState } from 'react';
import { createEmptyCoachingDialogueLines } from '../data/coachingDialogueConfig';
import { flowSteps } from '../data/flowSteps';
import { rounds } from '../data/normalizedRounds';
import { sessions } from '../data/sessions';
import { copyTextToClipboard } from '../lib/clipboard';
import { parseAiResult } from '../lib/aiResultParser';
import { buildKacAiPrompt } from '../lib/promptBuilder';
import { getRoundDisplayTitle } from '../lib/roundDisplay';
import { clearCompletedRoundIds, clearLearnerDraft, loadCompletedRoundIds, loadLearnerDraft, markRoundCompleted, saveLearnerDraft } from '../lib/localDraft';
import { canMoveNext, createFreshRoundDraft, initialLearnerDraft, type LearnerDraft } from '../lib/learnerFlow';
import type { FlowStepId, LearningSession, Round, RoundId } from '../types';
import { ChoiceCard } from './ChoiceCard';
import { AiAnswerReviewStep } from './learner/AiAnswerReviewStep';
import { AiPromptStep } from './learner/AiPromptStep';
import { FinalFiveLinesStep } from './learner/FinalFiveLinesStep';
import { IntroStep } from './learner/IntroStep';
import { ProgressHeader } from './ProgressHeader';
import { RoundMapStep } from './learner/RoundMapStep';
import { SaveResultPanel } from './SaveResultPanel';
import { SessionMapStep } from './learner/SessionMapStep';
import { StepLayout } from './StepLayout';
import { StoryStep } from './learner/StoryStep';
import { TextInputPanel } from './TextInputPanel';
import { TwoWeekPlanStep } from './learner/TwoWeekPlanStep';

const stepOrder = flowSteps.map((step) => step.id);

function getInitialSavedDraft() {
  return loadLearnerDraft<LearnerDraft>();
}

function findRoundById(roundId: string | undefined) {
  return rounds.find((round) => round.id === roundId) ?? rounds[0];
}

function findSessionByRoundId(roundId: string | undefined) {
  return sessions.find((session) => session.roundIds.includes(roundId as RoundId)) ?? sessions[0];
}

function getFirstRoundInSession(session: LearningSession) {
  return rounds.find((round) => round.id === session.roundIds[0]) ?? rounds[0];
}

export function LearnerShell() {
  const savedDraft = getInitialSavedDraft();
  const [selectedSession, setSelectedSession] = useState<LearningSession>(() => findSessionByRoundId(savedDraft?.selectedRoundId));
  const [selectedRound, setSelectedRound] = useState<Round>(() => findRoundById(savedDraft?.selectedRoundId));
  const [currentStep, setCurrentStep] = useState<FlowStepId>(() => savedDraft?.currentStep ?? 'intro');
  const [draft, setDraft] = useState<LearnerDraft>(() => ({ ...initialLearnerDraft, ...(savedDraft?.draft ?? {}) }));
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => savedDraft?.savedAt ?? null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [completedRoundIds, setCompletedRoundIds] = useState<RoundId[]>(() => loadCompletedRoundIds());

  const stepIndex = stepOrder.indexOf(currentStep);
  const sessionRounds = useMemo(
    () => rounds.filter((round) => selectedSession.roundIds.includes(round.id)),
    [selectedSession],
  );

  const generatedPrompt = useMemo(() => buildKacAiPrompt(selectedRound, draft), [draft, selectedRound]);
  const promptText = draft.editedPrompt || generatedPrompt;
  const parsedAiResult = useMemo(() => parseAiResult(draft.aiRawResult), [draft.aiRawResult]);
  const finalArtifact = draft.aiFinalArtifact || parsedAiResult.finalArtifact;
  const reviewNotes = draft.aiReviewNotes || parsedAiResult.reviewNotes;
  const isNextEnabled = currentStep === 'sessionMap'
    ? Boolean(selectedSession)
    : canMoveNext({ currentStep, draft, hasSelectedRound: Boolean(selectedRound), promptText });

  useEffect(() => {
    saveLearnerDraft({ selectedRoundId: selectedRound.id, currentStep, draft });
    setLastSavedAt(new Date().toISOString());
  }, [currentStep, draft, selectedRound.id]);

  function updateDraft<K extends keyof LearnerDraft>(key: K, value: LearnerDraft[K]) {
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

  function selectSession(nextSession: LearningSession) {
    setSelectedSession(nextSession);
    setSelectedRound(getFirstRoundInSession(nextSession));
    setDraft((prev) => createFreshRoundDraft(prev));
    setCopyStatus('idle');
  }

  function selectRound(nextRound: Round) {
    setSelectedRound(nextRound);
    setDraft((prev) => createFreshRoundDraft(prev));
    setCopyStatus('idle');
  }

  function handleSaveSuccess() {
    markRoundCompleted(selectedRound.id);
    setCompletedRoundIds(loadCompletedRoundIds());
  }

  function returnToRoundMap() {
    setDraft((prev) => createFreshRoundDraft(prev));
    setCopyStatus('idle');
    setCurrentStep('roundMap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setFinalLine(index: number, value: string) {
    setDraft((prev) => {
      const nextLines = createEmptyCoachingDialogueLines();
      prev.finalLines.forEach((line, lineIndex) => {
        if (lineIndex < nextLines.length) {
          nextLines[lineIndex] = line;
        }
      });
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
    clearCompletedRoundIds();
    setCompletedRoundIds([]);
    setSelectedSession(sessions[0]);
    setSelectedRound(rounds[0]);
    setCurrentStep('intro');
    setDraft({ ...initialLearnerDraft, finalLines: createEmptyCoachingDialogueLines() });
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
          <IntroStep
            draft={draft}
            canGoNext={isNextEnabled}
            onBack={goBack}
            onNext={goNext}
            onTeamNameChange={(value) => updateDraft('teamName', value)}
            onNicknameChange={(value) => updateDraft('nickname', value)}
          />
        );
      case 'sessionMap':
        return (
          <SessionMapStep
            sessions={sessions}
            selectedSession={selectedSession}
            canGoNext={isNextEnabled}
            onBack={handleResetParticipant}
            onNext={goNext}
            onSelectSession={selectSession}
          />
        );
      case 'roundMap':
        return (
          <RoundMapStep
            rounds={sessionRounds}
            selectedRound={selectedRound}
            completedRoundIds={completedRoundIds}
            canGoNext={isNextEnabled}
            onBack={goBack}
            onNext={goNext}
            onSelectRound={selectRound}
          />
        );
      case 'situation':
        return <StoryStep eyebrow="오늘의 장면" title={selectedRound.title} description={selectedRound.subtitle} story={selectedRound.situation} onBack={goBack} onNext={goNext} />;
      case 'juniorReading':
        return (
          <StepLayout eyebrow="후배 보기" title={`${selectedRound.juniorName} ${selectedRound.juniorRole}, 어떻게 보이나요?`} description="성격을 단정하지 말고, 실제로 보인 말과 행동을 기준으로 적어봅니다." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="signal-list">{selectedRound.juniorSignals.map((signal) => <p key={signal}>{signal}</p>)}</div>
            <TextInputPanel label="내 눈에 보인 모습" helper="예: 확신이 없으면 혼자 판단하기보다 먼저 확인하려는 모습으로 보인다." value={draft.juniorReading} placeholder="후배의 말과 행동을 한두 문장으로 적어 주세요." onChange={(value) => updateDraft('juniorReading', value)} />
          </StepLayout>
        );
      case 'firstDecision':
        return (
          <StepLayout eyebrow="첫 대응" title={selectedRound.firstQuestion} description="정답을 맞히는 화면이 아닙니다. 지금 내가 실제로 할 법한 말을 골라보세요." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="choice-stack">{selectedRound.firstChoices.map((choice) => <ChoiceCard key={choice.id} choice={choice} isSelected={draft.firstChoice === choice.id} onSelect={(choiceId) => updateDraft('firstChoice', choiceId)} />)}</div>
            <TextInputPanel label="왜 그렇게 말하려고 하나요?" helper="지금 상황에서 이 선택이 더 낫다고 본 이유를 적어 주세요." value={draft.firstReason} placeholder="내 선택 이유를 적어 주세요." onChange={(value) => updateDraft('firstReason', value)} />
          </StepLayout>
        );
      case 'firstResult':
        return <StoryStep eyebrow="선택 뒤 장면" title="이 선택이 남긴 장면입니다" description="일은 조금 풀릴 수 있지만, 다른 부담이 남을 수도 있습니다." story={draft.firstChoice ? selectedRound.firstResultByChoice[draft.firstChoice] : '아직 선택한 내용이 없습니다.'} isEmphasis onBack={goBack} onNext={goNext} />;
      case 'juniorReaction':
        return <StoryStep eyebrow="후배의 다음 말" title="후배가 이렇게 받아들입니다" description="후배의 말 속에 다음에 도와줄 지점이 숨어 있습니다." story={selectedRound.juniorReaction} onBack={goBack} onNext={goNext} />;
      case 'dilemmaAnalysis':
        return (
          <StepLayout eyebrow="걸리는 지점" title="지금 어디서 막히나요?" description={selectedRound.dilemmaPrompt} canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="signal-list">{selectedRound.dilemmaHints.map((hint) => <p key={hint}>{hint}</p>)}</div>
            <TextInputPanel label="내가 지금 고민하는 지점" helper="예: 바로 답을 주면 일은 빨리 끝나지만, 다음에도 김원중 과장의 답을 기다릴 수 있다." value={draft.dilemma} placeholder="지금 걸리는 지점을 적어 주세요." onChange={(value) => updateDraft('dilemma', value)} />
          </StepLayout>
        );
      case 'secondDecision':
        return (
          <StepLayout eyebrow="판단 보완" title={selectedRound.secondQuestion} description="후배의 반응을 보고, 처음 판단에 무엇을 보완할지 정리합니다." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="choice-stack">{selectedRound.secondChoices.map((choice) => <button key={choice.id} type="button" className={`direction-card ${draft.secondChoice === choice.id ? 'selected' : ''}`} onClick={() => updateDraft('secondChoice', choice.id)}><strong>{choice.label}</strong><span>{choice.description}</span></button>)}</div>
          </StepLayout>
        );
      case 'additionalSituation':
        return <StoryStep eyebrow="일이 한 번 더 꼬입니다" title="현장은 한 번 더 흔들립니다" description="새로 생긴 상황까지 보고, 앞으로 2주 동안 어떻게 도와줄지 정합니다." story={selectedRound.additionalSituation} onBack={goBack} onNext={goNext} />;
      case 'developmentDirection':
        return (
          <StepLayout eyebrow="2주 도움 고르기" title="앞으로 2주, 무엇을 도와줄까요?" description="후배가 조금 달라질 수 있는 작은 도움을 하나 골라봅니다." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={() => { if (!draft.editedPrompt) updateDraft('editedPrompt', generatedPrompt); setCopyStatus('idle'); goNext(); }}>
            <div className="choice-stack">{selectedRound.developmentDirections.map((direction) => <button key={direction.id} type="button" className={`direction-card ${draft.directionId === direction.id ? 'selected' : ''}`} onClick={() => updateDraft('directionId', direction.id)}><strong>{direction.title}</strong><span>{direction.description}</span><small>조심할 점: {direction.watchOut}</small></button>)}</div>
          </StepLayout>
        );
      case 'aiPrompt':
        return (
          <AiPromptStep
            canGoNext={isNextEnabled}
            promptText={promptText}
            copyStatus={copyStatus}
            onBack={goBack}
            onNext={goNext}
            onCopyPrompt={handleCopyPrompt}
            onPromptChange={(value) => { updateDraft('editedPrompt', value); setCopyStatus('idle'); }}
          />
        );
      case 'aiAnswerReview':
        return (
          <AiAnswerReviewStep
            canGoNext={isNextEnabled}
            aiRawResult={draft.aiRawResult}
            finalArtifact={finalArtifact}
            reviewNotes={reviewNotes}
            aiUseAsIs={draft.aiUseAsIs}
            aiRevise={draft.aiRevise}
            aiRisky={draft.aiRisky}
            onBack={goBack}
            onNext={goNext}
            onRawResultChange={updateAiRawResult}
            onUseAsIsChange={(value) => updateDraft('aiUseAsIs', value)}
            onReviseChange={(value) => updateDraft('aiRevise', value)}
            onRiskyChange={(value) => updateDraft('aiRisky', value)}
          />
        );
      case 'twoWeekPlan':
        return (
          <TwoWeekPlanStep
            round={selectedRound}
            canGoNext={isNextEnabled}
            finalArtifact={finalArtifact}
            growthGoal={draft.growthGoal}
            twoWeekTask={draft.twoWeekTask}
            leaderSupport={draft.leaderSupport}
            onBack={goBack}
            onNext={goNext}
            onGrowthGoalChange={(value) => updateDraft('growthGoal', value)}
            onTwoWeekTaskChange={(value) => updateDraft('twoWeekTask', value)}
            onLeaderSupportChange={(value) => updateDraft('leaderSupport', value)}
          />
        );
      case 'finalFiveLines':
        return (
          <FinalFiveLinesStep
            round={selectedRound}
            canGoNext={isNextEnabled}
            finalArtifact={finalArtifact}
            finalLines={draft.finalLines}
            onBack={goBack}
            onNext={goNext}
            onFinalLineChange={setFinalLine}
          />
        );
      case 'result':
      default:
        return (
          <StepLayout eyebrow="저장" title="오늘 정리한 내용이 준비됐습니다" description="저장 버튼을 누르면 강사용 화면에서 함께 확인할 수 있습니다." canGoBack canGoNext={false} onBack={goBack} onNext={goNext}>
            <SaveResultPanel round={selectedRound} draft={draft} generatedPrompt={generatedPrompt} promptText={promptText} onSaveSuccess={handleSaveSuccess} onStartOver={returnToRoundMap} />
          </StepLayout>
        );
    }
  }

  const roundHeaderTitle = currentStep === 'intro' || currentStep === 'sessionMap' || currentStep === 'roundMap'
    ? undefined
    : getRoundDisplayTitle(selectedRound);

  return (
    <div className="mobile-learner-shell">
      <ProgressHeader currentStep={currentStep} roundTitle={roundHeaderTitle} />
      {renderSaveIndicator()}
      {renderStep()}
    </div>
  );
}
