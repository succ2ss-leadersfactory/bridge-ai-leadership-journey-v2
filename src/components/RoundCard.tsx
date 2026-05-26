import type { Round } from '../types';

interface RoundCardProps {
  round: Round;
  isSelected: boolean;
  onSelect: (round: Round) => void;
}

export function RoundCard({ round, isSelected, onSelect }: RoundCardProps) {
  return (
    <button
      type="button"
      className={`round-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(round)}
      aria-pressed={isSelected}
    >
      <span className="round-index">{round.id === 'BOSS' ? 'Boss' : `R${round.order}`}</span>
      <span className="round-card-title">{round.title}</span>
      <span className="round-card-meta">
        {round.juniorName} {round.juniorRole} · {round.developmentTask}
      </span>
    </button>
  );
}
