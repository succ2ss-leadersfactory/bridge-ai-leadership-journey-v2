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
      eyebrow="2주만 해볼 일"
      title={round.finalOutput}
      description="거창한 육성계획이 아니라, 다음 주 회의와 메신저에서 바로 확인할 수 있는 작은 행동으로 줄입니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
    >
      {finalArtifact ? (
        <article className="ai-artifact-card compact">
          <h3>AI가 잡아준 참고안</h3>
          <pre>{finalArtifact}</pre>
        </article>
      ) : null}
      <TextInputPanel
        label="2주 뒤, 뭐가 조금 달라지면 좋을까요?"
        helper="사람이 완전히 바뀌는 목표 말고, 눈에 보이는 작은 변화를 적습니다."
        value={growthGoal}
        placeholder={round.twoWeekPlanGuide.growthGoalPlaceholder}
        onChange={onGrowthGoalChange}
      />
      <TextInputPanel
        label="이번 주에 실제로 맡겨볼 일"
        helper="후배가 해볼 수 있고, 김원중 과장이 확인할 수 있는 크기로 적습니다."
        value={twoWeekTask}
        placeholder={round.twoWeekPlanGuide.taskPlaceholder}
        onChange={onTwoWeekTaskChange}
      />
      <TextInputPanel
        label="김원중 과장은 어디까지 봐줄까요?"
        helper="다 해주는 게 아니라, 처음·중간·마지막 중 어디에서 봐줄지 정합니다."
        value={leaderSupport}
        placeholder={round.twoWeekPlanGuide.supportPlaceholder}
        minRows={4}
        onChange={onLeaderSupportChange}
      />
    </StepLayout>
  );
}
