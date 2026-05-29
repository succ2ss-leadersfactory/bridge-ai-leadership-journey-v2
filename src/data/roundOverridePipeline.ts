import type { ChoiceId, Round } from '../types';
import { bossDensityOverrides } from './bossDensityOverrides';
import { choicePathOverrides } from './choicePathOverrides';
import { coachingViewpointOverrides } from './coachingViewpointOverrides';
import { applyDirectionTitleOverrides } from './directionTitleOverrides';
import { directionPriorityOverrides } from './directionPriorityOverrides';
import { editorialFlowOverrides } from './editorialFlowOverrides';
import { fieldLanguageOverrides } from './fieldLanguageOverrides';
import { finalRoundOverrides } from './finalRoundOverrides';
import { firstDilemmaChoiceOverrides } from './firstDilemmaChoiceOverrides';
import { pressureSituationOverrides } from './pressureSituationOverrides';
import { r01RefinementOverrides } from './r01RefinementOverrides';
import { r1LineBreakOverrides } from './r1LineBreakOverrides';
import { r2LineBreakOverrides } from './r2LineBreakOverrides';
import { r3RecoveryOverrides } from './r3RecoveryOverrides';
import { r3ToBossLineBreakOverrides } from './r3ToBossLineBreakOverrides';
import { responseDifferentiationOverrides } from './responseDifferentiationOverrides';
import { roundOverrides } from './roundOverrides';
import { applyRoundStoryLineBreaks } from './storyLineBreaks';

const overrideLayers: Array<Partial<Record<Round['id'], Partial<Round>>>> = [
  roundOverrides,
  finalRoundOverrides,
  r01RefinementOverrides,
  fieldLanguageOverrides,
  pressureSituationOverrides,
  firstDilemmaChoiceOverrides,
  choicePathOverrides,
  coachingViewpointOverrides,
  directionPriorityOverrides,
  r1LineBreakOverrides,
  r2LineBreakOverrides,
  r3ToBossLineBreakOverrides,
  responseDifferentiationOverrides,
  r3RecoveryOverrides,
  bossDensityOverrides,
  editorialFlowOverrides,
];

function withCoachingViewpointsInPathIntro(round: Round): Round {
  if (!round.coachingViewpoints?.length) return round;

  const viewpointText = [
    '결과물을 고르기 전, 세 가지 코칭 관점을 잠깐 점검합니다.',
    ...round.coachingViewpoints.map((viewpoint, index) => `${index + 1}. ${viewpoint.title}: ${viewpoint.body}`),
  ].join('\n');

  const currentIntro = round.developmentPathIntroByChoice ?? {};
  const choices: ChoiceId[] = ['A', 'B'];
  const nextIntro = choices.reduce<Partial<Record<ChoiceId, string>>>((acc, choiceId) => {
    const base = currentIntro[choiceId] ?? '';
    acc[choiceId] = base ? `${base}\n\n${viewpointText}` : viewpointText;
    return acc;
  }, {});

  return {
    ...round,
    developmentPathIntroByChoice: nextIntro,
  };
}

export function applyRoundOverrides(round: Round): Round {
  const mergedRound = overrideLayers.reduce(
    (currentRound, overrideLayer) => ({
      ...currentRound,
      ...(overrideLayer[currentRound.id] ?? {}),
    }),
    round,
  );

  return applyRoundStoryLineBreaks(applyDirectionTitleOverrides(withCoachingViewpointsInPathIntro(mergedRound)));
}
