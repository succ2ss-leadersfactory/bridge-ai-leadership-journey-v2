import { kacCiLogoDataUrl } from '../../assets/kacCiLogo';
import type { LearnerDraft } from '../../lib/learnerFlow';
import { StepLayout } from '../StepLayout';
import { TextInputPanel } from '../TextInputPanel';

const teamOptions = Array.from({ length: 8 }, (_, index) => `${index + 1}팀`);

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
      title="우리 팀과 부를 이름을 확인하고 시작합니다"
      description="실제 직원 이름이나 민감한 정보는 쓰지 않습니다. 여기서는 가상의 후배 장면으로 연습합니다."
      canGoBack={false}
      canGoNext={canGoNext}
      onBack={onBack}
      onNext={onNext}
      nextLabel="오늘 볼 흐름 보기"
    >
      <section className="kac-intro-lockup logo" aria-label="한국공항공사 Bridge AI Leadership Journey">
        <img className="kac-ci-image" src={kacCiLogoDataUrl} alt="한국공항공사 CI" />
        <p className="kac-program-name">Bridge AI Leadership Journey</p>
      </section>

      <div className="form-stack">
        <section className="team-select-panel">
          <p className="text-panel-label">우리 팀</p>
          <p className="text-panel-helper">교육장에서 배정된 팀을 선택해 주세요.</p>
          <div className="team-option-grid" role="radiogroup" aria-label="팀 선택">
            {teamOptions.map((teamName) => (
              <button
                key={teamName}
                type="button"
                className={`team-option ${draft.teamName === teamName ? 'selected' : ''}`}
                onClick={() => onTeamNameChange(teamName)}
                role="radio"
                aria-checked={draft.teamName === teamName}
              >
                {teamName}
              </button>
            ))}
          </div>
        </section>
        <TextInputPanel label="부를 이름" helper="토의 때 불러도 괜찮은 이름을 적어 주세요." value={draft.nickname} placeholder="예: 김과장" minRows={2} onChange={onNicknameChange} />
      </div>
    </StepLayout>
  );
}
