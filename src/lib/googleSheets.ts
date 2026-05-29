import type { LearnerResponseV2, Participant } from '../types';
import { mapParticipantToRow, mapResponseToRow } from './storage';

const webAppUrl = import.meta.env.VITE_GOOGLE_SCRIPT_WEBAPP_URL as string | undefined;

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error' | 'notConfigured';
export type DashboardLoadStatus = 'idle' | 'loading' | 'success' | 'error' | 'notConfigured';
export type SetupCheckStatus = DashboardLoadStatus;

export interface SaveLearnerResultInput {
  participant: Participant;
  response: LearnerResponseV2;
}

export interface DashboardParticipantRow {
  participant_id: string;
  team_name: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardResponseRow {
  response_id: string;
  participant_id: string;
  team_name: string;
  nickname: string;
  round_id: string;
  current_step: string;
  junior_reading: string;
  first_choice: string;
  first_reason: string;
  development_dilemma: string;
  second_choice: string;
  final_action_id: string;
  development_direction: string;
  generated_prompt: string;
  edited_prompt: string;
  ai_use_as_is: string;
  ai_revise: string;
  ai_risky: string;
  growth_goal: string;
  two_week_task: string;
  leader_support: string;
  check_timing: string;
  watch_out: string;
  final_line_1: string;
  final_line_2: string;
  final_line_3: string;
  final_line_4: string;
  final_line_5: string;
  is_completed: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardDataV2 {
  participants: DashboardParticipantRow[];
  responses: DashboardResponseRow[];
  loaded_at?: string;
}

interface SetupSheetInfo {
  name: string;
  columns: string[];
}

export interface SetupSheetsDataV2 {
  action?: string;
  spreadsheetName?: string;
  sheets?: SetupSheetInfo[];
  checked_at?: string;
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

function createActionUrl(action: string) {
  const url = new URL(webAppUrl!);
  url.searchParams.set('action', action);
  return url.toString();
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

export async function setupSheetsV2() {
  if (!isGoogleSheetsConfigured()) {
    return {
      ok: false,
      status: 'notConfigured' as const,
      message: 'Google Sheets 저장 URL이 설정되지 않았습니다.',
      data: {} satisfies SetupSheetsDataV2,
    };
  }

  try {
    const response = await fetch(createActionUrl('setupSheetsV2'));
    const data = (await response.json()) as SetupSheetsDataV2 & { ok?: boolean; error?: string };

    if (data.ok === false) {
      return {
        ok: false,
        status: 'error' as const,
        message: data.error || '시트와 헤더를 점검하지 못했습니다.',
        data: {} satisfies SetupSheetsDataV2,
      };
    }

    const sheetCount = data.sheets?.length ?? 0;
    return {
      ok: true,
      status: 'success' as const,
      message: `시트와 헤더 점검이 완료되었습니다. 확인된 시트 ${sheetCount}개`,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 'error' as const,
      message: error instanceof Error ? error.message : '시트와 헤더를 점검하는 중 오류가 발생했습니다.',
      data: {} satisfies SetupSheetsDataV2,
    };
  }
}

export async function fetchDashboardDataV2() {
  if (!isGoogleSheetsConfigured()) {
    return {
      ok: false,
      status: 'notConfigured' as const,
      message: 'Google Sheets 저장 URL이 설정되지 않았습니다.',
      data: { participants: [], responses: [] } satisfies DashboardDataV2,
    };
  }

  try {
    const response = await fetch(createActionUrl('getDashboardDataV2'));
    const data = (await response.json()) as Partial<DashboardDataV2> & { ok?: boolean; error?: string };

    if (data.ok === false) {
      return {
        ok: false,
        status: 'error' as const,
        message: data.error || '대시보드 데이터를 불러오지 못했습니다.',
        data: { participants: [], responses: [] } satisfies DashboardDataV2,
      };
    }

    return {
      ok: true,
      status: 'success' as const,
      message: '대시보드 데이터를 불러왔습니다.',
      data: {
        participants: data.participants ?? [],
        responses: data.responses ?? [],
        loaded_at: data.loaded_at,
      } satisfies DashboardDataV2,
    };
  } catch (error) {
    return {
      ok: false,
      status: 'error' as const,
      message: error instanceof Error ? error.message : '대시보드 데이터를 불러오는 중 오류가 발생했습니다.',
      data: { participants: [], responses: [] } satisfies DashboardDataV2,
    };
  }
}
