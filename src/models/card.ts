import type { Face } from "./face";
import type { Pos } from "./pos";
import type { Suit } from "./suit";

export interface Card {
  suit: Suit;
  face: Face;
  value: number;
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
