import { useMemo, useState } from 'react';
import { saveLearnerResultToGoogleSheets, type SaveStatus } from '../lib/googleSheets';
import { createId } from '../lib/ids';
import type { ChoiceId, LearnerResponseV2, Round, SecondChoiceId } from '../types';

interface DraftLike {
  teamName: string;
  nickname: string;
  juniorReading: string;
  firstChoice: ChoiceId | '';
  firstReason: string;
  dilemma: string;
  secondChoice: string;
  directionId: string;
  editedPrompt: string;
  aiUseAsIs: string;
  aiRevise: string;
  aiRisky: string;
  growthGoal: string;
  twoWeekTask: string;
  leaderSupport: string;
  checkTiming: string;
  watchOut: string;
  finalLines: string[];
}

interface SaveResultPanelProps {
  round: Round;
  draft: DraftLike;
  generatedPrompt: string;
  promptText: string;
  onStartOver: () => void;
}

function normalizeSecondChoice(value: string): SecondChoiceId | '' {
  if (value === 'keep' || value === 'revise' || value === 'change') return value;
  return '';
}

export function SaveResultPanel({ round, draft, generatedPrompt, promptText, onStartOver }: SaveResultPanelProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const ids = useMemo(
    () => ({
      participantId: createId('participant'),
      responseId: createId('response'),
    }),
    [],
  );

  async function handleSave() {
    setSaveStatus('saving');
    setSaveMessage('저장 중입니다. 잠시만 기다려 주세요.');

    const now = new Date().toISOString();
    const participant = {
      participantId: ids.participantId,
      teamName: draft.teamName,
      nickname: draft.nickname,
      createdAt: now,
      updatedAt: now,
    };

    const response: LearnerResponseV2 = {
      responseId: ids.responseId,
      participantId: ids.participantId,
      teamName: draft.teamName,
      nickname: draft.nickname,
      roundId: round.id,
      currentStep: 'result',
      juniorReading: draft.juniorReading,
      firstChoice: draft.firstChoice,
      firstReason: draft.firstReason,
      developmentDilemma: draft.dilemma,
      secondChoice: normalizeSecondChoice(draft.secondChoice),
      finalActionId: draft.directionId,
      developmentDirection: round.developmentDirections.find((item) => item.id === draft.directionId)?.title ?? '',
      generatedPrompt,
      editedPrompt: promptText,
      aiUseAsIs: draft.aiUseAsIs,
      aiRevise: draft.aiRevise,
      aiRisky: draft.aiRisky,
      growthGoal: draft.growthGoal,
      twoWeekTask: draft.twoWeekTask,
      leaderSupport: draft.leaderSupport,
      checkTiming: draft.checkTiming,
      watchOut: draft.watchOut,
      finalLine1: draft.finalLines[0] ?? '',
      finalLine2: draft.finalLines[1] ?? '',
      finalLine3: draft.finalLines[2] ?? '',
      finalLine4: draft.finalLines[3] ?? '',
      finalLine5: draft.finalLines[4] ?? '',
      isCompleted: true,
      createdAt: now,
      updatedAt: now,
    };

    const result = await saveLearnerResultToGoogleSheets({ participant, response });
    setSaveStatus(result.status);
    setSaveMessage(result.message);
  }

  return (
    <article className="result-card">
      <h3>{round.finalOutput}</h3>
      <p><strong>성장 목표</strong><br />{draft.growthGoal}</p>
      <p><strong>작은 과제</strong><br />{draft.twoWeekTask}</p>
      <p><strong>과장의 지원</strong><br />{draft.leaderSupport}</p>
      <p><strong>점검 시점</strong><br />{draft.checkTiming}</p>
      <p><strong>주의할 점</strong><br />{draft.watchOut}</p>
      <ol>
        {draft.finalLines.map((line, index) => (
          <li key={`${line}-${index}`}>{line}</li>
        ))}
      </ol>

      <div className="sheet-save-panel">
        <p>작성 결과를 강사용 대시보드에서 볼 수 있도록 Google Sheets에 저장합니다.</p>
        <button type="button" className="save-sheet-button" onClick={handleSave} disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? '저장 중...' : '결과 저장하기'}
        </button>
        {saveMessage ? <span className={`sheet-save-status ${saveStatus}`}>{saveMessage}</span> : null}
      </div>

      <button type="button" className="restart-button" onClick={onStartOver}>
        새 라운드로 다시 시작
      </button>
    </article>
  );
}
