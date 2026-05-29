import type { ChoiceId, Round } from '../types';

const MIN_LENGTH_FOR_AUTO_BREAK = 72;
const MAX_SENTENCES_PER_PARAGRAPH = 2;

function hasManualLineBreak(value: string) {
  return value.includes('\n');
}

function splitSentences(value: string) {
  return value
    .match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [];
}

function groupSentences(sentences: string[]) {
  const groups: string[] = [];

  for (let index = 0; index < sentences.length; index += MAX_SENTENCES_PER_PARAGRAPH) {
    groups.push(sentences.slice(index, index + MAX_SENTENCES_PER_PARAGRAPH).join('\n'));
  }

  return groups;
}

export function applyStoryLineBreaks(value: string) {
  const trimmed = value.trim();

  if (!trimmed || trimmed.length < MIN_LENGTH_FOR_AUTO_BREAK || hasManualLineBreak(trimmed)) {
    return value;
  }

  const sentences = splitSentences(trimmed);

  if (sentences.length <= 1) {
    return value;
  }

  return groupSentences(sentences).join('\n\n');
}

function mapChoiceText(
  value: Partial<Record<ChoiceId, string>> | undefined,
): Partial<Record<ChoiceId, string>> | undefined {
  if (!value) return value;

  return Object.fromEntries(
    Object.entries(value).map(([choiceId, text]) => [choiceId, text ? applyStoryLineBreaks(text) : text]),
  ) as Partial<Record<ChoiceId, string>>;
}

export function applyRoundStoryLineBreaks(round: Round): Round {
  return {
    ...round,
    situation: applyStoryLineBreaks(round.situation),
    juniorReaction: applyStoryLineBreaks(round.juniorReaction),
    additionalSituation: applyStoryLineBreaks(round.additionalSituation),
    dilemmaPrompt: applyStoryLineBreaks(round.dilemmaPrompt),
    firstResultByChoice: {
      A: applyStoryLineBreaks(round.firstResultByChoice.A),
      B: applyStoryLineBreaks(round.firstResultByChoice.B),
    },
    juniorReactionByChoice: mapChoiceText(round.juniorReactionByChoice),
    additionalSituationByChoice: mapChoiceText(round.additionalSituationByChoice),
    developmentPathIntroByChoice: mapChoiceText(round.developmentPathIntroByChoice),
    juniorSignals: round.juniorSignals.map(applyStoryLineBreaks),
    dilemmaHints: round.dilemmaHints.map(applyStoryLineBreaks),
    firstChoices: round.firstChoices.map((choice) => ({
      ...choice,
      label: applyStoryLineBreaks(choice.label),
      benefit: applyStoryLineBreaks(choice.benefit),
      cost: applyStoryLineBreaks(choice.cost),
      likelySignal: applyStoryLineBreaks(choice.likelySignal),
    })),
    secondChoices: round.secondChoices.map((choice) => ({
      ...choice,
      description: applyStoryLineBreaks(choice.description),
    })),
    developmentDirections: round.developmentDirections.map((direction) => ({
      ...direction,
      description: applyStoryLineBreaks(direction.description),
      bestWhen: applyStoryLineBreaks(direction.bestWhen),
      watchOut: applyStoryLineBreaks(direction.watchOut),
    })),
    coachingViewpoints: round.coachingViewpoints?.map((viewpoint) => ({
      ...viewpoint,
      body: applyStoryLineBreaks(viewpoint.body),
    })),
  };
}
