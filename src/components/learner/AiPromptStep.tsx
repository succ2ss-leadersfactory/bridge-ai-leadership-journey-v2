import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

type CopyStatus = 'idle' | 'success' | 'fail';

interface AiPromptStepProps {
  canGoNext: boolean;
  promptText: string;
  copyStatus: CopyStatus;
  onBack: () => void;
  onNext: () => void;
  onCopyPrompt: () => void;
  onPromptChange: (value: string) => void;
}

export function AiPromptStep({
  canGoNext,
  promptText,
  copyStatus,
  onBack,
  onNext,
  onCopyPrompt,
  onPromptChange,
}: AiPromptStepProps) {
  return (
    <StepLayout
      eyebrow="AI에게 초안 부탁하기"
      title="그냥 복사하지 말고, 내 상황에 맞게 한 번 손봅니다"
      description="앞에서 고른 판단과 후배 반응이 들어간 질문입니다. 회사 이름, 실제 직원 이름, 내부 숫자가 섞이지 않았는지 보고 나서 복사하세요."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="AI 답변 가져오기"
    >
      <div className="copy-panel">
        <p>복사해서 GPT, Gemini, Claude 등에 붙여넣으세요. 답이 나오면 그대로 믿지 말고, 다음 화면에서 쓸 말과 버릴 말을 가릅니다.</p>
        <button type="button" className="copy-button" onClick={onCopyPrompt}>
          질문 복사하기
        </button>
        {copyStatus === 'success' ? <span className="copy-status success">복사됐습니다.</span> : null}
        {copyStatus === 'fail' ? <span className="copy-status fail">복사가 안 됐습니다. 문장을 길게 눌러 직접 복사해 주세요.</span> : null}
      </div>
      <TextInputPanel
        label="AI에게 보낼 질문"
        helper="실제 회사명, 직원 실명, 고객명, 내부 수치가 들어갔다면 가상 표현으로 바꿔 주세요."
        value={promptText}
        placeholder="AI에게 보낼 질문을 내 말로 조금 고쳐 주세요."
        minRows={12}
        onChange={onPromptChange}
      />
    </StepLayout>
  );
}
