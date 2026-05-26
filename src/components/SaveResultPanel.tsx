import { useMemo, useState } from 'react';
import { saveLearnerResultToGoogleSheets, type SaveStatus } from '../lib/googleSheets';
import { createId } from '../lib/ids';
import { buildSavePayload, type ResultDraft } from '../lib/resultMapper';
import type { Round } from '../types';

interface SaveResultPanelProps {
  round: Round;
  draft: ResultDraft;
  generatedPrompt: string;
  promptText: string;
  onSaveSuccess: () => void;
  onStartOver: () => void;
}

export function SaveResultPanel({ round, draft, generatedPrompt, promptText, onSaveSuccess, onStartOver }: SaveResultPanelProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const ids = useMemo(
    () => ({
      participantId: createId('participant'),
      responseId: createId('response'),
    }),
    [],
  );

  const hasSaved = saveStatus === 'success';

  async function handleSave() {
    setSaveStatus('saving');
    setSaveMessage('저장 중입니다. 잠시만 기다려 주세요.');

    const now = new Date().toISOString();
    const payload = buildSavePayload({
      round,
      draft,
      generatedPrompt,
      promptText,
      participantId: ids.participantId,
      responseId: ids.responseId,
      now,
    });

    const result = await saveLearnerResultToGoogleSheets(payload);
    setSaveStatus(result.status);
    setSaveMessage(result.message);

    if (result.status === 'success') {
      onSaveSuccess();
    }
  }

  return (
    <article className="result-card">
      <h3>{round.finalOutput}</h3>
      <p><strong>2주 뒤 달라졌으면 하는 모습</strong><br />{draft.growthGoal}</p>
      <p><strong>이번 주에 맡겨볼 작은 일</strong><br />{draft.twoWeekTask}</p>
      <p><strong>내가 옆에서 도와줄 일</strong><br />{draft.leaderSupport}</p>
      <p><strong>언제 짧게 같이 볼지</strong><br />{draft.checkTiming}</p>
      <p><strong>말할 때 조심할 표현</strong><br />{draft.watchOut}</p>
      <ol>
        {draft.finalLines.map((line, index) => (
          <li key={`${line}-${index}`}>{line}</li>
        ))}
      </ol>

      <div className="sheet-save-panel">
        <p>오늘 작성한 내용을 저장하면 강사용 화면에서 함께 볼 수 있습니다.</p>
        <button type="button" className="save-sheet-button" onClick={handleSave} disabled={saveStatus === 'saving' || hasSaved}>
          {saveStatus === 'saving' ? '저장 중...' : hasSaved ? '저장 완료' : '작성한 내용 저장하기'}
        </button>
        {saveMessage ? <span className={`sheet-save-status ${saveStatus}`}>{saveMessage}</span> : null}
      </div>

      <button type="button" className="restart-button" onClick={onStartOver} disabled={!hasSaved}>
        {hasSaved ? '라운드 Map으로 돌아가기' : '저장 후 라운드 Map으로 돌아가기'}
      </button>
    </article>
  );
}
