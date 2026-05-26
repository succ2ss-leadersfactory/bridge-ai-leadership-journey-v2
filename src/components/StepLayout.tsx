import type { ReactNode } from 'react';

interface StepLayoutProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
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
  return (
    <section className="step-layout">
      <div className="step-content">
        <p className="step-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="step-description">{description}</p> : null}
        <div className="step-body">{children}</div>
      </div>

      <nav className="bottom-actions" aria-label="단계 이동">
        <button type="button" className="secondary-button" onClick={onBack} disabled={!canGoBack}>
          이전
        </button>
        <button type="button" className="primary-button" onClick={onNext} disabled={!canGoNext}>
          {nextLabel}
        </button>
      </nav>
    </section>
  );
}
