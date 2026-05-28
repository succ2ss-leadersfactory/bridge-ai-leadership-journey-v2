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
  directionSummary,
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
      description="AI가 나눠 넣은 초안입니다. 그대로 두지 말고, 김원중 과장이 실제로 확인할 수 있는 작은 행동으로 고쳐 주세요."
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
          <h3>AI가 나눠 넣은 참고안</h3>
          <pre>{finalArtifact}</pre>
        </article>
      ) : null}
      <TextInputPanel
        label="2주 뒤, 뭐가 조금 달라지면 좋을까요?"
        helper="AI 초안이 들어왔다면, 사람을 바꾸겠다는 목표가 아니라 눈에 보이는 작은 변화로 고쳐 주세요."
        value={growthGoal}
        placeholder={round.twoWeekPlanGuide.growthGoalPlaceholder}
        onChange={onGrowthGoalChange}
      />
      <TextInputPanel
        label="이번 주에 실제로 맡겨볼 일"
        helper="스마트폰에서 길게 쓰기보다, 이번 주 회의·자료·메신저에서 바로 해볼 일로 줄여 주세요."
        value={twoWeekTask}
        placeholder={round.twoWeekPlanGuide.taskPlaceholder}
        onChange={onTwoWeekTaskChange}
      />
      <TextInputPanel
        label="김원중 과장은 어디까지 봐줄까요?"
        helper="AI 문장 그대로 두지 말고, 처음·중간·마지막 중 김원중 과장이 실제로 볼 지점을 정합니다."
        value={leaderSupport}
        placeholder={round.twoWeekPlanGuide.supportPlaceholder}
        minRows={4}
        onChange={onLeaderSupportChange}
      />
    </StepLayout>
  );
}
