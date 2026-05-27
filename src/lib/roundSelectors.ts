import type { LearningSession, Round, RoundId } from '../types';

export function getRoundOrderIndex(roundId: RoundId | string, sessions: LearningSession[]): number {
  const orderedIds = sessions.flatMap((session) => session.roundIds);
  const index = orderedIds.findIndex((id) => id === roundId);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

export function getRoundsForSession(rounds: Round[], session: LearningSession): Round[] {
  const roundMap = new Map(rounds.map((round) => [round.id, round]));
  return session.roundIds
    .map((roundId) => roundMap.get(roundId))
    .filter((round): round is Round => Boolean(round));
}

export function getFirstRoundInSession(rounds: Round[], session: LearningSession): Round {
  return getRoundsForSession(rounds, session)[0] ?? rounds[0];
}
