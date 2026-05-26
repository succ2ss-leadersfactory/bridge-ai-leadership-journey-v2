import type { LearnerResponseV2, Participant } from '../types';

export const PARTICIPANTS_COLUMNS = [
  'participant_id',
  'team_name',
  'nickname',
  'created_at',
  'updated_at',
] as const;

export const RESPONSES_V2_COLUMNS = [
  'response_id',
  'participant_id',
  'team_name',
  'nickname',
  'round_id',
  'current_step',
  'junior_reading',
  'first_choice',
  'first_reason',
  'development_dilemma',
  'second_choice',
  'final_action_id',
  'development_direction',
  'generated_prompt',
  'edited_prompt',
  'ai_use_as_is',
  'ai_revise',
  'ai_risky',
  'growth_goal',
  'two_week_task',
  'leader_support',
  'check_timing',
  'watch_out',
  'final_line_1',
  'final_line_2',
  'final_line_3',
  'final_line_4',
  'final_line_5',
  'is_completed',
  'created_at',
  'updated_at',
] as const;

export type ParticipantColumn = (typeof PARTICIPANTS_COLUMNS)[number];
export type ResponseV2Column = (typeof RESPONSES_V2_COLUMNS)[number];

export type ParticipantRow = Record<ParticipantColumn, string>;
export type ResponseV2Row = Record<ResponseV2Column, string>;

export function mapParticipantToRow(participant: Participant): ParticipantRow {
  return {
    participant_id: participant.participantId,
    team_name: participant.teamName,
    nickname: participant.nickname,
    created_at: participant.createdAt,
    updated_at: participant.updatedAt,
  };
}

export function mapResponseToRow(response: LearnerResponseV2): ResponseV2Row {
  return {
    response_id: response.responseId,
    participant_id: response.participantId,
    team_name: response.teamName,
    nickname: response.nickname,
    round_id: response.roundId,
    current_step: response.currentStep,
    junior_reading: response.juniorReading,
    first_choice: response.firstChoice,
    first_reason: response.firstReason,
    development_dilemma: response.developmentDilemma,
    second_choice: response.secondChoice,
    final_action_id: response.finalActionId,
    development_direction: response.developmentDirection,
    generated_prompt: response.generatedPrompt,
    edited_prompt: response.editedPrompt,
    ai_use_as_is: response.aiUseAsIs,
    ai_revise: response.aiRevise,
    ai_risky: response.aiRisky,
    growth_goal: response.growthGoal,
    two_week_task: response.twoWeekTask,
    leader_support: response.leaderSupport,
    check_timing: response.checkTiming,
    watch_out: response.watchOut,
    final_line_1: response.finalLine1,
    final_line_2: response.finalLine2,
    final_line_3: response.finalLine3,
    final_line_4: response.finalLine4,
    final_line_5: response.finalLine5,
    is_completed: String(response.isCompleted),
    created_at: response.createdAt,
    updated_at: response.updatedAt,
  };
}

export function createEmptyResponse(partial: Pick<LearnerResponseV2, 'responseId' | 'participantId' | 'teamName' | 'nickname' | 'roundId'>): LearnerResponseV2 {
  const now = new Date().toISOString();

  return {
    ...partial,
    currentStep: 'intro',
    juniorReading: '',
    firstChoice: '',
    firstReason: '',
    developmentDilemma: '',
    secondChoice: '',
    finalActionId: '',
    developmentDirection: '',
    generatedPrompt: '',
    editedPrompt: '',
    aiUseAsIs: '',
    aiRevise: '',
    aiRisky: '',
    growthGoal: '',
    twoWeekTask: '',
    leaderSupport: '',
    checkTiming: '',
    watchOut: '',
    finalLine1: '',
    finalLine2: '',
    finalLine3: '',
    finalLine4: '',
    finalLine5: '',
    isCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
}
