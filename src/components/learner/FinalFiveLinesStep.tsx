import { coachingDialogueFields } from '../../data/coachingDialogueConfig';
import type { Round } from '../../types';
import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

interface FinalFiveLinesStepProps {
  round: Round;
  canGoNext: boolean;
  finalArtifact: string;
  directionSummary: string;
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
  directionSummary,
  finalLines,
  onBack,
  onNext,
  onFinalLineChange,
}: FinalFiveLinesStepProps) {
  return (
    <StepLayout
      eyebrow="내일 할 말 정리"
      title="후배 앞에서 실제로 할 말 5줄"
      description="AI가 항목별로 나눠 넣은 초안입니다. 그대로 읽지 말고, 김원중 과장이 내일 자리에서 실제로 말할 수 있게 고쳐 주세요."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="정리한 내용 보기"
    >
      <article className="ai-artifact-card compact">
        <h3>이 말을 통해 남길 약속</h3>
        <p>{directionSummary || '아직 선택한 약속이 없습니다.'}</p>
      </article>
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
            helper={`${field.helper} AI 초안이 어색하면 우리 팀 말투로 짧게 고쳐 주세요.`}
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
