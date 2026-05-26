import { useEffect, useMemo, useState } from 'react';
import { flowSteps } from '../data/flowSteps';
import { rounds } from '../data/rounds';
import { copyTextToClipboard } from '../lib/clipboard';
import { clearLearnerDraft, loadLearnerDraft, saveLearnerDraft } from '../lib/localDraft';
import type { ChoiceId, FlowStepId, Round } from '../types';
import { ChoiceCard } from './ChoiceCard';
import { ProgressHeader } from './ProgressHeader';
import { RoundCard } from './RoundCard';
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

export function LearnerShell() {
  const savedDraft = getInitialSavedDraft();
  const [selectedRound, setSelectedRound] = useState<Round>(() => findRoundById(savedDraft?.selectedRoundId));
  const [currentStep, setCurrentStep] = useState<FlowStepId>(() => savedDraft?.currentStep ?? 'intro');
  const [draft, setDraft] = useState<DraftState>(() => savedDraft?.draft ?? initialDraft);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => savedDraft?.savedAt ?? null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const stepIndex = stepOrder.indexOf(currentStep);
  const selectedChoice = selectedRound.firstChoices.find((choice) => choice.id === draft.firstChoice);
  const selectedDirection = selectedRound.developmentDirections.find((direction) => direction.id === draft.directionId);

  const generatedPrompt = useMemo(() => {
    const directionText = selectedDirection
      ? `\n선택한 육성 방향: ${selectedDirection.title} - ${selectedDirection.description}`
      : '';
    const firstChoiceText = selectedChoice
      ? `\n1차 판단: ${selectedChoice.label}\n선택 이유: ${draft.firstReason || '아직 작성하지 않음'}`
      : '';
    return `${selectedRound.aiPromptTemplate}${firstChoiceText}${directionText}`;
  }, [draft.firstReason, selectedChoice, selectedDirection, selectedRound]);

  const promptText = draft.editedPrompt || generatedPrompt;

  useEffect(() => {
    saveLearnerDraft({
      selectedRoundId: selectedRound.id,
      currentStep,
      draft,
    });
    setLastSavedAt(new Date().toISOString());
  }, [currentStep, draft, selectedRound.id]);

  function updateDraft<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    const next = stepOrder[Math.min(stepIndex + 1, stepOrder.length - 1)];
    setCurrentStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    const prev = stepOrder[Math.max(stepIndex - 1, 0)];
    setCurrentStep(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function canGoNext() {
    if (currentStep === 'intro') return draft.teamName.trim().length > 0 && draft.nickname.trim().length > 0;
    if (currentStep === 'juniorReading') return draft.juniorReading.trim().length > 0;
    if (currentStep === 'firstDecision') return draft.firstChoice !== '' && draft.firstReason.trim().length > 0;
    if (currentStep === 'dilemmaAnalysis') return draft.dilemma.trim().length > 0;
    if (currentStep === 'secondDecision') return draft.secondChoice !== '';
    if (currentStep === 'developmentDirection') return draft.directionId !== '';
    if (currentStep === 'aiPrompt') return promptText.trim().length > 0;
    if (currentStep === 'aiAnswerReview') {
      return draft.aiUseAsIs.trim().length > 0 || draft.aiRevise.trim().length > 0 || draft.aiRisky.trim().length > 0;
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

  function handleStartOver() {
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
          <StepLayout
            eyebrow="입장"
            title="스마트폰으로 후배 육성 Lab을 시작합니다"
            description="팀명과 닉네임을 입력한 뒤, 오늘 다룰 라운드를 선택해 주세요. 입력 내용은 스마트폰에 먼저 임시 저장됩니다."
            canGoBack={false}
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
            nextLabel="시작하기"
          >
            <div className="form-stack">
              <TextInputPanel
                label="팀명"
                helper="강사용 대시보드에서 팀별 진행을 보기 위한 정보입니다."
                value={draft.teamName}
                placeholder="예: 3팀"
                minRows={2}
                onChange={(value) => updateDraft('teamName', value)}
              />
              <TextInputPanel
                label="닉네임"
                helper="실명 대신 교육장에서 사용할 이름을 적어 주세요."
                value={draft.nickname}
                placeholder="예: 브릿지과장"
                minRows={2}
                onChange={(value) => updateDraft('nickname', value)}
              />
            </div>
            <div className="round-list">
              {rounds.map((round) => (
                <RoundCard
                  key={round.id}
                  round={round}
                  isSelected={round.id === selectedRound.id}
                  onSelect={(nextRound) => {
                    setSelectedRound(nextRound);
                    setCopyStatus('idle');
                  }}
                />
              ))}
            </div>
          </StepLayout>
        );
      case 'situation':
        return (
          <StepLayout
            eyebrow="상황 읽기"
            title={selectedRound.title}
            description={selectedRound.subtitle}
            canGoBack
            canGoNext
            onBack={goBack}
            onNext={goNext}
          >
            <article className="story-card">{selectedRound.situation}</article>
          </StepLayout>
        );
      case 'juniorReading':
        return (
          <StepLayout
            eyebrow="후배 행동 읽기"
            title={`${selectedRound.juniorName} ${selectedRound.juniorRole}을 어떻게 읽겠습니까?`}
            description="후배를 낙인찍지 말고, 관찰 가능한 행동 신호로 정리해 보세요."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
          >
            <div className="signal-list">
              {selectedRound.juniorSignals.map((signal) => (
                <p key={signal}>{signal}</p>
              ))}
            </div>
            <TextInputPanel
              label="내가 읽은 후배 행동 패턴"
              helper="예: 불확실할 때 확인 욕구가 커지는 모습으로 보인다."
              value={draft.juniorReading}
              placeholder="후배의 행동을 한두 문장으로 적어 주세요."
              onChange={(value) => updateDraft('juniorReading', value)}
            />
          </StepLayout>
        );
      case 'firstDecision':
        return (
          <StepLayout
            eyebrow="1차 육성 판단"
            title={selectedRound.firstQuestion}
            description="정답을 고르는 화면이 아닙니다. 선택의 장점과 주의할 점을 함께 보고 결정해 주세요."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
          >
            <div className="choice-stack">
              {selectedRound.firstChoices.map((choice) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  isSelected={draft.firstChoice === choice.id}
                  onSelect={(choiceId) => updateDraft('firstChoice', choiceId)}
                />
              ))}
            </div>
            <TextInputPanel
              label="선택 이유"
              helper="왜 이 선택이 지금 상황에 더 맞다고 보았는지 적어 주세요."
              value={draft.firstReason}
              placeholder="내 선택 이유를 적어 주세요."
              onChange={(value) => updateDraft('firstReason', value)}
            />
          </StepLayout>
        );
      case 'firstResult':
        return (
          <StepLayout
            eyebrow="선택 결과"
            title="내 선택이 남기는 장면"
            description="선택은 늘 효과와 비용을 함께 남깁니다."
            canGoBack
            canGoNext
            onBack={goBack}
            onNext={goNext}
          >
            <article className="story-card emphasis">
              {draft.firstChoice ? selectedRound.firstResultByChoice[draft.firstChoice] : '선택 결과가 없습니다.'}
            </article>
          </StepLayout>
        );
      case 'juniorReaction':
        return (
          <StepLayout
            eyebrow="후배 반응"
            title="후배의 다음 신호를 읽어봅니다"
            description="후배의 말 속에 다음 육성 포인트가 숨어 있습니다."
            canGoBack
            canGoNext
            onBack={goBack}
            onNext={goNext}
          >
            <article className="story-card">{selectedRound.juniorReaction}</article>
          </StepLayout>
        );
      case 'dilemmaAnalysis':
        return (
          <StepLayout
            eyebrow="육성 딜레마 분석"
            title="지금 충돌하는 것은 무엇입니까?"
            description={selectedRound.dilemmaPrompt}
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
          >
            <div className="signal-list">
              {selectedRound.dilemmaHints.map((hint) => (
                <p key={hint}>{hint}</p>
              ))}
            </div>
            <TextInputPanel
              label="내가 정리한 딜레마"
              helper="예: 빠른 수습과 후배의 판단 기준 형성 사이에서 갈등한다."
              value={draft.dilemma}
              placeholder="핵심 딜레마를 적어 주세요."
              onChange={(value) => updateDraft('dilemma', value)}
            />
          </StepLayout>
        );
      case 'secondDecision':
        return (
          <StepLayout
            eyebrow="다시 판단"
            title={selectedRound.secondQuestion}
            description="처음 판단을 그대로 밀고 갈 수도 있고, 일부 보완하거나 바꿀 수도 있습니다."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
          >
            <div className="choice-stack">
              {selectedRound.secondChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={`direction-card ${draft.secondChoice === choice.id ? 'selected' : ''}`}
                  onClick={() => updateDraft('secondChoice', choice.id)}
                >
                  <strong>{choice.label}</strong>
                  <span>{choice.description}</span>
                </button>
              ))}
            </div>
          </StepLayout>
        );
      case 'additionalSituation':
        return (
          <StepLayout
            eyebrow="추가 상황"
            title="현장은 한 번 더 흔들립니다"
            description="새로운 신호를 보고 최종 육성 방향을 준비합니다."
            canGoBack
            canGoNext
            onBack={goBack}
            onNext={goNext}
          >
            <article className="story-card">{selectedRound.additionalSituation}</article>
          </StepLayout>
        );
      case 'developmentDirection':
        return (
          <StepLayout
            eyebrow="육성 방향 선택"
            title="2주 동안 무엇을 키우겠습니까?"
            description="후배에게 맞는 작은 성장 경험을 선택해 주세요."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={() => {
              if (!draft.editedPrompt) updateDraft('editedPrompt', generatedPrompt);
              setCopyStatus('idle');
              goNext();
            }}
          >
            <div className="choice-stack">
              {selectedRound.developmentDirections.map((direction) => (
                <button
                  key={direction.id}
                  type="button"
                  className={`direction-card ${draft.directionId === direction.id ? 'selected' : ''}`}
                  onClick={() => updateDraft('directionId', direction.id)}
                >
                  <strong>{direction.title}</strong>
                  <span>{direction.description}</span>
                  <small>주의: {direction.watchOut}</small>
                </button>
              ))}
            </div>
          </StepLayout>
        );
      case 'aiPrompt':
        return (
          <StepLayout
            eyebrow="AI 프롬프트 수정 후 복사"
            title="AI에게 그대로 맡기지 말고, 먼저 내가 고칩니다"
            description="자동 생성된 프롬프트를 읽고 현장 맥락에 맞게 수정한 뒤 복사해 외부 AI에 붙여 넣습니다."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
            nextLabel="AI 답변 검토로 이동"
          >
            <div className="copy-panel">
              <p>수정한 프롬프트를 복사한 뒤 GPT, Gemini, Claude 등에 붙여 넣어 답변을 받아보세요.</p>
              <button type="button" className="copy-button" onClick={handleCopyPrompt}>
                프롬프트 복사하기
              </button>
              {copyStatus === 'success' ? <span className="copy-status success">복사되었습니다.</span> : null}
              {copyStatus === 'fail' ? <span className="copy-status fail">복사에 실패했습니다. 길게 눌러 직접 복사해 주세요.</span> : null}
            </div>
            <TextInputPanel
              label="수정 가능한 AI 프롬프트"
              helper="민감 정보, 실명 고객 정보, 내부 전략 수치가 들어가지 않았는지 확인해 주세요."
              value={promptText}
              placeholder="AI 프롬프트를 수정해 주세요."
              minRows={10}
              onChange={(value) => {
                updateDraft('editedPrompt', value);
                setCopyStatus('idle');
              }}
            />
          </StepLayout>
        );
      case 'aiAnswerReview':
        return (
          <StepLayout
            eyebrow="AI 답변 골라보기"
            title="AI 답변을 그대로 쓰지 않고 나눠 봅니다"
            description="AI 결과 중 참고할 것, 고칠 것, 조심할 것을 구분합니다."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
          >
            <TextInputPanel
              label="그대로 참고해도 되는 부분"
              helper="현장 맥락과 맞는 제안을 적습니다."
              value={draft.aiUseAsIs}
              placeholder="AI 답변 중 그대로 참고할 부분"
              onChange={(value) => updateDraft('aiUseAsIs', value)}
            />
            <TextInputPanel
              label="고쳐야 하는 부분"
              helper="말투, 강도, 타이밍, 역할 범위를 조정할 부분입니다."
              value={draft.aiRevise}
              placeholder="현장에 맞게 수정할 부분"
              onChange={(value) => updateDraft('aiRevise', value)}
            />
            <TextInputPanel
              label="조심해야 하는 부분"
              helper="후배 낙인, 과도한 책임 전가, 조직 맥락과 맞지 않는 부분입니다."
              value={draft.aiRisky}
              placeholder="조심할 부분"
              onChange={(value) => updateDraft('aiRisky', value)}
            />
          </StepLayout>
        );
      case 'twoWeekPlan':
        return (
          <StepLayout
            eyebrow="2주 미니 육성 플랜"
            title={selectedRound.finalOutput}
            description="거창한 계획보다 2주 안에 실제로 해볼 수 있는 작고 분명한 행동으로 씁니다."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
          >
            <TextInputPanel label="성장 목표" helper="후배가 2주 뒤 무엇을 조금 더 잘하게 될까요?" value={draft.growthGoal} placeholder={selectedRound.twoWeekPlanGuide.growthGoalPlaceholder} onChange={(value) => updateDraft('growthGoal', value)} />
            <TextInputPanel label="작은 과제" helper="후배에게 맡길 작고 구체적인 과제입니다." value={draft.twoWeekTask} placeholder={selectedRound.twoWeekPlanGuide.taskPlaceholder} onChange={(value) => updateDraft('twoWeekTask', value)} />
            <TextInputPanel label="과장의 지원" helper="과장이 대신 해주는 것이 아니라, 성장하도록 받쳐주는 방식입니다." value={draft.leaderSupport} placeholder={selectedRound.twoWeekPlanGuide.supportPlaceholder} onChange={(value) => updateDraft('leaderSupport', value)} />
            <TextInputPanel label="점검 시점" helper="언제, 얼마나 짧게 확인할지 정합니다." value={draft.checkTiming} placeholder={selectedRound.twoWeekPlanGuide.checkTimingPlaceholder} onChange={(value) => updateDraft('checkTiming', value)} />
            <TextInputPanel label="주의할 점" helper="후배가 위축되거나 오해하지 않도록 조심할 표현입니다." value={draft.watchOut} placeholder={selectedRound.twoWeekPlanGuide.watchOutPlaceholder} onChange={(value) => updateDraft('watchOut', value)} />
          </StepLayout>
        );
      case 'finalFiveLines':
        return (
          <StepLayout
            eyebrow="5줄 현장 실행문"
            title="내일 바로 말할 문장으로 바꿉니다"
            description="계획을 후배에게 실제로 말할 수 있는 5줄로 정리해 주세요."
            canGoBack
            canGoNext={canGoNext()}
            onBack={goBack}
            onNext={goNext}
            nextLabel="결과 보기"
          >
            {selectedRound.finalFiveLineGuide.map((guide, index) => (
              <TextInputPanel
                key={guide}
                label={`${index + 1}번째 문장`}
                helper={guide}
                value={draft.finalLines[index]}
                placeholder="한 문장으로 적어 주세요."
                minRows={3}
                onChange={(value) => setFinalLine(index, value)}
              />
            ))}
          </StepLayout>
        );
      case 'result':
      default:
        return (
          <StepLayout
            eyebrow="결과"
            title="작성한 육성 플랜이 준비되었습니다"
            description="현재 내용은 스마트폰에 임시 저장되어 있습니다. 다음 단계에서 Google Sheets 저장과 연결합니다."
            canGoBack
            canGoNext={false}
            onBack={goBack}
            onNext={goNext}
          >
            <article className="result-card">
              <h3>{selectedRound.finalOutput}</h3>
              <p><strong>성장 목표</strong><br />{draft.growthGoal}</p>
              <p><strong>작은 과제</strong><br />{draft.twoWeekTask}</p>
              <p><strong>과장의 지원</strong><br />{draft.leaderSupport}</p>
              <p><strong>점검 시점</strong><br />{draft.checkTiming}</p>
              <p><strong>주의할 점</strong><br />{draft.watchOut}</p>
              <ol>
                {draft.finalLines.map((line, index) => (
                  <li key={`${line}-${index}`}>{line}</li>
                ))}
              </ol>
              <button type="button" className="restart-button" onClick={handleStartOver}>
                새 라운드로 다시 시작
              </button>
            </article>
          </StepLayout>
        );
    }
  }

  return (
    <div className="mobile-learner-shell">
      <ProgressHeader currentStep={currentStep} roundTitle={currentStep === 'intro' ? undefined : selectedRound.title} />
      {renderSaveIndicator()}
      {renderStep()}
    </div>
  );
}
