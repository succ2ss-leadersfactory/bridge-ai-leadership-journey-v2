import type { Round } from '../types';
import { normalizeObject } from './roundNormalization';
import { applyRoundOverrides } from './roundOverridePipeline';
import { rounds as sourceRounds } from './rounds';

export const rounds: Round[] = sourceRounds.map((round) => normalizeObject(applyRoundOverrides(round)));
