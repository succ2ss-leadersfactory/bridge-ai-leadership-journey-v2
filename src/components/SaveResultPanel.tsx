import { useState } from 'react';
import { coachingDialogueFields, getCoachingDialogueLabel } from '../data/coachingDialogueConfig';
import { downloadLocalResultsBackup, saveLocalResult } from '../lib/localResults';
import type { ResultDraft } from '../lib/resultMapper';
import type { Round } from '../types';

type LocalSaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface SaveResultPanelProps {
  round: Round;
  draft: ResultDraft;
  generatedPrompt: string;
  promptText: string;
  onSaveSuccess: () => void;
  onStartOver: () => void;
}

export function SaveResultPanel({ round, draft, generatedPrompt, promptText, onSaveSuccess, onStartOver }: SaveResultPanelProps) {
  const [saveStatus, setSaveStatus] = useState<LocalSaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const hasSaved = saveStatus === 'success';
  const finalLines = coachingDialogueFields
    .map((field, index) => ({ label: getCoachingDialogueLabel(index), line: draft.finalLines[index] ?? '' }))
    .filter((item) => item.line.trim().length > 0);

  function handleSave() {
    setSaveStatus('saving');
    setSaveMessage('이 기기에 저장하는 중입니다.');

    try {
      saveLocalResult({ round, draft, generatedPrompt, promptText });
      setSaveStatus('success');
      setSaveMessage('이 기기의 브라우저에 저장했습니다. 외부 서버로 전송되지 않습니다.');
      onSaveSuccess();
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : '로컬 저장 중 오류가 발생했습니다.');
    }
  }

  return (
    <article className="result-card">
      <h3>{round.finalOutput}</h3>
      <p className="result-helper">
        AI가 나눠 넣은 초안을 바탕으로 정리한 최종본입니다. 저장하기 전에 실제 후배 앞에서 말할 수 있는 표현인지 한 번만 더 확인해 주세요.
      </p>
      <p><strong>2주 뒤 보고 싶은 작은 변화</strong><br />{draft.growthGoal}</p>
      <p><strong>이번 주 맡겨볼 작은 행동</strong><br />{draft.twoWeekTask}</p>
      <p><strong>김원중 과장이 도와줄 방식</strong><br />{draft.leaderSupport}</p>
      <p><strong>짧게 같이 볼 시점</strong><br />{draft.checkTiming}</p>
      <p><strong>말할 때 조심할 표현</strong><br />{draft.watchOut}</p>
      <p><strong>후배 코칭 대화문</strong></p>
      <ol>
        {finalLines.map((item, index) => (
          <li key={`${item.line}-${index}`}><strong>{item.label}</strong><br />{item.line}</li>
        ))}
      </ol>

      <div className="sheet-save-panel">
        <p>
          최종본은 현재 기기의 브라우저 저장소에만 보관됩니다. 네트워크가 끊겨도 저장할 수 있으며,
          필요하면 JSON 백업 파일로 내려받을 수 있습니다.
        </p>
        <button type="button" className="save-sheet-button" onClick={handleSave} disabled={saveStatus === 'saving' || hasSaved}>
          {saveStatus === 'saving' ? '저장 중...' : hasSaved ? '기기에 저장 완료' : '이 기기에 최종본 저장하기'}
        </button>
        {saveMessage ? <span className={`sheet-save-status ${saveStatus}`}>{saveMessage}</span> : null}
        <button type="button" className="restart-button" onClick={downloadLocalResultsBackup}>
          저장 결과 백업 파일 받기
        </button>
      </div>

      <button type="button" className="restart-button" onClick={onStartOver} disabled={!hasSaved}>
        {hasSaved ? '라운드 Map으로 돌아가기' : '저장 후 라운드 Map으로 돌아가기'}
      </button>
    </article>
  );
}
