import type { Round } from '../types';
import { getRoundOrderIndex } from '../lib/roundSelectors';
import { normalizeObject } from './roundNormalization';
import { applyRoundOverrides } from './roundOverridePipeline';
import { rounds as sourceRounds } from './rounds';
import { sessions } from './sessions';

export const rounds: Round[] = sourceRounds
  .map((round) => normalizeObject(applyRoundOverrides(round)))
  .sort((a, b) => getRoundOrderIndex(a.id, sessions) - getRoundOrderIndex(b.id, sessions));
