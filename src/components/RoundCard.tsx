import type { Round } from '../types';

interface RoundCardProps {
  round: Round;
  isSelected: boolean;
  isCompleted?: boolean;
  onSelect: (round: Round) => void;
}

export function RoundCard({ round, isSelected, isCompleted = false, onSelect }: RoundCardProps) {
  return (
    <button
      type="button"
      className={`round-card ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={() => onSelect(round)}
      aria-pressed={isSelected}
    >
      <span className="round-index">{round.id === 'BOSS' ? 'Boss' : `R${round.order}`}</span>
      {isCompleted ? <span className="round-completed-badge">완료</span> : null}
      <span className="round-card-title">{round.title}</span>
      <span className="round-card-meta">
        {round.juniorName} {round.juniorRole} · 지금 도와줄 일: {round.developmentTask}
      </span>
    </button>
  );
}
