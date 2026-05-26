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
  onBack: () => void;
  onNext: () => void;
  onGrowthGoalChange: (value: string) => void;
  onTwoWeekTaskChange: (value: string) => void;
  onLeaderSupportChange: (value: string) => void;
}

export function TwoWeekPlanStep({
  round,
  canGoNext,
  finalArtifact,
  growthGoal,
  twoWeekTask,
  leaderSupport,
  onBack,
  onNext,
  onGrowthGoalChange,
  onTwoWeekTaskChange,
  onLeaderSupportChange,
}: TwoWeekPlanStepProps) {
  return (
    <StepLayout
      eyebrow="2주 실행안"
      title={round.finalOutput}
      description="후배에게 실제로 남길 핵심만 짧게 정리합니다."
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
      <TextInputPanel label="2주 뒤 보고 싶은 작은 변화" helper="무엇이 조금 달라지면 좋을까요?" value={growthGoal} placeholder={round.twoWeekPlanGuide.growthGoalPlaceholder} onChange={onGrowthGoalChange} />
      <TextInputPanel label="이번 주 맡겨볼 작은 행동" helper="후배가 실제로 해볼 일을 적습니다." value={twoWeekTask} placeholder={round.twoWeekPlanGuide.taskPlaceholder} onChange={onTwoWeekTaskChange} />
      <TextInputPanel label="과장이 도와줄 방식" helper="지원 방식, 점검 시점, 조심할 말을 함께 적어도 됩니다." value={leaderSupport} placeholder={round.twoWeekPlanGuide.supportPlaceholder} minRows={4} onChange={onLeaderSupportChange} />
    </StepLayout>
  );
}
