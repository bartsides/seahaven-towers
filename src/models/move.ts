import type { Card } from "./card";

export interface Move {
  card: Card;
  source: string;
  dest: string;
}

export function debugPrintMove(move?: Move): string {
  if (!move) return "";
  return `${move.card.face}${move.card.suit} ${move.source} -> ${move.dest}`;
}
