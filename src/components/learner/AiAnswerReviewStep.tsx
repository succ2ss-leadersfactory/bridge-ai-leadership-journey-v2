import { extractionLabels, getExtractionStatus, getFieldValue, getPreviewText, isFilled, type ParsedAiFields } from '../../lib/aiExtractionStatus';
import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

interface AiAnswerReviewStepProps {
  canGoNext: boolean;
  aiRawResult: string;
  finalArtifact: string;
  reviewNotes: string;
  parsedFields: ParsedAiFields;
  aiUseAsIs: string;
  aiRevise: string;
  aiRisky: string;
  judgmentSummary: string;
  directionSummary: string;
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
  parsedFields,
  aiUseAsIs,
  aiRevise,
  aiRisky,
  judgmentSummary,
  directionSummary,
  onBack,
  onNext,
  onRawResultChange,
  onUseAsIsChange,
  onReviseChange,
  onRiskyChange,
}: AiAnswerReviewStepProps) {
  const extractionStatus = getExtractionStatus(parsedFields);

  return (
    <StepLayout
      eyebrow="AI 답변 걸러보기"
      title="그대로 쓰기 전에, 쓸 말과 고칠 말을 나눕니다"
      description="AI 답변을 붙여넣고 실제 후배에게 말해도 되는지 확인합니다. 어색한 문장은 다음 화면에서 고치면 됩니다."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
    >
      <article className="ai-artifact-card compact">
        <h3>앞에서 정한 방향</h3>
        <p><strong>다시 잡은 판단</strong><br />{judgmentSummary || '아직 선택한 판단이 없습니다.'}</p>
        <p><strong>이 후배에게 남길 약속</strong><br />{directionSummary || '아직 선택한 약속이 없습니다.'}</p>
      </article>
      <TextInputPanel
        label="AI 답변 붙여넣기"
        helper="외부 AI에서 받은 답변 전체를 붙여넣으세요. 앱이 실행안과 대화문을 나눠 봅니다."
        value={aiRawResult}
        placeholder="AI 답변을 여기에 붙여넣어 주세요."
        minRows={10}
        onChange={onRawResultChange}
      />
      {aiRawResult.trim().length > 0 ? (
        <article className={`ai-artifact-card extraction ${extractionStatus.isComplete ? 'complete' : 'partial'}`}>
          <h3>자동 분리 확인</h3>
          <p>
            2주 실행안은 <strong>{extractionStatus.planCount}/5개</strong>, 코칭 대화문은 <strong>{extractionStatus.lineCount}/5개</strong>가 분리됐습니다.
          </p>
          <p>
            전체 <strong>{extractionStatus.totalCount}/10개</strong> 항목이 잡혔습니다.
            {extractionStatus.isComplete
              ? ' 다음 화면에서 문장을 다듬으면 됩니다.'
              : ' 누락된 항목은 다음 화면에서 직접 채우면 됩니다.'}
          </p>
          {!extractionStatus.isComplete ? (
            <div className="extraction-missing-list">
              <strong>누락된 항목</strong>
              <ul>
                {extractionStatus.missingLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {extractionStatus.totalCount > 0 ? (
            <div className="extraction-preview-list">
              <strong>분리된 내용 미리보기</strong>
              <ul>
                {extractionLabels.map((item) => {
                  const value = getFieldValue(parsedFields, item.key);
                  return (
                    <li key={item.key} className={isFilled(value) ? 'filled' : 'empty'}>
                      <span>{item.label}</span>
                      <small>{getPreviewText(value)}</small>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </article>
      ) : null}
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
          <h3>한 번 더 생각해 볼 점</h3>
          <pre>{reviewNotes}</pre>
        </article>
      ) : null}
      <TextInputPanel
        label="그대로 참고할 부분"
        helper="후배에게 말해도 자연스러운 문장이나 흐름을 적습니다."
        value={aiUseAsIs}
        placeholder="예: 먼저 빠르게 움직인 점을 인정하는 흐름은 쓸 수 있겠다."
        onChange={onUseAsIsChange}
      />
      <TextInputPanel
        label="우리 상황에 맞게 고칠 부분"
        helper="말투, 강도, 확인 범위가 우리 팀 상황과 맞지 않는 부분입니다."
        value={aiRevise}
        placeholder="예: 표현을 조금 부드럽게 바꾸고, 확인 범위는 더 작게 줄여야겠다."
        onChange={onReviseChange}
      />
      <TextInputPanel
        label="빼거나 조심할 부분"
        helper="후배가 방어적으로 듣거나 오해할 수 있는 표현입니다."
        value={aiRisky}
        placeholder="예: 빠른 실행 자체를 문제처럼 들리게 하는 표현은 피해야겠다."
        onChange={onRiskyChange}
      />
    </StepLayout>
  );
}
