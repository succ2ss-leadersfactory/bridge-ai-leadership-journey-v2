import type { LearningSession } from '../../types';
import { StepLayout } from '../StepLayout';

interface SessionMapStepProps {
  sessions: LearningSession[];
  selectedSession: LearningSession;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSelectSession: (session: LearningSession) => void;
}

export function SessionMapStep({
  sessions,
  selectedSession,
  canGoNext,
  onBack,
  onNext,
  onSelectSession,
}: SessionMapStepProps) {
  return (
    <StepLayout
      eyebrow="오늘 볼 흐름"
      title="후배를 읽고, 맡길 일을 정하고, 다시 움직이게 합니다"
      description="각 흐름마다 두 개의 장면이 있습니다. 먼저 다뤄볼 흐름을 고르세요."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="장면 고르기"
    >
      <div className="round-list">
        {sessions.map((session) => (
          <button
            type="button"
            key={session.id}
            className={`round-card ${session.id === selectedSession.id ? 'selected' : ''}`}
            onClick={() => onSelectSession(session)}
            aria-pressed={session.id === selectedSession.id}
          >
            <span className="round-index">S{session.order}</span>
            <span className="round-card-title">{session.title}</span>
            <span className="round-card-meta">{session.subtitle}</span>
            <span className="round-card-meta">볼 것: {session.theme}</span>
            <span className="round-card-meta">남길 것: {session.artifactName}</span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
