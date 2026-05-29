import { createEmptyCoachingDialogueLines, hasRequiredCoachingDialogueLines } from '../data/coachingDialogueConfig';
import type { ChoiceId, FlowStepId } from '../types';

export type LearnerDraft = {
  teamName: string;
  nickname: string;
  juniorReading: string;
  firstChoice: ChoiceId | '';
  firstReason: string;
  dilemma: string;
  secondChoice: string;
  directionId: string;
  editedPrompt: string;
  aiRawResult: string;
  aiFinalArtifact: string;
  aiReviewNotes: string;
  aiUseAsIs: string;
  aiRevise: string;
  aiRisky: string;
  growthGoal: string;
  twoWeekTask: string;
  leaderSupport: string;
  checkTiming: string;
  watchOut: string;
  finalLines: string[];
};

export const initialLearnerDraft: LearnerDraft = {
  teamName: '',
  nickname: '',
  juniorReading: '',
  firstChoice: '',
  firstReason: '',
  dilemma: '',
  secondChoice: '',
  directionId: '',
  editedPrompt: '',
  aiRawResult: '',
  aiFinalArtifact: '',
  aiReviewNotes: '',
  aiUseAsIs: '',
  aiRevise: '',
  aiRisky: '',
  growthGoal: '',
  twoWeekTask: '',
  leaderSupport: '',
  checkTiming: '',
  watchOut: '',
  finalLines: createEmptyCoachingDialogueLines(),
};

function normalizeTextField(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function normalizeChoice(value: unknown): ChoiceId | '' {
  return value === 'A' || value === 'B' ? value : '';
}

export function normalizeLearnerDraft(draft?: Partial<LearnerDraft> | null): LearnerDraft {
  const finalLines = createEmptyCoachingDialogueLines();
  const savedFinalLines = Array.isArray(draft?.finalLines) ? draft.finalLines : [];

  savedFinalLines.forEach((line, index) => {
    if (index < finalLines.length) {
      finalLines[index] = normalizeTextField(line);
    }
  });

  return {
    ...initialLearnerDraft,
    teamName: normalizeTextField(draft?.teamName),
    nickname: normalizeTextField(draft?.nickname),
    juniorReading: normalizeTextField(draft?.juniorReading),
    firstChoice: normalizeChoice(draft?.firstChoice),
    firstReason: normalizeTextField(draft?.firstReason),
    dilemma: normalizeTextField(draft?.dilemma),
    secondChoice: normalizeTextField(draft?.secondChoice),
    directionId: normalizeTextField(draft?.directionId),
    editedPrompt: normalizeTextField(draft?.editedPrompt),
    aiRawResult: normalizeTextField(draft?.aiRawResult),
    aiFinalArtifact: normalizeTextField(draft?.aiFinalArtifact),
    aiReviewNotes: normalizeTextField(draft?.aiReviewNotes),
    aiUseAsIs: normalizeTextField(draft?.aiUseAsIs),
    aiRevise: normalizeTextField(draft?.aiRevise),
    aiRisky: normalizeTextField(draft?.aiRisky),
    growthGoal: normalizeTextField(draft?.growthGoal),
    twoWeekTask: normalizeTextField(draft?.twoWeekTask),
    leaderSupport: normalizeTextField(draft?.leaderSupport),
    checkTiming: normalizeTextField(draft?.checkTiming),
    watchOut: normalizeTextField(draft?.watchOut),
    finalLines,
  };
}

export function createFreshRoundDraft(prev: LearnerDraft): LearnerDraft {
  return {
    ...initialLearnerDraft,
    finalLines: createEmptyCoachingDialogueLines(),
    teamName: prev.teamName,
    nickname: prev.nickname,
  };
}

interface CanMoveNextInput {
  currentStep: FlowStepId;
  draft: LearnerDraft;
  hasSelectedRound: boolean;
  promptText: string;
}

export function canMoveNext({ currentStep, draft, hasSelectedRound, promptText }: CanMoveNextInput) {
  switch (currentStep) {
    case 'intro':
      return draft.teamName.trim().length > 0 && draft.nickname.trim().length > 0;
    case 'roundMap':
      return hasSelectedRound;
    case 'juniorReading':
      return draft.juniorReading.trim().length > 0;
    case 'firstDecision':
      return draft.firstChoice !== '' && draft.firstReason.trim().length > 0;
    case 'dilemmaAnalysis':
      return draft.dilemma.trim().length > 0;
    case 'secondDecision':
      return draft.secondChoice !== '';
    case 'developmentDirection':
      return draft.directionId !== '';
    case 'aiPrompt':
      return promptText.trim().length > 0;
    case 'aiAnswerReview':
      return draft.aiRawResult.trim().length > 0 && (
        draft.aiUseAsIs.trim().length > 0 || draft.aiRevise.trim().length > 0 || draft.aiRisky.trim().length > 0
      );
    case 'twoWeekPlan':
      return [draft.growthGoal, draft.twoWeekTask, draft.leaderSupport].every((value) => value.trim().length > 0);
    case 'finalFiveLines':
      return hasRequiredCoachingDialogueLines(draft.finalLines);
    default:
      return true;
  }
}
