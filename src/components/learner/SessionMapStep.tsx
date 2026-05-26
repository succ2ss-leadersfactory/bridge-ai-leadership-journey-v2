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
      eyebrow="세션 Map"
      title="오늘 진행할 세션을 고르세요"
      description="각 세션은 2개의 라운드로 구성됩니다. 세션별 체험 후 강사가 핵심 내용을 짧게 리뷰합니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="세션 안의 라운드 보기"
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
            <span className="round-card-meta">주제: {session.theme}</span>
            <span className="round-card-meta">결과물: {session.artifactName}</span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
