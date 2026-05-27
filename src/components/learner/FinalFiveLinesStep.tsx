import { coachingDialogueFields } from '../../data/coachingDialogueConfig';
import type { Round } from '../../types';
import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

interface FinalFiveLinesStepProps {
  round: Round;
  canGoNext: boolean;
  finalArtifact: string;
  finalLines: string[];
  onBack: () => void;
  onNext: () => void;
  onFinalLineChange: (index: number, value: string) => void;
}

function personalizePlaceholder(value: string, round: Round) {
  return value.split('윤동희 사원').join(`${round.juniorName} ${round.juniorRole}`);
}

export function FinalFiveLinesStep({
  round,
  canGoNext,
  finalArtifact,
  finalLines,
  onBack,
  onNext,
  onFinalLineChange,
}: FinalFiveLinesStepProps) {
  return (
    <StepLayout
      eyebrow="코칭 대화"
      title="후배 코칭 대화문 만들기"
      description="좋은 말 5줄을 쓰는 화면이 아닙니다. 내일 실제로 할 코칭 대화를 인정, 질문, 행동 약속 중심으로 정리합니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="결과 보기"
    >
      {finalArtifact ? (
        <article className="ai-artifact-card compact">
          <h3>참고할 AI 초안</h3>
          <pre>{finalArtifact}</pre>
        </article>
      ) : null}

      <div className="coaching-dialogue-stack">
        {coachingDialogueFields.map((field, index) => (
          <TextInputPanel
            key={field.id}
            label={field.label}
            helper={field.helper}
            value={finalLines[index] ?? ''}
            placeholder={personalizePlaceholder(field.placeholder, round)}
            minRows={3}
            onChange={(value) => onFinalLineChange(index, value)}
          />
        ))}
      </div>
    </StepLayout>
  );
}
