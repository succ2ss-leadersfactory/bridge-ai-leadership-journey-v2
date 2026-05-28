import type { ReactNode } from 'react';

interface StepLayoutProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
}

function getStepHeader(eyebrow: string, title: ReactNode, description?: ReactNode) {
  if (eyebrow === '다시 보면 걸리는 지점') {
    return {
      title: '무엇을 다시 봐야 할까요?',
      description: '새로 드러난 부담을 보고, 처음 판단에서 다시 조정해야 할 지점을 적어봅니다.',
    };
  }

  return { title, description };
}

export function StepLayout({
  eyebrow,
  title,
  description,
  children,
  canGoBack,
  canGoNext,
  nextLabel = '다음',
  onBack,
  onNext,
}: StepLayoutProps) {
  const header = getStepHeader(eyebrow, title, description);

  function handleHome() {
    window.dispatchEvent(new CustomEvent('kac-go-session-home'));
  }

  return (
    <section className="step-layout">
      <div className="step-content">
        <p className="step-eyebrow">{eyebrow}</p>
        <h2>{header.title}</h2>
        {header.description ? <p className="step-description">{header.description}</p> : null}
        <div className="step-body">{children}</div>
      </div>

      <nav className="bottom-actions" aria-label="단계 이동">
        <button type="button" className="secondary-button" onClick={onBack} disabled={!canGoBack}>
          이전
        </button>
        <button type="button" className="home-button" onClick={handleHome}>
          홈
        </button>
        <button type="button" className="primary-button" onClick={onNext} disabled={!canGoNext}>
          {nextLabel}
        </button>
      </nav>
    </section>
  );
}
