import type { Round } from '../../types';
import { RoundCard } from '../RoundCard';
import { StepLayout } from '../StepLayout';

interface RoundMapStepProps {
  rounds: Round[];
  selectedRound: Round;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSelectRound: (round: Round) => void;
}

export function RoundMapStep({ rounds, selectedRound, canGoNext, onBack, onNext, onSelectRound }: RoundMapStepProps) {
  return (
    <StepLayout
      eyebrow="라운드 Map"
      title="오늘 해볼 장면을 고르세요"
      description="한 라운드를 저장한 뒤에도 이 화면으로 돌아와 다른 장면을 이어서 할 수 있습니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="선택한 장면 시작"
    >
      <div className="round-list">
        {rounds.map((round) => (
          <RoundCard key={round.id} round={round} isSelected={round.id === selectedRound.id} onSelect={onSelectRound} />
        ))}
      </div>
    </StepLayout>
  );
}
