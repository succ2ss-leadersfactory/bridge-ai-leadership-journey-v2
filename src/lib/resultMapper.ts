import type { ChoiceId, LearnerResponseV2, Participant, Round, SecondChoiceId } from '../types';

export interface ResultDraft {
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

interface BuildSavePayloadInput {
  round: Round;
  draft: ResultDraft;
  generatedPrompt: string;
  promptText: string;
  participantId: string;
  responseId: string;
  now: string;
}

function normalizeSecondChoice(value: string): SecondChoiceId | '' {
  if (value === 'keep' || value === 'revise' || value === 'change') return value;
  return '';
}

export function buildSavePayload({
  round,
  draft,
  generatedPrompt,
  promptText,
  participantId,
  responseId,
  now,
}: BuildSavePayloadInput): { participant: Participant; response: LearnerResponseV2 } {
  const participant: Participant = {
    participantId,
    teamName: draft.teamName,
    nickname: draft.nickname,
    createdAt: now,
    updatedAt: now,
  };

  const response: LearnerResponseV2 = {
    responseId,
    participantId,
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

  return { participant, response };
}
