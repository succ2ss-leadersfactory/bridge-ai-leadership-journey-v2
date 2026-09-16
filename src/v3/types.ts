export type V3CaseId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type V3ChoiceId = 'A' | 'B' | 'C';
export type V3SecondChoiceId = 'keep' | 'adjust' | 'switch';
export type V3AiMode = 'none' | 'compare' | 'core' | 'redteam' | 'review';

export type V3StepId =
  | 'intro'
  | 'caseMap'
  | 'situation'
  | 'signals'
  | 'firstDecision'
  | 'consequence'
  | 'newInfo'
  | 'secondDecision'
  | 'theoryBridge'
  | 'practice'
  | 'discussion'
  | 'result'
  | 'playbook';

export interface V3Choice {
  id: V3ChoiceId;
  label: string;
  rationale: string;
  benefit: string;
  cost: string;
}

export interface V3SecondChoice {
  id: V3SecondChoiceId;
  label: string;
  description: string;
}

export interface V3PracticeField {
  id: string;
  label: string;
  helper: string;
  placeholder: string;
}

export interface V3Case {
  id: V3CaseId;
  session: 'READ' | 'DEVELOP' | 'BRIDGE';
  sessionLabel: string;
  title: string;
  hook: string;
  juniorName: string;
  juniorRole: string;
  leadershipDilemma: string;
  situation: string;
  signalQuestion: string;
  signalOptions: string[];
  firstQuestion: string;
  firstChoices: V3Choice[];
  consequenceByChoice: Record<V3ChoiceId, string>;
  newInfoByChoice: Record<V3ChoiceId, string>;
  secondQuestion: string;
  secondChoices: V3SecondChoice[];
  theory: {
    nameKo: string;
    nameEn: string;
    oneLine: string;
    sceneSignal: string;
    leaderMove: string;
    quizConnection: string;
  };
  practiceTitle: string;
  practiceDescription: string;
  practiceFields: V3PracticeField[];
  aiMode: V3AiMode;
  aiUseLabel?: string;
  aiPromptTemplate?: string;
  discussionPrompts: string[];
  takeaway: string;
}

export interface V3CaseDraft {
  selectedSignals: string[];
  firstChoice: V3ChoiceId | '';
  secondChoice: V3SecondChoiceId | '';
  practiceAnswers: Record<string, string>;
  discussionNote: string;
  aiPromptUsed: boolean;
  completedAt?: string;
}

export interface V3Profile {
  teamName: string;
  nickname: string;
}

export interface V3PlaybookDraft {
  moreAction: string;
  lessAction: string;
  twoWeekAction: string;
  savedAt?: string;
}

export interface V3LocalState {
  version: 3;
  profile: V3Profile;
  currentCaseId: V3CaseId | null;
  currentStep: V3StepId;
  cases: Partial<Record<V3CaseId, V3CaseDraft>>;
  playbook: V3PlaybookDraft;
  updatedAt: string;
}
