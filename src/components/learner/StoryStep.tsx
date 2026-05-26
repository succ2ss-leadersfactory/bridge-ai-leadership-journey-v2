import { StepLayout } from '../StepLayout';

interface StoryStepProps {
  eyebrow: string;
  title: string;
  description: string;
  story: string;
  isEmphasis?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function StoryStep({ eyebrow, title, description, story, isEmphasis = false, onBack, onNext }: StoryStepProps) {
  return (
    <StepLayout eyebrow={eyebrow} title={title} description={description} canGoBack canGoNext onBack={onBack} onNext={onNext}>
      <article className={`story-card ${isEmphasis ? 'emphasis' : ''}`}>{story}</article>
    </StepLayout>
  );
}
