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
      title="복사하기 전에, 내 판단이 잘 들어갔는지 봅니다"
      description="앞에서 고른 선택과 후배 반응이 들어간 질문입니다. 실제 이름, 내부 수치, 민감한 정보는 가상 표현으로 바꾼 뒤 복사하세요."
      canGoBack
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="AI 답변 가져오기"
    >
      <div className="copy-panel">
        <p>복사해서 GPT, Gemini, Claude 등에 붙여넣으세요. 답이 나오면 앱으로 돌아와 쓸 말과 고칠 말을 구분합니다.</p>
        <button type="button" className="copy-button" onClick={onCopyPrompt}>
          질문 복사하기
        </button>
        {copyStatus === 'success' ? <span className="copy-status success">복사됐습니다.</span> : null}
        {copyStatus === 'fail' ? <span className="copy-status fail">복사가 안 됐습니다. 문장을 길게 눌러 직접 복사해 주세요.</span> : null}
      </div>
      <TextInputPanel
        label="AI에게 보낼 질문"
        helper="실제 회사명, 직원 실명, 고객명, 내부 수치가 있다면 가상 표현으로 바꿔 주세요."
        value={promptText}
        placeholder="AI에게 보낼 질문을 내 말로 조금 고쳐 주세요."
        minRows={12}
        onChange={onPromptChange}
      />
    </StepLayout>
  );
}
