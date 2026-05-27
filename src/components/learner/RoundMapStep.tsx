import type { Round, RoundId } from '../../types';
import { RoundCard } from '../RoundCard';
import { StepLayout } from '../StepLayout';

interface RoundMapStepProps {
  rounds: Round[];
  selectedRound: Round;
  completedRoundIds: RoundId[];
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSelectRound: (round: Round) => void;
}

export function RoundMapStep({
  rounds,
  selectedRound,
  completedRoundIds,
  canGoNext,
  onBack,
  onNext,
  onSelectRound,
}: RoundMapStepProps) {
  return (
    <StepLayout
      eyebrow="장면 고르기"
      title="지금 가장 익숙한 장면부터 들어가 보세요"
      description="완료한 장면은 카드에 표시됩니다. 다른 장면도 이어서 볼 수 있습니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="이 장면으로 시작"
    >
      <div className="round-list">
        {rounds.map((round) => (
          <RoundCard
            key={round.id}
            round={round}
            isSelected={round.id === selectedRound.id}
            isCompleted={completedRoundIds.includes(round.id)}
            onSelect={onSelectRound}
          />
        ))}
      </div>
    </StepLayout>
  );
}
