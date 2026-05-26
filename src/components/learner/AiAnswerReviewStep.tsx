import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

interface AiAnswerReviewStepProps {
  canGoNext: boolean;
  aiRawResult: string;
  finalArtifact: string;
  reviewNotes: string;
  aiUseAsIs: string;
  aiRevise: string;
  aiRisky: string;
  onBack: () => void;
  onNext: () => void;
  onRawResultChange: (value: string) => void;
  onUseAsIsChange: (value: string) => void;
  onReviseChange: (value: string) => void;
  onRiskyChange: (value: string) => void;
}

export function AiAnswerReviewStep({
  canGoNext,
  aiRawResult,
  finalArtifact,
  reviewNotes,
  aiUseAsIs,
  aiRevise,
  aiRisky,
  onBack,
  onNext,
  onRawResultChange,
  onUseAsIsChange,
  onReviseChange,
  onRiskyChange,
}: AiAnswerReviewStepProps) {
  return (
    <StepLayout
      eyebrow="AI 답변 보기"
      title="AI 답변을 바로 쓰지 말고 골라봅니다"
      description="AI 도구에서 받은 답변을 붙여넣고, 쓸 말과 고칠 말을 나눠봅니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
    >
      <TextInputPanel
        label="AI 답변 전체 붙여넣기"
        helper="AI가 준 답변 전체를 그대로 붙여넣으세요. 결과물이 있으면 아래에 따로 보입니다."
        value={aiRawResult}
        placeholder="AI 답변 전체를 붙여넣어 주세요."
        minRows={10}
        onChange={onRawResultChange}
      />
      {finalArtifact ? (
        <article className="ai-artifact-card">
          <h3>AI가 써준 초안</h3>
          <pre>{finalArtifact}</pre>
        </article>
      ) : (
        <article className="ai-artifact-card muted-card">
          <h3>아직 따로 보이는 결과물이 없습니다</h3>
          <p>AI 답변을 붙여넣으면 여기에서 참고할 초안을 확인할 수 있습니다.</p>
        </article>
      )}
      {reviewNotes ? (
        <article className="ai-artifact-card review">
          <h3>한 번 더 생각해 볼 점</h3>
          <pre>{reviewNotes}</pre>
        </article>
      ) : null}
      <TextInputPanel
        label="그대로 참고할 부분"
        helper="우리 현장에서도 쓸 만한 문장이나 흐름을 적습니다."
        value={aiUseAsIs}
        placeholder="그대로 참고할 부분"
        onChange={onUseAsIsChange}
      />
      <TextInputPanel
        label="고쳐야 할 부분"
        helper="말투, 강도, 타이밍을 우리 상황에 맞게 고칠 부분입니다."
        value={aiRevise}
        placeholder="고쳐야 할 부분"
        onChange={onReviseChange}
      />
      <TextInputPanel
        label="그대로 쓰면 위험한 부분"
        helper="후배를 단정하거나, 책임을 떠넘기거나, 우리 조직 분위기와 맞지 않는 부분입니다."
        value={aiRisky}
        placeholder="조심할 부분"
        onChange={onRiskyChange}
      />
    </StepLayout>
  );
}
