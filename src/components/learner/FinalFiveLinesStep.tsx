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
  onFinalLineChange: (index: number, value: string) => void;
}

const coachingDialogueFields = [
  {
    label: '1. 먼저 인정할 말',
    helper: '후배의 의도, 노력, 조심스러움을 먼저 인정합니다.',
    placeholder: '예: 윤동희 사원, 외부로 나가는 문구를 조심해서 보려는 태도는 좋아요.',
  },
  {
    label: '2. 스스로 생각하게 할 질문',
    helper: '답을 바로 주기보다 후배가 먼저 기준을 말하게 돕습니다.',
    placeholder: '예: 이번 문구는 어떤 기준 때문에 확인이 필요하다고 봤어요?',
  },
  {
    label: '3. 이번 주 함께 정할 행동',
    helper: '내일부터 바로 해볼 작은 행동을 약속합니다.',
    placeholder: '예: 이번 주에는 질문하기 전에 1차 의견과 확인받고 싶은 이유를 한 줄로 먼저 가져와 봅시다.',
  },
  {
    label: '4. 김원중 과장이 도와줄 방식',
    helper: '처음부터 다 맡기지 않고, 어디까지 도와줄지 말합니다.',
    placeholder: '예: 처음 두 번은 제가 같이 보고, 그다음부터는 윤동희 사원이 먼저 기준을 잡아보는 방식으로 해봅시다.',
  },
  {
    label: '5. 조심할 표현',
    helper: '후배가 방어적으로 들을 수 있는 말은 피하고, 바꿔 말할 표현을 적습니다.',
    placeholder: '예: “왜 또 물어봐요?” 대신 “이번 건은 어떤 기준 때문에 확인이 필요하다고 봤어요?”라고 말합니다.',
  },
];

export function FinalFiveLinesStep({
  round,
  canGoNext,
  finalArtifact,
  finalLines,
  onBack,
  onNext,
  onFinalLineChange,
}: FinalFiveLinesStepProps) {
  return (
    <StepLayout
      eyebrow="코칭 대화"
      title="후배 코칭 대화문 만들기"
      description="좋은 말 5줄을 쓰는 화면이 아닙니다. 내일 실제로 할 코칭 대화를 인정, 질문, 행동 약속 중심으로 정리합니다."
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

      <div className="coaching-dialogue-stack">
        {coachingDialogueFields.map((field, index) => (
          <TextInputPanel
            key={field.label}
            label={field.label}
            helper={field.helper}
            value={finalLines[index] ?? ''}
            placeholder={field.placeholder.replaceAll('윤동희 사원', `${round.juniorName} ${round.juniorRole}`)}
            minRows={3}
            onChange={(value) => onFinalLineChange(index, value)}
          />
        ))}
      </div>
    </StepLayout>
  );
}
