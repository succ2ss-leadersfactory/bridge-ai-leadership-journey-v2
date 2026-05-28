import type { Round } from '../types';
import { choicePathOverrides } from './choicePathOverrides';
import { applyDirectionTitleOverrides } from './directionTitleOverrides';
import { directionPriorityOverrides } from './directionPriorityOverrides';
import { fieldLanguageOverrides } from './fieldLanguageOverrides';
import { finalRoundOverrides } from './finalRoundOverrides';
import { firstDilemmaChoiceOverrides } from './firstDilemmaChoiceOverrides';
import { pressureSituationOverrides } from './pressureSituationOverrides';
import { r01RefinementOverrides } from './r01RefinementOverrides';
import { roundOverrides } from './roundOverrides';

const overrideLayers: Array<Partial<Record<Round['id'], Partial<Round>>>> = [
  roundOverrides,
  finalRoundOverrides,
  r01RefinementOverrides,
  fieldLanguageOverrides,
  pressureSituationOverrides,
  firstDilemmaChoiceOverrides,
  choicePathOverrides,
  directionPriorityOverrides,
];

export function applyRoundOverrides(round: Round): Round {
  const mergedRound = overrideLayers.reduce(
    (currentRound, overrideLayer) => ({
      ...currentRound,
      ...(overrideLayer[currentRound.id] ?? {}),
    }),
    round,
  );

  return applyDirectionTitleOverrides(mergedRound);
}
