import type { Round } from '../types';

export const directionPriorityOverrides: Partial<Record<Round['id'], Partial<Round>>> = {
  R1: {
    developmentDirectionPriorityByPath: {
      A_keep: ['one-line-before-question', 'criteria-with-question', 'solo-or-together-line'],
      A_revise: ['one-line-before-question', 'solo-or-together-line', 'criteria-with-question'],
      A_change: ['solo-or-together-line', 'one-line-before-question', 'criteria-with-question'],
      B_keep: ['criteria-with-question', 'one-line-before-question', 'solo-or-together-line'],
      B_revise: ['solo-or-together-line', 'criteria-with-question', 'one-line-before-question'],
      B_change: ['one-line-before-question', 'solo-or-together-line', 'criteria-with-question'],
    },
  },
  R2: {
    developmentDirectionPriorityByPath: {
      A_keep: ['checked-standard-line', 'three-minute-check', 'fast-draft-final-pause'],
      A_revise: ['three-minute-check', 'checked-standard-line', 'fast-draft-final-pause'],
      A_change: ['fast-draft-final-pause', 'three-minute-check', 'checked-standard-line'],
      B_keep: ['three-minute-check', 'checked-standard-line', 'fast-draft-final-pause'],
      B_revise: ['checked-standard-line', 'three-minute-check', 'fast-draft-final-pause'],
      B_change: ['checked-standard-line', 'fast-draft-final-pause', 'three-minute-check'],
    },
  },
  R3: {
    developmentDirectionPriorityByPath: {
      A_keep: ['first-sentence-retry', 'side-by-side-small-inquiry', 'ten-minute-criteria-review'],
      A_revise: ['first-sentence-retry', 'ten-minute-criteria-review', 'side-by-side-small-inquiry'],
      A_change: ['side-by-side-small-inquiry', 'first-sentence-retry', 'ten-minute-criteria-review'],
      B_keep: ['ten-minute-criteria-review', 'first-sentence-retry', 'side-by-side-small-inquiry'],
      B_revise: ['first-sentence-retry', 'ten-minute-criteria-review', 'side-by-side-small-inquiry'],
      B_change: ['side-by-side-small-inquiry', 'first-sentence-retry', 'ten-minute-criteria-review'],
    },
  },
  R4: {
    developmentDirectionPriorityByPath: {
      A_keep: ['verify-critical-items', 'ai-source-note', 'mark-human-edits'],
      A_revise: ['ai-source-note', 'verify-critical-items', 'mark-human-edits'],
      A_change: ['mark-human-edits', 'verify-critical-items', 'ai-source-note'],
      B_keep: ['ai-source-note', 'verify-critical-items', 'mark-human-edits'],
      B_revise: ['verify-critical-items', 'ai-source-note', 'mark-human-edits'],
      B_change: ['mark-human-edits', 'verify-critical-items', 'ai-source-note'],
    },
  },
  R5: {
    developmentDirectionPriorityByPath: {
      A_keep: ['middle-check-time', 'delegation-boundary', 'judgment-review-after-work'],
      A_revise: ['delegation-boundary', 'middle-check-time', 'judgment-review-after-work'],
      A_change: ['middle-check-time', 'delegation-boundary', 'judgment-review-after-work'],
      B_keep: ['delegation-boundary', 'judgment-review-after-work', 'middle-check-time'],
      B_revise: ['judgment-review-after-work', 'delegation-boundary', 'middle-check-time'],
      B_change: ['middle-check-time', 'delegation-boundary', 'judgment-review-after-work'],
    },
  },
  BOSS: {
    developmentDirectionPriorityByPath: {
      A_keep: ['after-report-15min-review', 'next-ai-draft-with-evidence', 'ten-minute-role-split'],
      A_revise: ['after-report-15min-review', 'ten-minute-role-split', 'next-ai-draft-with-evidence'],
      A_change: ['next-ai-draft-with-evidence', 'after-report-15min-review', 'ten-minute-role-split'],
      B_keep: ['ten-minute-role-split', 'after-report-15min-review', 'next-ai-draft-with-evidence'],
      B_revise: ['ten-minute-role-split', 'next-ai-draft-with-evidence', 'after-report-15min-review'],
      B_change: ['after-report-15min-review', 'next-ai-draft-with-evidence', 'ten-minute-role-split'],
    },
  },
};
