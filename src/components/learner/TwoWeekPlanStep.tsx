import type { Round } from '../../types';
import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

interface TwoWeekPlanStepProps {
  round: Round;
  canGoNext: boolean;
  finalArtifact: string;
  directionSummary: string;
  growthGoal: string;
  twoWeekTask: string;
  leaderSupport: string;
  checkTiming: string;
  watchOut: string;
  onBack: () => void;
  onNext: () => void;
  onGrowthGoalChange: (value: string) => void;
  onTwoWeekTaskChange: (value: string) => void;
  onLeaderSupportChange: (value: string) => void;
  onCheckTimingChange: (value: string) => void;
  onWatchOutChange: (value: string) => void;
}

export function TwoWeekPlanStep({
  round,
  canGoNext,
  finalArtifact,
  directionSummary,
  growthGoal,
  twoWeekTask,
  leaderSupport,
  checkTiming,
  watchOut,
  onBack,
  onNext,
  onGrowthGoalChange,
  onTwoWeekTaskChange,
  onLeaderSupportChange,
  onCheckTimingChange,
  onWatchOutChange,
}: TwoWeekPlanStepProps) {
  return (
    <StepLayout
      eyebrow="2주 실행안"
      title={round.finalOutput}
      description="AI가 나눠 넣은 초안을 실제로 해볼 수 있는 작은 행동으로 고쳐 봅니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
    >
      <article className="ai-artifact-card compact">
        <h3>방금 고른 약속</h3>
        <p>{directionSummary || '아직 선택한 약속이 없습니다.'}</p>
      </article>
      {finalArtifact ? (
        <article className="ai-artifact-card compact">
          <h3>AI 참고안</h3>
          <pre>{finalArtifact}</pre>
        </article>
      ) : null}
      <TextInputPanel
        label="2주 뒤 보고 싶은 작은 변화"
        helper="사람을 바꾸겠다는 목표보다, 눈에 보이는 행동 변화로 적습니다."
        value={growthGoal}
        placeholder={round.twoWeekPlanGuide.growthGoalPlaceholder}
        onChange={onGrowthGoalChange}
      />
      <TextInputPanel
        label="이번 주 맡겨볼 작은 일"
        helper="회의, 자료, 메신저에서 바로 해볼 수 있는 일로 줄여 봅니다."
        value={twoWeekTask}
        placeholder={round.twoWeekPlanGuide.taskPlaceholder}
        onChange={onTwoWeekTaskChange}
      />
      <TextInputPanel
        label="김원중 과장이 도와줄 방식"
        helper="처음에 볼 것, 중간에 확인할 것, 마지막에 맡길 것을 나눠 봅니다."
        value={leaderSupport}
        placeholder={round.twoWeekPlanGuide.supportPlaceholder}
        minRows={4}
        onChange={onLeaderSupportChange}
      />
      <TextInputPanel
        label="언제 짧게 같이 볼지"
        helper="후배가 혼자 해볼 시간과 과장이 같이 볼 시간을 정합니다."
        value={checkTiming}
        placeholder={round.twoWeekPlanGuide.checkTimingPlaceholder}
        onChange={onCheckTimingChange}
      />
      <TextInputPanel
        label="말할 때 조심할 표현"
        helper="후배가 오해하거나 방어적으로 들을 수 있는 표현을 미리 걸러냅니다."
        value={watchOut}
        placeholder={round.twoWeekPlanGuide.watchOutPlaceholder}
        onChange={onWatchOutChange}
      />
    </StepLayout>
  );
}
