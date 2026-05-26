import type { LearnerResponseV2, Participant } from '../types';
import { mapParticipantToRow, mapResponseToRow } from './storage';

const webAppUrl = import.meta.env.VITE_GOOGLE_SCRIPT_WEBAPP_URL as string | undefined;

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error' | 'notConfigured';

export interface SaveLearnerResultInput {
  participant: Participant;
  response: LearnerResponseV2;
}

interface GoogleSheetsPayload {
  action: 'saveLearnerResultV2';
  participant: ReturnType<typeof mapParticipantToRow>;
  response: ReturnType<typeof mapResponseToRow>;
  meta: {
    appVersion: 'v2.0';
    source: 'learner-mobile';
    savedFrom: 'webapp';
  };
}

export function isGoogleSheetsConfigured() {
  return Boolean(webAppUrl && webAppUrl.trim().length > 0);
}

export async function saveLearnerResultToGoogleSheets({ participant, response }: SaveLearnerResultInput) {
  if (!isGoogleSheetsConfigured()) {
    return { ok: false, status: 'notConfigured' as const, message: 'Google Sheets 저장 URL이 설정되지 않았습니다.' };
  }

  const payload: GoogleSheetsPayload = {
    action: 'saveLearnerResultV2',
    participant: mapParticipantToRow(participant),
    response: mapResponseToRow(response),
    meta: {
      appVersion: 'v2.0',
      source: 'learner-mobile',
      savedFrom: 'webapp',
    },
  };

  try {
    await fetch(webAppUrl!, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { ok: true, status: 'success' as const, message: '저장 요청을 보냈습니다.' };
  } catch (error) {
    return {
      ok: false,
      status: 'error' as const,
      message: error instanceof Error ? error.message : '저장 중 알 수 없는 오류가 발생했습니다.',
    };
  }
}
