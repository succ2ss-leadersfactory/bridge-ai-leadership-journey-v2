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
      eyebrow="AI 답변 걸러보기"
      title="좋아 보이는 말도, 그대로 말하면 이상할 수 있습니다"
      description="AI가 준 답을 붙여넣고, 실제 후배 앞에서 쓸 말인지 아닌지 가릅니다. 회사에서 말하기 어색한 문장은 여기서 버립니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
    >
      <TextInputPanel
        label="AI가 준 답변 붙여넣기"
        helper="받은 답을 그대로 붙여넣으세요. 필요한 부분만 아래에서 따로 골라냅니다."
        value={aiRawResult}
        placeholder="AI 답변을 여기에 붙여넣어 주세요."
        minRows={10}
        onChange={onRawResultChange}
      />
      {finalArtifact ? (
        <article className="ai-artifact-card">
          <h3>AI가 잡아준 초안</h3>
          <pre>{finalArtifact}</pre>
        </article>
      ) : (
        <article className="ai-artifact-card muted-card">
          <h3>아직 붙여넣은 답변이 없습니다</h3>
          <p>AI 답변을 붙여넣으면 여기에서 참고할 초안이 보입니다.</p>
        </article>
      )}
      {reviewNotes ? (
        <article className="ai-artifact-card review">
          <h3>그대로 쓰기 전에 걸리는 점</h3>
          <pre>{reviewNotes}</pre>
        </article>
      ) : null}
      <TextInputPanel
        label="이 말은 써도 되겠다"
        helper="후배 앞에서 말해도 어색하지 않은 문장이나 흐름을 적습니다."
        value={aiUseAsIs}
        placeholder="예: 먼저 노력은 인정하고, 다음 기준을 묻는 흐름은 쓸 수 있겠다."
        onChange={onUseAsIsChange}
      />
      <TextInputPanel
        label="이 말은 우리 식으로 고쳐야겠다"
        helper="말투가 세거나, 너무 교과서 같거나, 우리 팀 상황과 안 맞는 부분입니다."
        value={aiRevise}
        placeholder="예: ‘책임감을 가지세요’는 세게 들리니 ‘다음엔 기준을 먼저 같이 보자’로 바꿔야겠다."
        onChange={onReviseChange}
      />
      <TextInputPanel
        label="이 말은 빼야겠다"
        helper="후배를 단정하거나, 책임을 밀어내거나, 회사에서 말하면 분위기가 얼어붙을 문장입니다."
        value={aiRisky}
        placeholder="예: ‘당신은 의존적인 편입니다’ 같은 표현은 빼야겠다."
        onChange={onRiskyChange}
      />
    </StepLayout>
  );
}
