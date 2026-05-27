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
      eyebrow="내일 할 말 정리"
      title="후배 앞에서 실제로 할 말 5줄"
      description="좋은 말처럼 들리는 문장이 아니라, 내일 자리에서 바로 꺼낼 수 있는 말로 바꿉니다. 인정할 말, 물어볼 말, 같이 정할 행동만 남깁니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="정리한 내용 보기"
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
