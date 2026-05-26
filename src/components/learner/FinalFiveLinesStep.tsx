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
  onFinalLinesChange: (value: string) => void;
}

export function FinalFiveLinesStep({
  round,
  canGoNext,
  finalArtifact,
  finalLines,
  onBack,
  onNext,
  onFinalLinesChange,
}: FinalFiveLinesStepProps) {
  const finalText = finalLines.filter(Boolean).join('\n');

  return (
    <StepLayout
      eyebrow="내일 할 말"
      title="후배에게 실제로 할 말"
      description="1번째부터 5번째까지 따로 채우지 않아도 됩니다. 내 말투로 3~5줄 정도만 정리합니다."
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
      <TextInputPanel
        label="후배에게 할 말 3~5줄"
        helper={`${round.juniorName} ${round.juniorRole}에게 실제로 말할 문장만 남겨 주세요.`}
        value={finalText}
        placeholder="예: 이번 일은 네가 먼저 1안을 잡아보고, 내가 중간에 한 번 같이 볼게.\n완벽하게 하라는 뜻은 아니고, 네가 어떤 기준으로 봤는지 확인하려는 거야.\n다음번에는 질문 전에 네 생각을 한 줄만 먼저 적어와 줘."
        minRows={7}
        onChange={onFinalLinesChange}
      />
    </StepLayout>
  );
}
