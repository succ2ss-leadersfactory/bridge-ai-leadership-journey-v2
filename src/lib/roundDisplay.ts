import { sessions } from '../data/sessions';
import type { Round, RoundId } from '../types';

const roundDisplayCodeMap = new Map<string, string>(
  sessions.flatMap((session) =>
    session.roundIds.map((roundId, index) => [roundId, `${session.id}-${index + 1}`] as const),
  ),
);

export function getRoundDisplayCode(roundId: RoundId | string): string {
  return roundDisplayCodeMap.get(String(roundId)) ?? String(roundId);
}

export function getRoundDisplayTitle(round: Round): string {
  return `${getRoundDisplayCode(round.id)} · ${round.title}`;
}
