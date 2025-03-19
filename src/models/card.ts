import type { Face } from "./face";
import type { Pos } from "./pos";
import type { Suit } from "./suit";

export interface Card {
  suit: Suit;
  face: Face;
  value: number;
  key: number;
  location: string;
  pos: Pos;
  lastPos: Pos;
  draggable: boolean;
  dragging: boolean;
}

export function positionCard(card: Card, x: number, y: number, z: number) {
  card.pos = { x, y, z };
  card.lastPos = { x, y, z };
}

export function debugPrintCard(card: Card) {
  return `${card.face}${card.suit}`;
}

export function debugPrintDeck(deck: Card[]) {
  return deck.map(debugPrintCard).join(",");
}
