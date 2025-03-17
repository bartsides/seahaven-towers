import type { Face } from "./face";
import type { Pos } from "./pos";
import type { Suit } from "./suit";

const debug = false;

export interface Card {
  suit: Suit;
  face: Face;
  value: number;
  key: number;
  location: string;
  pos: Pos;
  lastPos: Pos;
  dragging: boolean;
}

export interface DeckHolder {
  name: string;
  cards: Card[];
}

export function debugPrintCard(card: Card) {
  return `${card.face}${card.suit}`;
}

export function debugPrintDeck(deck: Card[]) {
  return deck.map(debugPrintCard).join(",");
}

export function moveCard(card: Card, source: DeckHolder, dest: DeckHolder) {
  if (debug) console.log("source before", debugPrintDeck(source.cards));
  source.cards = source.cards.filter((c) => c.key !== card.key);
  if (debug) console.log("source after", debugPrintDeck(source.cards));
  if (debug) console.log("dest before", debugPrintDeck(dest.cards));
  dest.cards.push(card);
  card.location = dest.name;
  if (debug) console.log("dest after", debugPrintDeck(dest.cards));
}

export function positionCard(card: Card, x: number, y: number, z: number) {
  card.pos = { x, y, z };
  card.lastPos = { x, y, z };
}
