import type { LearningSession } from '../types';

export const sessions: LearningSession[] = [
  {
    id: 'S1',
    order: 1,
    title: 'Session 1',
    subtitle: 'R1, R2',
    theme: 'Reading and routines',
    guidingQuestion: 'What does this junior need now?',
    miniLectureFocus: 'Signals, criteria, routines',
    artifactName: 'Criteria routine card',
    roundIds: ['R1', 'R2'],
  },
  {
    id: 'S2',
    order: 2,
    title: 'Session 2',
    subtitle: 'R3, R4',
    theme: 'Support and mentoring',
    guidingQuestion: 'How can we support the next attempt?',
    miniLectureFocus: 'Recovery, mentoring, verification',
    artifactName: 'Mentoring memo',
    roundIds: ['R3', 'R4'],
  },
  {
    id: 'S3',
    order: 3,
    title: 'Session 3',
    subtitle: 'R5, Boss Round',
    theme: 'Delegation and empowerment',
    guidingQuestion: 'What can be delegated safely?',
    miniLectureFocus: 'Boundaries, check-ins, role split',
    artifactName: 'Delegation card',
    roundIds: ['R5', 'BOSS'],
  },
];
