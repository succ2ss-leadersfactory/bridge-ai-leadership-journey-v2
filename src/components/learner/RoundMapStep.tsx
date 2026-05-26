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
      eyebrow="라운드 Map"
      title="오늘 해볼 장면을 고르세요"
      description="완료한 장면은 카드에 표시됩니다. 다른 장면도 이어서 선택할 수 있습니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="선택한 장면 시작"
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
