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
      eyebrow="시작하기"
      title="팀명과 닉네임을 적어주세요"
      description="입장 정보는 처음 한 번만 적습니다."
      canGoBack={false}
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="라운드 Map 보기"
    >
      <div className="form-stack">
        <TextInputPanel label="팀명" helper="팀 이름을 적어 주세요." value={draft.teamName} placeholder="예: 3팀" minRows={2} onChange={onTeamNameChange} />
        <TextInputPanel label="닉네임" helper="교육장에서 쓸 이름을 적어 주세요." value={draft.nickname} placeholder="예: 브릿지과장" minRows={2} onChange={onNicknameChange} />
      </div>
    </StepLayout>
  );
}
