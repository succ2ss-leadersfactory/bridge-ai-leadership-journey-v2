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
      eyebrow="내일 할 말"
      title="후배에게 실제로 할 말 5줄"
      description="AI 초안은 참고하되, 마지막 문장은 내 말투로 다듬습니다."
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
      {round.finalFiveLineGuide.map((guide, index) => (
        <TextInputPanel
          key={guide}
          label={`${index + 1}번째 문장`}
          helper={guide}
          value={finalLines[index]}
          placeholder="한 문장으로 적어 주세요."
          minRows={3}
          onChange={(value) => onFinalLineChange(index, value)}
        />
      ))}
    </StepLayout>
  );
}
