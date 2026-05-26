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
      eyebrow="AI에게 물어볼 말"
      title="AI에게 줄 질문을 먼저 다듬습니다"
      description="내 선택, 후배 반응, 다시 생각한 내용이 들어간 질문입니다. 그대로 복사하기 전에 우리 현장에 맞는지 한 번 봐 주세요."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="AI 답변 가져오기"
    >
      <div className="copy-panel">
        <p>복사한 뒤 GPT, Gemini, Claude 같은 AI 도구에 붙여넣고 답변을 받아오면 됩니다.</p>
        <button type="button" className="copy-button" onClick={onCopyPrompt}>
          AI 질문 복사하기
        </button>
        {copyStatus === 'success' ? <span className="copy-status success">복사되었습니다.</span> : null}
        {copyStatus === 'fail' ? <span className="copy-status fail">복사에 실패했습니다. 길게 눌러 직접 복사해 주세요.</span> : null}
      </div>
      <TextInputPanel
        label="AI에게 물어볼 내용"
        helper="민감한 고객 정보, 내부 수치, 실명 정보가 들어가지 않았는지 확인해 주세요."
        value={promptText}
        placeholder="AI에게 물어볼 말을 고쳐 주세요."
        minRows={12}
        onChange={onPromptChange}
      />
    </StepLayout>
  );
}
