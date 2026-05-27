import type { Round } from '../types';
import { normalizeObject } from './roundNormalization';
import { applyRoundOverrides } from './roundOverridePipeline';
import { rounds as sourceRounds } from './rounds';
import { sessions } from './sessions';

const sessionRoundOrder = sessions.flatMap((session) => session.roundIds);

export const rounds: Round[] = sourceRounds
  .map((round) => normalizeObject(applyRoundOverrides(round)))
  .sort((a, b) => sessionRoundOrder.indexOf(a.id) - sessionRoundOrder.indexOf(b.id));
