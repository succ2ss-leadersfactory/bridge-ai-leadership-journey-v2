export type ChoiceId = 'A' | 'B';

export type SecondChoiceId = 'keep' | 'revise' | 'change';

export type AiAnswerReviewKey = 'useAsIs' | 'revise' | 'risky';

export type RoundId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'BOSS';

export type SessionId = 'S1' | 'S2' | 'S3';

export type FlowStepId =
  | 'intro'
  | 'sessionMap'
  | 'roundMap'
  | 'situation'
  | 'juniorReading'
  | 'firstDecision'
  | 'firstResult'
  | 'juniorReaction'
  | 'dilemmaAnalysis'
  | 'secondDecision'
  | 'additionalSituation'
  | 'developmentDirection'
  | 'aiPrompt'
  | 'aiAnswerReview'
  | 'twoWeekPlan'
  | 'finalFiveLines'
  | 'result';

export interface Participant {
  participantId: string;
  teamName: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChoiceOption {
  id: ChoiceId;
  label: string;
  shortLabel: string;
  benefit: string;
  cost: string;
  likelySignal: string;
}

export interface DevelopmentDirectionOption {
  id: string;
  title: string;
  description: string;
  bestWhen: string;
  watchOut: string;
}

export interface AiAnswerReviewOption {
  key: AiAnswerReviewKey;
  label: string;
  description: string;
}

export interface LearningSession {
  id: SessionId;
  order: number;
  title: string;
  subtitle: string;
  theme: string;
  guidingQuestion: string;
  miniLectureFocus: string;
  artifactName: string;
  roundIds: RoundId[];
}

export interface Round {
  id: RoundId;
  order: number;
  title: string;
  subtitle: string;
  juniorName: string;
  juniorRole: string;
  behaviorPattern: string;
  developmentTask: string;
  finalOutput: string;
  situation: string;
  juniorSignals: string[];
  firstQuestion: string;
  firstChoices: ChoiceOption[];
  firstResultByChoice: Record<ChoiceId, string>;
  juniorReaction: string;
  juniorReactionByChoice?: Partial<Record<ChoiceId, string>>;
  dilemmaPrompt: string;
  dilemmaHints: string[];
  secondQuestion: string;
  secondChoices: Array<{
    id: SecondChoiceId;
    label: string;
    description: string;
  }>;
  additionalSituation: string;
  additionalSituationByChoice?: Partial<Record<ChoiceId, string>>;
  developmentPathIntroByChoice?: Partial<Record<ChoiceId, string>>;
  developmentDirections: DevelopmentDirectionOption[];
  aiPromptTemplate: string;
  aiAnswerReviewOptions: AiAnswerReviewOption[];
  twoWeekPlanGuide: {
    growthGoalPlaceholder: string;
    taskPlaceholder: string;
    supportPlaceholder: string;
    checkTimingPlaceholder: string;
    watchOutPlaceholder: string;
  };
  finalFiveLineGuide: string[];
}

export interface LearnerResponseV2 {
  responseId: string;
  participantId: string;
  teamName: string;
  nickname: string;
  roundId: RoundId;
  currentStep: FlowStepId;
  juniorReading: string;
  firstChoice: ChoiceId | '';
  firstReason: string;
  developmentDilemma: string;
  secondChoice: SecondChoiceId | '';
  finalActionId: string;
  developmentDirection: string;
  generatedPrompt: string;
  editedPrompt: string;
  aiUseAsIs: string;
  aiRevise: string;
  aiRisky: string;
  growthGoal: string;
  twoWeekTask: string;
  leaderSupport: string;
  checkTiming: string;
  watchOut: string;
  finalLine1: string;
  finalLine2: string;
  finalLine3: string;
  finalLine4: string;
  finalLine5: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
