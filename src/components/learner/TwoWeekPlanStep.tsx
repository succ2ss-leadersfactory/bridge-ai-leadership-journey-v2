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
      <TextInputPanel
        label="언제 짧게 같이 볼까요?"
        helper="후배가 혼자 하게 둘 시간과 김원중 과장이 짧게 볼 시간을 구분합니다."
        value={checkTiming}
        placeholder={round.twoWeekPlanGuide.checkTimingPlaceholder}
        onChange={onCheckTimingChange}
      />
      <TextInputPanel
        label="말할 때 특히 조심할 표현"
        helper="후배가 방어적으로 듣거나, 낙인처럼 받아들일 수 있는 표현을 미리 걸러냅니다."
        value={watchOut}
        placeholder={round.twoWeekPlanGuide.watchOutPlaceholder}
        onChange={onWatchOutChange}
      />
    </StepLayout>
  );
}
