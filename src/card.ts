import type { Face, Pos, Suit } from "./types";

export interface Card {
  suit: Suit;
  face: Face;
  key: number;
  pos: Pos;
  lastPos: Pos;
}

export function MoveCard(card: Card, x: number, y: number, z: number) {
  card.pos = {
    x: x,
    y: y,
    z: z,
  };
  card.lastPos = {
    x: x,
    y: y,
    z: z,
  };
}
