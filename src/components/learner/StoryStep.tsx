import type { ReactNode } from 'react';
import { StepLayout } from '../StepLayout';

interface StoryStepProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  story: string;
  isEmphasis?: boolean;
  onBack: () => void;
  onNext: () => void;
}

function getStoryStepHeader(eyebrow: string, title: ReactNode, description: ReactNode) {
  if (eyebrow === '그 선택이 만든 변화') {
    return {
      title: '일은 이렇게 흘러갑니다',
      description: '내 첫 대응 뒤에 업무 흐름과 남은 부담이 어떻게 달라졌는지 봅니다.',
    };
  }

  if (eyebrow === '후배가 이렇게 받아들입니다') {
    return {
      title: '후배에게 남은 메시지',
      description: '겉으로 한 대답보다, 후배가 어떤 의미로 받아들였는지를 봅니다.',
    };
  }

  if (eyebrow === '그런데, 일이 조금 달라집니다') {
    return {
      title: '처음 선택의 비용이 보입니다',
      description: '방금 선택이 틀렸다는 뜻은 아닙니다. 다만 시간이 지나며 다른 부담이 드러납니다.',
    };
  }

  return { title, description };
}

export function StoryStep({ eyebrow, title, description, story, isEmphasis = false, onBack, onNext }: StoryStepProps) {
  const header = getStoryStepHeader(eyebrow, title, description);

  return (
    <StepLayout eyebrow={eyebrow} title={header.title} description={header.description} canGoBack canGoNext onBack={onBack} onNext={onNext}>
      <article className={`story-card ${isEmphasis ? 'emphasis' : ''}`}>{story}</article>
    </StepLayout>
  );
}
