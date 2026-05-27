import type { LearningSession, Round, RoundId } from '../types';

export function getRoundOrderIndex(roundId: RoundId | string, sessions: LearningSession[]): number {
  for (const [sessionIndex, session] of sessions.entries()) {
    const roundIndex = session.roundIds.findIndex((id) => id === roundId);
    if (roundIndex >= 0) return sessionIndex * 100 + roundIndex;
  }

  return Number.MAX_SAFE_INTEGER;
}

export function getRoundsForSession(rounds: Round[], session: LearningSession): Round[] {
  const roundMap: Map<RoundId, Round> = new Map(rounds.map((round) => [round.id, round]));
  return session.roundIds
    .map((roundId) => roundMap.get(roundId))
    .filter((round): round is Round => Boolean(round));
}

export function getFirstRoundInSession(rounds: Round[], session: LearningSession): Round {
  return getRoundsForSession(rounds, session)[0] ?? rounds[0];
}
