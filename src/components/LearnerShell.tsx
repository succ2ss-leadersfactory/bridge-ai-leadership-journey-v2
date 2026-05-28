import { useEffect, useMemo, useState } from 'react';
import { createEmptyCoachingDialogueLines } from '../data/coachingDialogueConfig';
import { flowSteps } from '../data/flowSteps';
import { rounds } from '../data/normalizedRounds';
import { sessions } from '../data/sessions';
import { copyTextToClipboard } from '../lib/clipboard';
import { parseAiResult } from '../lib/aiResultParser';
import { buildKacAiPrompt } from '../lib/promptBuilder';
import { getRoundDisplayTitle } from '../lib/roundDisplay';
import { getFirstRoundInSession, getRoundsForSession } from '../lib/roundSelectors';
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

function getSelectedJudgmentSummary(round: Round, secondChoiceId: string) {
  const selected = round.secondChoices.find((choice) => choice.id === secondChoiceId);
  if (!selected) return '';
  return `${selected.label}\n${selected.description}`;
}

function getSelectedDirectionSummary(round: Round, directionId: string) {
  const selected = round.developmentDirections.find((direction) => direction.id === directionId);
  if (!selected) return '';
  return `${selected.title}\n왜 필요한가: ${selected.description}\n어디에 쓸 수 있나: ${selected.bestWhen}\n조심할 점: ${selected.watchOut}`;
}

