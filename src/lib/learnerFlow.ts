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
  finalLines: ['', '', '', '', ''],
};

export function createFreshRoundDraft(prev: LearnerDraft): LearnerDraft {
  return {
    ...initialLearnerDraft,
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

function hasCoreCoachingDialogue(finalLines: string[]) {
  return [0, 1, 2].every((index) => (finalLines[index] ?? '').trim().length > 0);
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
      return hasCoreCoachingDialogue(draft.finalLines);
    default:
      return true;
  }
}
