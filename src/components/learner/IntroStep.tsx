import type { LearnerDraft } from '../../lib/learnerFlow';
import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

interface IntroStepProps {
  draft: Pick<LearnerDraft, 'teamName' | 'nickname'>;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onTeamNameChange: (value: string) => void;
  onNicknameChange: (value: string) => void;
}

export function IntroStep({ draft, canGoNext, onBack, onNext, onTeamNameChange, onNicknameChange }: IntroStepProps) {
  return (
    <StepLayout
      eyebrow="시작"
      title="교육장에서 부를 이름만 적고 시작합니다"
      description="실제 직원 이름이나 민감한 정보는 쓰지 않습니다. 여기서는 가상의 후배 장면으로 연습합니다."
      canGoBack={false}
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="오늘 볼 흐름 보기"
    >
      <div className="form-stack">
        <TextInputPanel label="우리 조" helper="교육장에서 구분할 조 이름을 적어 주세요." value={draft.teamName} placeholder="예: 3조" minRows={2} onChange={onTeamNameChange} />
        <TextInputPanel label="부를 이름" helper="토의 때 불러도 괜찮은 이름을 적어 주세요." value={draft.nickname} placeholder="예: 김과장" minRows={2} onChange={onNicknameChange} />
      </div>
    </StepLayout>
  );
}
