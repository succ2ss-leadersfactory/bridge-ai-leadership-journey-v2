import { sessions } from '../data/sessions';
import type { Round, RoundId } from '../types';

export function getRoundDisplayCode(roundId: RoundId | string): string {
  for (const session of sessions) {
    const index = session.roundIds.findIndex((id) => id === roundId);
    if (index >= 0) return `${session.id}-${index + 1}`;
  }

  return roundId === 'BOSS' ? 'S3-2' : String(roundId);
}

export function getRoundDisplayTitle(round: Round): string {
  return `${getRoundDisplayCode(round.id)} · ${round.title}`;
}
