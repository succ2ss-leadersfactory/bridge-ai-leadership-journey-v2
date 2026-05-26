import type { Round } from '../../types';
import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

interface TwoWeekPlanStepProps {
  round: Round;
  canGoNext: boolean;
  finalArtifact: string;
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
      eyebrow="2주 동안 해볼 일"
      title={round.finalOutput}
      description="AI 초안은 참고만 하고, 실제로 할 일은 과장님의 말로 다시 정리합니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
    >
      {finalArtifact ? (
        <article className="ai-artifact-card compact">
          <h3>참고할 AI 초안</h3>
          <pre>{finalArtifact}</pre>
        </article>
      ) : null}
      <TextInputPanel label="2주 뒤 달라졌으면 하는 모습" helper="후배가 무엇을 조금 더 잘하게 되면 좋을까요?" value={growthGoal} placeholder={round.twoWeekPlanGuide.growthGoalPlaceholder} onChange={onGrowthGoalChange} />
      <TextInputPanel label="이번 주에 맡겨볼 작은 일" helper="후배에게 실제로 맡길 수 있는 작고 분명한 일입니다." value={twoWeekTask} placeholder={round.twoWeekPlanGuide.taskPlaceholder} onChange={onTwoWeekTaskChange} />
      <TextInputPanel label="내가 옆에서 도와줄 일" helper="대신 해주는 것이 아니라, 해볼 수 있게 받쳐주는 일입니다." value={leaderSupport} placeholder={round.twoWeekPlanGuide.supportPlaceholder} onChange={onLeaderSupportChange} />
      <TextInputPanel label="언제 짧게 같이 볼지" helper="언제, 얼마나 짧게 확인할지 정합니다." value={checkTiming} placeholder={round.twoWeekPlanGuide.checkTimingPlaceholder} onChange={onCheckTimingChange} />
      <TextInputPanel label="말할 때 조심할 표현" helper="후배가 위축되거나 오해하지 않게 조심할 말입니다." value={watchOut} placeholder={round.twoWeekPlanGuide.watchOutPlaceholder} onChange={onWatchOutChange} />
    </StepLayout>
  );
}
