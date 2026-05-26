import { flowSteps } from '../data/flowSteps';
import type { FlowStepId } from '../types';

interface ProgressHeaderProps {
  currentStep: FlowStepId;
  roundTitle?: string;
}

export function ProgressHeader({ currentStep, roundTitle }: ProgressHeaderProps) {
  const currentIndex = flowSteps.findIndex((step) => step.id === currentStep);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const current = flowSteps[safeIndex];
  const progress = Math.round(((safeIndex + 1) / flowSteps.length) * 100);

  return (
    <header className="mobile-progress">
      <div className="progress-topline">
        <span>{roundTitle ? '라운드 진행' : 'Bridge AI Journey'}</span>
        <strong>{safeIndex + 1}/{flowSteps.length}</strong>
      </div>
      {roundTitle ? <p className="progress-round-title">{roundTitle}</p> : null}
      <div className="progress-track" aria-label={`진행률 ${progress}%`}>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-step-label">{current.label}</p>
    </header>
  );
}
