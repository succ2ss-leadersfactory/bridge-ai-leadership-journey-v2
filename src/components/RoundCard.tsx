import type { Round } from '../types';
import { getRoundDisplayCode } from '../lib/roundDisplay';

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
      <span className="round-index">{getRoundDisplayCode(round.id)}</span>
      {isCompleted ? <span className="round-completed-badge">완료</span> : null}
      <span className="round-card-title">{round.title}</span>
      <span className="round-card-meta round-character-row"><span className="round-meta-label">등장인물</span><span>{round.juniorName} {round.juniorRole}</span></span>
      <span className="round-card-meta round-task-row"><span className="round-meta-label">지금 도와줄 일</span><span>{round.developmentTask}</span></span>
    </button>
  );
}
