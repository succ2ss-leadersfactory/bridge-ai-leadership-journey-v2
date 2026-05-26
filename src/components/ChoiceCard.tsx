import type { ChoiceOption } from '../types';

interface ChoiceCardProps {
  choice: ChoiceOption;
  isSelected: boolean;
  onSelect: (choiceId: ChoiceOption['id']) => void;
}

export function ChoiceCard({ choice, isSelected, onSelect }: ChoiceCardProps) {
  return (
    <button
      type="button"
      className={`choice-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(choice.id)}
      aria-pressed={isSelected}
    >
      <span className="choice-badge">{choice.id}</span>
      <span className="choice-title">{choice.label}</span>
      <span className="choice-note">
        <strong>좋은 점</strong> {choice.benefit}
      </span>
      <span className="choice-note">
        <strong>주의할 점</strong> {choice.cost}
      </span>
    </button>
  );
}