function keepExistingOrFill(currentValue: string, parsedValue: string) {
  return currentValue.trim().length > 0 ? currentValue : parsedValue;
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
    () => getRoundsForSession(rounds, selectedSession),
    [selectedSession],
  );

  const generatedPrompt = useMemo(() => buildKacAiPrompt(selectedRound, draft), [draft, selectedRound]);
  const promptText = draft.editedPrompt || generatedPrompt;
  const parsedAiResult = useMemo(() => parseAiResult(draft.aiRawResult), [draft.aiRawResult]);
  const finalArtifact = draft.aiFinalArtifact || parsedAiResult.finalArtifact;
  const reviewNotes = draft.aiReviewNotes || parsedAiResult.reviewNotes;
  const judgmentSummary = useMemo(
    () => getSelectedJudgmentSummary(selectedRound, draft.secondChoice),
    [draft.secondChoice, selectedRound],
  );
  const directionSummary = useMemo(
    () => getSelectedDirectionSummary(selectedRound, draft.directionId),
    [draft.directionId, selectedRound],
  );
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
    const fields = parsed.fields;

    setDraft((prev) => {
      const nextLines = createEmptyCoachingDialogueLines();
      prev.finalLines.forEach((line, lineIndex) => {
        if (lineIndex < nextLines.length) {
          nextLines[lineIndex] = keepExistingOrFill(line, fields.finalLines[lineIndex] ?? '');
        }
      });

      return {
        ...prev,
        aiRawResult: value,
        aiFinalArtifact: parsed.finalArtifact,
        aiReviewNotes: parsed.reviewNotes,
        growthGoal: keepExistingOrFill(prev.growthGoal, fields.growthGoal),
        twoWeekTask: keepExistingOrFill(prev.twoWeekTask, fields.twoWeekTask),
        leaderSupport: keepExistingOrFill(prev.leaderSupport, fields.leaderSupport),
        finalLines: nextLines,
      };
    });
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
    setSelectedRound(getFirstRoundInSession(rounds, nextSession));
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
        return <StoryStep eyebrow="지금 벌어진 일" title={selectedRound.title} description={selectedRound.subtitle} story={selectedRound.situation} onBack={goBack} onNext={goNext} />;
      case 'juniorReading':
        return (
          <StepLayout eyebrow="후배를 제대로 읽기" title={`${selectedRound.juniorName} ${selectedRound.juniorRole}, 무엇이 보이나요?`} description="성격이나 태도로 단정하지 말고, 실제로 보인 말과 행동을 기준으로 적어봅니다." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="signal-list">{selectedRound.juniorSignals.map((signal) => <p key={signal}>{signal}</p>)}</div>
            <TextInputPanel label="내 눈에 보인 모습" helper="예: 확신이 없으면 혼자 판단하기보다 먼저 확인하려는 모습으로 보인다." value={draft.juniorReading} placeholder="후배의 말과 행동을 한두 문장으로 적어 주세요." onChange={(value) => updateDraft('juniorReading', value)} />
          </StepLayout>
        );
      case 'firstDecision':
        return (
          <StepLayout eyebrow="김원중 과장의 첫마디" title={selectedRound.firstQuestion} description="정답을 맞히는 화면이 아닙니다. 지금 내가 실제로 할 법한 첫 대응을 골라보세요." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="choice-stack">{selectedRound.firstChoices.map((choice) => <ChoiceCard key={choice.id} choice={choice} isSelected={draft.firstChoice === choice.id} onSelect={(choiceId) => updateDraft('firstChoice', choiceId)} />)}</div>
            <TextInputPanel label="왜 그렇게 말하려고 하나요?" helper="지금 상황에서 이 선택이 더 낫다고 본 이유를 적어 주세요." value={draft.firstReason} placeholder="내 선택 이유를 적어 주세요." onChange={(value) => updateDraft('firstReason', value)} />
          </StepLayout>
        );
      case 'firstResult':
        return <StoryStep eyebrow="그 선택이 만든 변화" title="이 선택 뒤에 남는 장면입니다" description="일은 조금 풀릴 수 있지만, 다른 부담이 남을 수도 있습니다." story={draft.firstChoice ? selectedRound.firstResultByChoice[draft.firstChoice] : '아직 선택한 내용이 없습니다.'} isEmphasis onBack={goBack} onNext={goNext} />;
      case 'juniorReaction':
        return <StoryStep eyebrow="후배가 이렇게 받아들입니다" title="후배의 다음 말" description="후배의 말 속에 다음에 도와줄 지점이 숨어 있습니다." story={selectedRound.juniorReaction} onBack={goBack} onNext={goNext} />;
      case 'additionalSituation':
        return <StoryStep eyebrow="그런데, 일이 조금 달라집니다" title="처음 판단의 비용이 보이기 시작합니다" description="방금 선택이 틀렸다는 뜻은 아닙니다. 다만 새로 들어온 말, 일정, 표정, 압박 때문에 그대로 가도 되는지 다시 봐야 합니다." story={selectedRound.additionalSituation} onBack={goBack} onNext={goNext} />;
      case 'dilemmaAnalysis':
        return (
          <StepLayout eyebrow="다시 보면 걸리는 지점" title="처음 판단, 그대로 가도 괜찮을까요?" description={selectedRound.dilemmaPrompt} canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="signal-list">{selectedRound.dilemmaHints.map((hint) => <p key={hint}>{hint}</p>)}</div>
            <TextInputPanel label="새 상황을 보고 걸리는 지점" helper="예: 처음 대응이 틀린 것은 아니지만, 새로 생긴 압박 때문에 후배에게 다르게 들릴 수 있다." value={draft.dilemma} placeholder="처음 판단에서 다시 봐야 할 지점을 적어 주세요." onChange={(value) => updateDraft('dilemma', value)} />
          </StepLayout>
        );
      case 'secondDecision':
        return (
          <StepLayout eyebrow="판단을 다시 잡기" title={selectedRound.secondQuestion} description="새로 생긴 변수까지 보고, 처음 판단을 유지할지, 조금 고칠지, 방향을 바꿀지 정합니다." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={goNext}>
            <div className="choice-stack">{selectedRound.secondChoices.map((choice) => <button key={choice.id} type="button" className={`direction-card ${draft.secondChoice === choice.id ? 'selected' : ''}`} onClick={() => updateDraft('secondChoice', choice.id)}><strong>{choice.label}</strong><span>{choice.description}</span></button>)}</div>
          </StepLayout>
        );
      case 'developmentDirection':
        return (
          <StepLayout eyebrow="키울 것을 하나로 잡기" title="앞으로 2주, 이 후배에게 무엇을 남길까요?" description="좋은 말보다 중요한 건 다음 행동입니다. 김원중 과장이 이 후배에게 남길 작은 약속을 하나 고르세요." canGoBack canGoNext={isNextEnabled} onBack={goBack} onNext={() => { if (!draft.editedPrompt) updateDraft('editedPrompt', generatedPrompt); setCopyStatus('idle'); goNext(); }}>
            <div className="choice-stack">
              {selectedRound.developmentDirections.map((direction) => (
                <button key={direction.id} type="button" className={`direction-card ${draft.directionId === direction.id ? 'selected' : ''}`} onClick={() => updateDraft('directionId', direction.id)}>
                  <strong>{direction.title}</strong>
                  <span><b>왜 필요한가</b><br />{direction.description}</span>
                  <span><b>어디에 쓸 수 있나</b><br />{direction.bestWhen}</span>
                  <small><b>조심할 점</b><br />{direction.watchOut}</small>
                </button>
              ))}
            </div>
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
            judgmentSummary={judgmentSummary}
            directionSummary={directionSummary}
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
            directionSummary={directionSummary}
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
            directionSummary={directionSummary}
            finalLines={draft.finalLines}
            onBack={goBack}
            onNext={goNext}
            onFinalLineChange={setFinalLine}
          />
        );
      case 'result':
      default:
        return (
          <StepLayout eyebrow="나의 코칭 대화문" title="오늘 정리한 내용이 준비됐습니다" description="저장 버튼을 누르면 강사용 화면에서 함께 확인할 수 있습니다." canGoBack canGoNext={false} onBack={goBack} onNext={goNext}>
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
