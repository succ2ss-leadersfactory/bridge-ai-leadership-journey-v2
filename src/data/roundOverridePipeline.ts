import type { Round } from '../types';
import { fieldLanguageOverrides } from './fieldLanguageOverrides';
import { finalRoundOverrides } from './finalRoundOverrides';
import { pressureSituationOverrides } from './pressureSituationOverrides';
import { r01RefinementOverrides } from './r01RefinementOverrides';
import { roundOverrides } from './roundOverrides';

const overrideLayers: Array<Partial<Record<Round['id'], Partial<Round>>>> = [
  roundOverrides,
  finalRoundOverrides,
  r01RefinementOverrides,
  fieldLanguageOverrides,
  pressureSituationOverrides,
];

export function applyRoundOverrides(round: Round): Round {
  return overrideLayers.reduce(
    (currentRound, overrideLayer) => ({
      ...currentRound,
      ...(overrideLayer[currentRound.id] ?? {}),
    }),
    round,
  );
}
